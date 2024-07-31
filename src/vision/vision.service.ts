import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import OpenAI from "openai";

@Injectable()
export class VisionService {
  private readonly openai: OpenAI;

  constructor(private readonly configService: ConfigService) {
    this.openai = new OpenAI({
      apiKey: this.configService.get<string>("OPENAI_KEY"),
    });
  }

  async identifyText(image: Express.Multer.File): Promise<any> {
    const base64Image: string = image.buffer.toString("base64");

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

    return JSON.parse(choices[0].message.content);
  }
}
