import { Body, Controller, Post } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { CreateCompanyDto } from "src/company/dto/create-company.dto";
import { AuthService } from "./auth.service";
import { LoginDto } from "src/auth/dto/login.dto";
import { LoginResponse } from "src/auth/responses/login-response";
import { MessageResponse } from "src/reponses/message-response";

@ApiTags("Auth")
@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: "Login company" })
  @ApiResponse({ status: 200, type: LoginResponse })
  @Post("/login")
  login(@Body() dto: LoginDto): Promise<LoginResponse> {
    return this.authService.login(dto);
  }

  @ApiOperation({ summary: "Register company" })
  @ApiResponse({ status: 200, type: MessageResponse })
  @Post("/register")
  registration(@Body() companyDto: CreateCompanyDto): Promise<MessageResponse> {
    return this.authService.register(companyDto);
  }
}
