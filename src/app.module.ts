import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { HospitalModule } from "src/hospital/hospital.module";
import { Hospital } from "src/hospital/hospital.model";
import { ConfigModule } from "@nestjs/config";
import { AdditionalModule } from "src/additional/additional.module";
import { AuthModule } from "src/auth/auth.module";
import { AppController } from "src/app.controller";
import { ContactUs } from "src/contact-us/contact-us.model";
import { ContactUsModule } from "src/contact-us/contact-us.module";
import { RecycleModule } from "src/recycle/recycle.module";
import { Recycle } from "src/recycle/recycle.model";
import { Drug } from "src/drug/drug.model";
import { DrugModule } from "src/drug/drug.module";
import { SeederModule } from "nestjs-sequelize-seeder";
import { DocumentsModule } from "src/documents/documents.module";
import * as process from "process";
import { Document } from "src/documents/documents.model";
import { DashboardModule } from "./dashboard/dashboard.module";

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
      models: [Hospital, ContactUs, Recycle, Drug, Document],
      autoLoadModels: true,
    }),
    SeederModule.forRoot({
      runOnlyIfTableIsEmpty: true,
      disabled: Boolean(process.env.SEEDER_DISABLED),
    }),
    AdditionalModule,
    HospitalModule,
    AuthModule,
    DrugModule,
    DocumentsModule,
    ContactUsModule,
    RecycleModule,
    DashboardModule,
  ],
})
export class AppModule {}
