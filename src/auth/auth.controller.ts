import { Body, Controller, Post } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { CreateCompanyDto } from "src/company/dto/create-company.dto";
import { AuthService } from "./auth.service";
import { LoginDto } from "src/auth/dto/login.dto";

@ApiTags("Auth")
@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: "Login company" })
  @Post("/login")
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @ApiOperation({ summary: "Register company" })
  @Post("/register")
  registration(@Body() companyDto: CreateCompanyDto) {
    return this.authService.register(companyDto);
  }
}
