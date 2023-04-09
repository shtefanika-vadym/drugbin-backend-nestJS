import { Body, Controller, Post, UsePipes } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { CreateCompanyDto } from "src/company/dto/create-company.dto";
import { AuthService } from "./auth.service";
import { LoginCompanyDto } from "src/company/dto/login-company.dto";
import { ValidationPipe } from "src/pipes/validation.pipe";

@ApiTags("Auth")
@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: "Login company" })
  @UsePipes(ValidationPipe)
  @Post("/login")
  login(@Body() dto: LoginCompanyDto) {
    return this.authService.login(dto);
  }

  @ApiOperation({ summary: "Register company" })
  @UsePipes(ValidationPipe)
  @Post("/register")
  registration(@Body() companyDto: CreateCompanyDto) {
    return this.authService.register(companyDto);
  }
}
