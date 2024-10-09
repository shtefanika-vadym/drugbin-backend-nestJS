import * as fs from "fs";
import * as path from "path";
import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import OpenAI from "openai";
import * as sharp from "sharp";
import {
  DrugCategories,
  IdentifiedDrug,
} from "src/vision/interfaces/identified-drug.interface";

@Injectable()
export class VisionService {
  private readonly openai: OpenAI;
  private readonly logger: Logger = new Logger(VisionService.name);

  constructor(private readonly configService: ConfigService) {
    this.openai = new OpenAI({
      apiKey: this.configService.get<string>("OPENAI_KEY"),
    });
  }

  private async identifyDrugsFromImage(
    base64Image: string
  ): Promise<IdentifiedDrug[]> {
    const isProduction =
      this.configService.get<string>("NODE_ENV") === "production";

    const modelPrompt = !isProduction
      ? await this.readModelPromptFile()
      : this.configService.get<string>("MODEL_PROMPT");
    const { choices } = await this.openai.chat.completions.create({
      model: this.configService.get<string>("MODEL"),
      temperature: 0,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: modelPrompt,
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${base64Image}`,
                detail: "high",
              },
            },
          ],
        },
      ],
      response_format: { type: "json_object" },
    });

    return JSON.parse(choices[0].message.content).result;
  }

  async identifyDrugs(image: Express.Multer.File): Promise<IdentifiedDrug[]> {
    const buffer: Buffer = await sharp(image.buffer)
      .toFormat("jpeg", { quality: 100 })
      .toBuffer();

    const base64Image: string = buffer.toString("base64");

    const drugs = await this.identifyDrugsFromImage(base64Image);

    return this.processIdentifiedDrugs(drugs);
  }

  private processIdentifiedDrugs(drugs: IdentifiedDrug[]): IdentifiedDrug[] {
    const updateCategory = (
      drug: IdentifiedDrug,
      newCategory: DrugCategories
    ): void => {
      this.logCategoryChange(drug.name, newCategory, drug.category);
      drug.category = newCategory;
    };

    return drugs.map((drug: IdentifiedDrug): IdentifiedDrug => {
      if (drug.category === DrugCategories.Injectables || !drug.atc)
        return drug;

      switch (true) {
        case drug.atc.startsWith("A10") &&
          drug.category !== DrugCategories.Insulin:
          updateCategory(drug, DrugCategories.Insulin);
          break;
        case drug.atc.startsWith("N05") &&
          drug.category !== DrugCategories.Psycholeptics:
          updateCategory(drug, DrugCategories.Psycholeptics);
          break;
        case drug.atc.startsWith("R03") &&
          drug.category !== DrugCategories.Inhalers:
          updateCategory(drug, DrugCategories.Inhalers);
          break;
        case drug.package === "injectable" || drug.text.includes("injectabil"):
          updateCategory(drug, DrugCategories.Injectables);
          break;
      }

      return drug;
    });
  }

  private logCategoryChange(
    drugName: string,
    updatedCategory: number,
    identifiedCategory: number
  ): void {
    this.logger.warn(
      `Detected '${drugName}'. Setting category to "${updatedCategory}". Identified category: ${identifiedCategory}.`
    );
  }

  async readModelPromptFile(): Promise<string> {
    try {
      const filePath = path.resolve(
        path.join(process.cwd(), ""),
        "model-prompt.txt"
      );
      const data = fs.readFileSync(filePath, "utf-8");

      return data.replace(/\s+/g, " ").trim();
    } catch (error) {
      console.error("Error reading file:", error);
      throw new Error("Error reading file");
    }
  }
}
