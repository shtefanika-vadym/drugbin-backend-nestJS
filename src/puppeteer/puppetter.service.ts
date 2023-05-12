import * as fs from "fs";
import * as path from "path";
import * as puppeteer from "puppeteer";
import { Injectable } from "@nestjs/common";
import * as handlebars from "handlebars";
import { TemplateDelegate } from "handlebars";

@Injectable()
export class PuppeteerService {
  async generatePDF(
    templateName: string,
    templateData: object
  ): Promise<Buffer> {
    const template: TemplateDelegate = handlebars.compile(
      fs.readFileSync(
        path.resolve(path.join(process.cwd(), "templates"), templateName),
        "utf-8"
      )
    );

    const html: string = template(templateData);

    const browser: puppeteer.Browser = await puppeteer.connect({
      browserWSEndpoint: `wss://${process.env.BROWSERLESS}`,
    });
    const page: puppeteer.Page = await browser.newPage();
    await page.setContent(html);

    const buffer = await page.pdf({
      format: "A4",
      margin: {
        left: "20mm",
        top: "20mm",
        right: "20mm",
        bottom: "20mm",
      },
    });

    await browser.close();

    return buffer;
  }
}
