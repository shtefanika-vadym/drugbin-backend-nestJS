import { Module } from "@nestjs/common";
import { ContactUsController } from "src/contact-us/contact-us.controller";
import { SequelizeModule } from "@nestjs/sequelize";
import { ContactUs } from "src/contact-us/contact-us.model";
import { ContactUsService } from "src/contact-us/contact-us.service";

@Module({
  controllers: [ContactUsController],
  providers: [ContactUsService],
  imports: [SequelizeModule.forFeature([ContactUs])],
  exports: [],
})
export class ContactUsModule {}
