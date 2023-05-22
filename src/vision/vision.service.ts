import { Injectable } from "@nestjs/common";
import { ImageAnnotatorClient } from "@google-cloud/vision";
import { Express } from "express";
import * as path from "path";
import { Readable } from "stream";
import * as Jimp from "jimp";

@Injectable()
export class VisionService {
  async identifyText(image: Express.Multer.File): Promise<string[][]> {
    const visionClient: ImageAnnotatorClient = new ImageAnnotatorClient({
      keyFilename: path.join(
        process.cwd(),
        "src",
        "vision",
        "drugbin-vision-api.json"
      ),
    });

    const stream: Readable = Readable.from(image.buffer);

    const buffer = await streamToBuffer(stream);

    const [imageAnnotation] = await visionClient.annotateImage({
      image: {
        content: buffer,
      },
      features: [{ type: "OBJECT_LOCALIZATION" }],
    });

    const resultList: string[][] = [];

    const objects = imageAnnotation.localizedObjectAnnotations;
    for (const object of objects) {
      const vertices = object.boundingPoly.normalizedVertices;

      try {
        const imageForCrop: Jimp = await Jimp.read(buffer);
        const x1: number = Math.round(
          vertices[0].x * imageForCrop.bitmap.width
        );
        const y1: number = Math.round(
          vertices[0].y * imageForCrop.bitmap.height
        );
        const x2: number = Math.round(
          vertices[2].x * imageForCrop.bitmap.width
        );
        const y2: number = Math.round(
          vertices[2].y * imageForCrop.bitmap.height
        );

        const croppedImage: Jimp = imageForCrop.crop(x1, y1, x2 - x1, y2 - y1);

        const [croppedImageAnnotation] = await visionClient.annotateImage({
          image: {
            content: await croppedImage.getBufferAsync(Jimp.MIME_JPEG),
          },
          features: [{ type: "DOCUMENT_TEXT_DETECTION" }],
        });

        const croppedTextAnnotations = croppedImageAnnotation.textAnnotations;

        const textList: string[] = removeDiacritics(
          croppedTextAnnotations[0].description
        )
          .split("\n")
          .map((str: string) =>
            str.replace("mg", " mg").split(/[ /-]/)
          )
          .reduce((acc, val) => acc.concat(val), []);

        resultList.push(
          [...new Set(textList)].filter(
            (str: string): boolean => str.length > 0
          )
        );

        // await croppedImage.writeAsync(
        //   path.join(
        //     process.cwd(),
        //     "src",
        //     "vision",
        //     `cropped_${new Date().getTime()}.jpg`
        //   )
        // );
      } catch (error) {
        console.error("Error processing image:", error);
      }
    }

    return resultList;
  }
}

function streamToBuffer(stream: Readable): Promise<Buffer> {
  return new Promise((resolve, reject): void => {
    const chunks: Buffer[] = [];
    stream.on("data", (chunk: Buffer) => chunks.push(chunk));
    stream.on("end", () => resolve(Buffer.concat(chunks)));
    stream.on("error", (error: Error) => reject(error));
  });
}

function removeDiacritics(text: string): string {
  const diacriticsMap = {
    ă: "a",
    â: "a",
    î: "i",
    ș: "s",
    ş: "s",
    ț: "t",
    Ă: "A",
    Â: "A",
    Î: "I",
    Ș: "S",
    Ț: "T",
  };

  return text.replace(
    /[ăâîșşțĂÂÎȘȚ]/g,
    (match: string) => diacriticsMap[match]
  );
}
