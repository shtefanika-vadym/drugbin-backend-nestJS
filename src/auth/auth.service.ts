import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { CreatePharmacyDto } from "src/pharmacies/dto/create-pharmacy.dto";
import { PharmacyService } from "src/pharmacies/pharmacy.service";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcryptjs";
import { Pharmacy } from "src/pharmacies/pharmacy.model";
import { LoginDto } from "src/auth/dto/login.dto";
import { LoginResponse } from "src/auth/responses/login-response";
import { MessageResponse } from "src/reponses/message-response";

@Injectable()
export class AuthService {
  constructor(
    private pharmacistService: PharmacyService,
    private jwtService: JwtService
  ) {}

  async login(companyDto: LoginDto): Promise<LoginResponse> {
    const user: Pharmacy = await this.validateCompany(companyDto);
    return this.generateToken(user);
  }

  async register(companyDto: CreatePharmacyDto): Promise<MessageResponse> {
    const candidate: Pharmacy = await this.pharmacistService.getCompanyByEmail(
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

  async generateToken(user: Pharmacy): Promise<LoginResponse> {
    const payload = { email: user.email, id: user.id };
    return {
      token: this.jwtService.sign(payload),
    };
  }

  async validateCompany(companyDto: LoginDto): Promise<Pharmacy> {
    const company: Pharmacy = await this.pharmacistService.getCompanyByEmail(
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
