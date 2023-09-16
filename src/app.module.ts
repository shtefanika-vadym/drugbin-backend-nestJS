import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { PharmacyModule } from "src/pharmacies/pharmacy.module";
import { Pharmacy } from "src/pharmacies/pharmacy.model";
import { ConfigModule } from "@nestjs/config";
import { AdditionalModule } from "src/additional/additional.module";
import { AuthModule } from "src/auth/auth.module";
import { AppController } from "src/app.controller";
import { ContactUs } from "src/contact-us/contact-us.model";
import { ContactUsModule } from "src/contact-us/contact-us.module";
import { RecycleDrugModule } from "src/recycle-drug/recycle-drug.module";
import { RecycleDrug } from "src/recycle-drug/recycle-drug.model";
import { Drug } from "src/drugs/drugs.model";
import { DrugsModule } from "src/drugs/drugs.module";
import { SeederModule } from "nestjs-sequelize-seeder";
import { ChainsModule } from "src/chains/chains.module";
import { Chain } from "src/chains/chains.model";
import { DocumentsModule } from "src/documents/documents.module";
import * as process from "process";
import { Document } from "src/documents/documents.model";

@Module({
  controllers: [AppController],
  providers: [],
  imports: [
    ConfigModule.forRoot({
      envFilePath: ".env",
    }),
    SequelizeModule.forRoot({
      dialect: "postgres",
      host: process.env.POSTGRES_HOST,
      port: Number(process.env.POSTGRESS_PORT),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRESS_PASSWORD,
      database: process.env.POSTGRES_DB,
      models: [Pharmacy, ContactUs, RecycleDrug, Drug, Chain, Document],
      autoLoadModels: true,
    }),
    SeederModule.forRoot({
      runOnlyIfTableIsEmpty: true,
      disabled: Boolean(process.env.SEEDER_DISABLED),
    }),
    AdditionalModule,
    PharmacyModule,
    AuthModule,
    DrugsModule,
    ChainsModule,
    DocumentsModule,
    ContactUsModule,
    RecycleDrugModule,
  ],
})
export class AppModule {}
