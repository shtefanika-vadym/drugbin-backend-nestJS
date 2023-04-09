import { Module } from "@nestjs/common";
import { ExpiredProductsService } from "src/expired-products/expired-products.service";
import { ExpiredProductsController } from "src/expired-products/expired-products.controller";
import { SequelizeModule } from "@nestjs/sequelize";
import { Company } from "src/company/company.model";
import { ExpiredProduct } from "src/expired-products/expired-products.model";
import { JwtModule } from "@nestjs/jwt";

@Module({
  providers: [ExpiredProductsService],
  controllers: [ExpiredProductsController],
  imports: [
    SequelizeModule.forFeature([Company, ExpiredProduct]),
    JwtModule.register({
      secret: "SECRET",
      signOptions: {
        expiresIn: "24h",
      },
    }),
  ],
})
export class ExpiredProductsModule {}
