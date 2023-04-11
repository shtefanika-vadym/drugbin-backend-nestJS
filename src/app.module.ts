import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { CompanyModule } from "src/company/company.module";
import { Company } from "src/company/company.model";
import { ExpiredProductsModule } from "src/expired-products/expired-products.module";
import { ExpiredProduct } from "src/expired-products/expired-products.model";
import { ConfigModule } from "@nestjs/config";
import { Sequelize } from "sequelize";
import { AdditionalModule } from "src/additional/additional.module";
import { AuthModule } from "src/auth/auth.module";
import { AppController } from "src/app.controller";
import { DrugStock } from "src/drug-stock/drug-stock.model";
import { DrugStockModule } from "src/drug-stock/drug-stock.module";

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
      models: [Company, ExpiredProduct, DrugStock],
      autoLoadModels: true,
    }),
    AdditionalModule,
    CompanyModule,
    AuthModule,
    DrugStockModule,
    ExpiredProductsModule,
  ],
})
export class AppModule {
  constructor(private readonly sequelize: Sequelize) {}

  async onModuleInit() {
    await this.sequelize.sync();
  }
}
