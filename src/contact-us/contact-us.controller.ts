import { Body, Controller, Post, UsePipes } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { CompanyDto } from "src/company/dto/company.dto";
import { ContactUsService } from "src/contact-us/contact-us.service";
import { CreateContactDto } from "src/contact-us/dto/create-contact.dto";
import { ValidationPipe } from "src/pipes/validation.pipe";

@ApiTags("Contact Us")
@Controller("contact-us")
export class ContactUsController {
  constructor(private contactUsService: ContactUsService) {}

  // Create contact us
  @UsePipes(ValidationPipe)
  @ApiOperation({ summary: "Create contact us" })
  @ApiResponse({ status: 200, type: [CompanyDto] })
  @Post()
  async create(@Body() dto: CreateContactDto) {
    const response = await this.contactUsService.create(dto);
    return response;
  }
}
