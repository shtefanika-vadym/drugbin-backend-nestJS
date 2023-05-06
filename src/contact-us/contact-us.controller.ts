import { Body, Controller, Get, Post } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { ContactUsService } from "src/contact-us/contact-us.service";
import { CreateContactDto } from "src/contact-us/dto/create-contact.dto";

@ApiTags("Contact Us")
@Controller("contact-us")
export class ContactUsController {
  constructor(private contactUsService: ContactUsService) {}

  // Create contact us
  @ApiOperation({ summary: "Create contact us" })
  @Post()
  async create(@Body() dto: CreateContactDto) {
    const response = await this.contactUsService.create(dto);
    return response;
  }

  // Get all contact us
  @ApiOperation({ summary: "Get list contact us" })
  @Get()
  async getAll() {
    const response = await this.contactUsService.getAll();
    return response;
  }
}
