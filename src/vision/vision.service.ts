import { Injectable } from "@nestjs/common";
import { ImageAnnotatorClient } from "@google-cloud/vision";
import { Express } from "express";
import * as path from "path";
import { Readable } from "stream";

@Injectable()
export class VisionService {
  async identifyText(image: Express.Multer.File): Promise<string[]> {
    const visionClient: ImageAnnotatorClient = new ImageAnnotatorClient({
      keyFilename: path.join(
        process.cwd(),
        "src",
        "vision",
        "drugbin-vision-api.json"
      ),
    });

    const stream: Readable = Readable.from(image.buffer);

    const [result] = await visionClient.annotateImage({
      image: {
        content: await streamToBuffer(stream),
      },
      features: [{ type: "TEXT_DETECTION" }],
    });

    const textAnnotations = result.textAnnotations;
    const textList: string[] = textAnnotations[0].description
      .split("\n")
      .map((str: string) => str.split(" "))
      .reduce((acc, val) => acc.concat(val), []);
    return [...new Set(textList)].filter((str: string) => str.length > 0);
  }
}

function streamToBuffer(stream: Readable): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    stream.on("data", (chunk: Buffer) => chunks.push(chunk));
    stream.on("end", () => resolve(Buffer.concat(chunks)));
    stream.on("error", (error: Error) => reject(error));
  });
}
