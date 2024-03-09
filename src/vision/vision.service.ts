import { Injectable } from "@nestjs/common";
import { ImageAnnotatorClient } from "@google-cloud/vision";
import { Readable } from "stream";
import * as Jimp from "jimp";
import Anthropic from "@anthropic-ai/sdk";

// TODO: Refactor
@Injectable()
export class VisionService {
  async identifyText(image: Express.Multer.File): Promise<string[]> {
    const visionClient: ImageAnnotatorClient = new ImageAnnotatorClient({
      credentials: {
        private_key: process.env.GOOGLE_PRIVATE_KEY,
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
      },
    });

    const stream: Readable = Readable.from(image.buffer);

    const buffer = await streamToBuffer(stream);
    const [imageAnnotation] = await visionClient.annotateImage({
      image: {
        content: buffer,
      },
      features: [{ type: "OBJECT_LOCALIZATION" }],
    });

    const resultList: any[] = [];

    const objects = imageAnnotation.localizedObjectAnnotations;

    for (const object of objects) {
      const vertices = object.boundingPoly.normalizedVertices;
      try {
        const imageForCrop = await Jimp.read(buffer);
        const x1 = Math.round(vertices[0].x * imageForCrop.bitmap.width);
        const y1 = Math.round(vertices[0].y * imageForCrop.bitmap.height);
        const x2 = Math.round(vertices[2].x * imageForCrop.bitmap.width);
        const y2 = Math.round(vertices[2].y * imageForCrop.bitmap.height);

        let croppedImage = imageForCrop.crop(x1, y1, x2 - x1, y2 - y1);

        if (
          croppedImage.bitmap.width < 500 ||
          croppedImage.bitmap.height < 500
        ) {
          croppedImage = croppedImage.cover(500, 500);
        }

        const imageBuffer = await croppedImage.getBufferAsync(Jimp.MIME_JPEG);
        // await croppedImage.writeAsync(
        //   path.join(
        //     process.cwd(),
        //     "src",
        //     "vision",
        //     `cropped_${new Date().getTime()}.jpg`
        //   )
        // );
        const result = await detect(imageBuffer.toString("base64"));
        resultList.push(result);
      } catch (e) {
        console.log("eee");
      }
      // const promises = objects.map(async (object) => {
      //   const vertices = object.boundingPoly.normalizedVertices;
      //   try {
      //     const imageForCrop = await Jimp.read(buffer);
      //     const x1 = Math.round(vertices[0].x * imageForCrop.bitmap.width);
      //     const y1 = Math.round(vertices[0].y * imageForCrop.bitmap.height);
      //     const x2 = Math.round(vertices[2].x * imageForCrop.bitmap.width);
      //     const y2 = Math.round(vertices[2].y * imageForCrop.bitmap.height);
      //
      //     let croppedImage = imageForCrop.crop(x1, y1, x2 - x1, y2 - y1);
      //
      //     if (
      //       croppedImage.bitmap.width < 500 ||
      //       croppedImage.bitmap.height < 500
      //     ) {
      //       croppedImage = croppedImage.cover(500, 500);
      //     }
      //
      //     const imageBuffer = await croppedImage.getBufferAsync(Jimp.MIME_JPEG);
      //     // await croppedImage.writeAsync(
      //     //   path.join(
      //     //     process.cwd(),
      //     //     "src",
      //     //     "vision",
      //     //     `cropped_${new Date().getTime()}.jpg`
      //     //   )
      //     // );
      //     const result = await detect(imageBuffer.toString("base64"));
      //     console.log(result, "here");
      //     return result;
      //   } catch (error) {
      //     console.error("Error processing image:", error);
      //     return null; // Return null or handle error cases as per your requirement
      //   }
      // });
      //
      // try {
      //   const resultList = await Promise.all(promises);
      //   console.log(resultList);
      //   return resultList.filter(
      //     (result) => !result || !Object.keys(result).length
      //   );
      // } catch (error) {
      //   console.error("Error processing images:", error);
      //   return [];
      // }
    }
    return resultList;
  }
}

async function detect(
  img: string
  // type: "image/jpeg" | "image/png" | "image/gif" | "image/webp"
) {
  const anthropic = new Anthropic({
    apiKey: process.env.CLAUDE_API,
  });

  const msg = await anthropic.messages.create({
    model: process.env.CLAUDE_MODEL,
    max_tokens: 1024,
    system:
      "Sistemul de identificare a medicamentelor:\n" +
      "\n" +
      "Obiectiv: Analizarea ambalajelor produselor farmaceutice și identificarea precisă a denumirii medicamentului.\n" +
      "\n" +
      "Regulă de bază: În ambalajele standard, denumirea medicamentului este afișată cu un font de dimensiuni mai mari comparativ cu alte detalii.\n" +
      "\n" +
      "Sarcină:\n" +
      "1. Procesați imaginea ambalajului furnizată.\n" +
      "2. Identificați textul care corespunde denumirii medicamentului, ținând cont de dimensiunea fontului.\n" +
      "3. Validați denumirea medicamentului identificată.\n" +
      "\n" +
      "Rezultat așteptat:\n" +
      "- Dacă denumirea medicamentului este validă, returnați un obiect JSON cu următoarele chei:\n" +
      '    - "name": Denumirea medicamentului în limba română (șir de caractere)\n' +
      '    - "package": Tipul ambalajului, fie "Cutie", fie "Blister" (șir de caractere)\n' +
      '    - "concentration": Concentrația medicamentului, în format "valoare numerică + unitate" (ex: "500 mg", "10 ml") (șir de caractere, opțional)\n' +
      "- Dacă nu se identifică o denumire validă de medicament, returnați un obiect JSON gol {}.\n" +
      "\n" +
      "Notă: Asigurați-vă că rezultatul conține exclusiv informațiile solicitate, fără caractere sau elemente suplimentare.",
    messages: [
      {
        role: "user",
        content: [
          {
            type: "image",
            source: {
              type: "base64",
              data: img,
              media_type: "image/jpeg",
            },
          },
        ],
      },
    ],
  });

  return extractJson(msg.content[0].text);
}

const extractJson = (string: string) => {
  const startIndex = string.indexOf("{");
  const endIndex = string.lastIndexOf("}");

  const jsonObjectString = string.substring(startIndex, endIndex + 1);

  return JSON.parse(jsonObjectString);
};

function streamToBuffer(stream: Readable): Promise<Buffer> {
  return new Promise((resolve, reject): void => {
    const chunks: Buffer[] = [];
    stream.on("data", (chunk: Buffer) => chunks.push(chunk));
    stream.on("end", () => resolve(Buffer.concat(chunks)));
    stream.on("error", (error: Error) => reject(error));
  });
}
