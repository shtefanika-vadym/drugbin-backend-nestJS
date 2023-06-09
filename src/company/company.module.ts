import { forwardRef, Module } from "@nestjs/common";
import { CompanyController } from "src/company/company.controller";
import { CompanyService } from "src/company/company.service";
import { SequelizeModule } from "@nestjs/sequelize";
import { Company } from "src/company/company.model";
import { AuthModule } from "src/auth/auth.module";

@Module({
  controllers: [CompanyController],
  providers: [CompanyService],
  imports: [
    SequelizeModule.forFeature([Company]),
    forwardRef(() => AuthModule),
  ],
  exports: [CompanyService],
})
export class CompanyModule {}
