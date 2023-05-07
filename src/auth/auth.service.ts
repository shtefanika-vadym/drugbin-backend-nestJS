import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { CreateCompanyDto } from "src/company/dto/create-company.dto";
import { CompanyService } from "src/company/company.service";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcryptjs";
import { Company } from "src/company/company.model";
import { LoginDto } from "src/auth/dto/login.dto";
import { LoginResponse } from "src/auth/responses/login-response";
import { MessageResponse } from "src/reponses/message-response";

@Injectable()
export class AuthService {
  constructor(
    private pharmacistService: CompanyService,
    private jwtService: JwtService
  ) {}

  async login(companyDto: LoginDto): Promise<LoginResponse> {
    const user: Company = await this.validateCompany(companyDto);
    return this.generateToken(user);
  }

  async register(companyDto: CreateCompanyDto): Promise<MessageResponse> {
    const candidate: Company = await this.pharmacistService.getCompanyByEmail(
      companyDto.email
    );
    if (candidate) {
      throw new HttpException(
        "Company with same email already exists",
        HttpStatus.BAD_REQUEST
      );
    }
    const hashPassword = await bcrypt.hash(companyDto.password, 5);
    await this.pharmacistService.createCompany({
      ...companyDto,
      password: hashPassword,
    });
    return { message: "Company successfully registered." };
  }

  async generateToken(user: Company): Promise<LoginResponse> {
    const payload = { email: user.email, id: user.id, role: user.role };
    return {
      role: user.role,
      token: this.jwtService.sign(payload),
    };
  }

  async validateCompany(companyDto: LoginDto): Promise<Company> {
    const company: Company = await this.pharmacistService.getCompanyByEmail(
      companyDto.email
    );
    if (!company)
      throw new NotFoundException({
        message: "Company not found",
      });

    const passwordEquals = await bcrypt.compare(
      companyDto.password,
      company.password
    );
    if (company && passwordEquals) {
      return company;
    }
    throw new BadRequestException({
      message: "Invalid email or password",
    });
  }
}
