import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import OpenAI from "openai";
import * as sharp from "sharp";

@Injectable()
export class VisionService {
  private readonly openai: OpenAI;

  constructor(private readonly configService: ConfigService) {
    this.openai = new OpenAI({
      apiKey: this.configService.get<string>("OPENAI_KEY"),
    });
  }

  async identifyText(image: Express.Multer.File): Promise<any> {
    const buffer: Buffer = await sharp(image.buffer)
      .toFormat("jpeg", { quality: 100 })
      .toBuffer();

    const base64Image: string = buffer.toString("base64");

    const { choices } = await this.openai.chat.completions.create({
      model: this.configService.get<string>("MODEL"),
      temperature: 0,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: this.configService.get<string>("MODEL_PROMPT"),
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

    const data = JSON.parse(choices[0].message.content);
    data.result = data.result.map((drug: any) => {
      if (drug.package === "injectable") {
        drug.category = 3;
      }
      return drug;
    });

    return data;
  }
}
