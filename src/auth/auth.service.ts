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
import { LoginCompanyDto } from "src/company/dto/login-company.dto";

@Injectable()
export class AuthService {
  constructor(
    private pharmacistService: CompanyService,
    private jwtService: JwtService
  ) {}

  async login(companyDto: LoginCompanyDto) {
    const user = await this.validateCompany(companyDto);
    return this.generateToken(user);
  }

  async register(companyDto: CreateCompanyDto) {
    const candidate = await this.pharmacistService.getCompanyByEmail(
      companyDto.email
    );
    if (candidate) {
      throw new HttpException(
        "Company with same email already exists",
        HttpStatus.BAD_REQUEST
      );
    }
    const hashPassword = await bcrypt.hash(companyDto.password, 5);
    const user = await this.pharmacistService.createCompany({
      ...companyDto,
      password: hashPassword,
    });
    return { message: "Company successfully registered." };
  }

  private async generateToken(user: Company) {
    const payload = { email: user.email, id: user.id, role: user.role };
    return {
      role: user.role,
      token: this.jwtService.sign(payload),
    };
  }

  private async validateCompany(companyDto: LoginCompanyDto) {
    const company = await this.pharmacistService.getCompanyByEmail(
      companyDto.email
    );
    if (!company)
      throw new NotFoundException({
        message: "Company not registered",
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
