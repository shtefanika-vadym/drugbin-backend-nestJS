import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { CreateContactDto } from "src/contact-us/dto/create-contact.dto";
import { ContactUs } from "src/contact-us/contact-us.model";
import { MessageResponse } from "src/reponses/message-response";

@Injectable()
export class ContactUsService {
  constructor(
    @InjectModel(ContactUs) private contactUsRepository: typeof ContactUs
  ) {}

  async create(dto: CreateContactDto): Promise<MessageResponse> {
    await this.contactUsRepository.create(dto);
    return {
      message: "Thanks! We will contact you shortly",
    };
  }

  async getAll(): Promise<ContactUs[]> {
    return await this.contactUsRepository.findAll({
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });
  }
}
