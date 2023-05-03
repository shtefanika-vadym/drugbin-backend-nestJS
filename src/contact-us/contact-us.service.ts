import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { CreateContactDto } from "src/contact-us/dto/create-contact.dto";
import { ContactUs } from "src/contact-us/contact.model";

@Injectable()
export class ContactUsService {
  constructor(
    @InjectModel(ContactUs) private contactUsRepository: typeof ContactUs
  ) {}

  async create(dto: CreateContactDto) {
    await this.contactUsRepository.create(dto);
    return {
      message: "Thanks! We will contact you shortly",
    };
  }
}
