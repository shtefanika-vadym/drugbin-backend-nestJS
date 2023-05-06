import { Body, Controller, Get, Post } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { ContactUsService } from "src/contact-us/contact-us.service";
import { CreateContactDto } from "src/contact-us/dto/create-contact.dto";
import { ContactUs } from "src/contact-us/contact-us.model";
import { MessageResponse } from "src/reponses/message-response";

@ApiTags("Contact Us")
@Controller("contact-us")
export class ContactUsController {
  constructor(private contactUsService: ContactUsService) {}

  // Create contact us
  @ApiOperation({ summary: "Create contact us" })
  @ApiResponse({ status: 200, type: MessageResponse })
  @Post()
  create(@Body() dto: CreateContactDto): Promise<MessageResponse> {
    return this.contactUsService.create(dto);
  }

  // Get all contact us
  @ApiOperation({ summary: "Get list contact us" })
  @ApiResponse({ status: 200, type: [ContactUs] })
  @Get()
  getAll(): Promise<ContactUs[]> {
    return this.contactUsService.getAll();
  }
}
