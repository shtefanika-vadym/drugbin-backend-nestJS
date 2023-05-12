import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AppModule } from "src/app.module";
import { HandlebarsUtils } from "src/utils/handlebars.utils";
import { ValidationPipe } from "@nestjs/common";

async function start() {
  const PORT = process.env.PORT || 5000;
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  });

  const config = new DocumentBuilder()
    .setTitle("Drugbin")
    .setDescription("Documentation REST API")
    .setVersion("1.0.0")
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("/api/docs", app, document);

  app.useGlobalPipes(new ValidationPipe());
  HandlebarsUtils.registerHandlebarsHelpers();
  await app.listen(PORT, () => console.log(`Server started on port = ${PORT}`));
}

start();
