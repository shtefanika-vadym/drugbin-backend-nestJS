import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { CreateHospitalDto } from "src/hospital/dto/create-hospital.dto";
import { HospitalService } from "src/hospital/hospital.service";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcryptjs";
import { Hospital } from "src/hospital/hospital.model";
import { LoginDto } from "src/auth/dto/login.dto";
import { LoginResponse } from "src/auth/responses/login-response";
import { MessageResponse } from "src/reponses/message-response";

@Injectable()
export class AuthService {
  constructor(
    private pharmacistService: HospitalService,
    private jwtService: JwtService
  ) {}

  async login(companyDto: LoginDto): Promise<LoginResponse> {
    const user: Hospital = await this.validateCompany(companyDto);
    return this.generateToken(user);
  }

  async register(companyDto: CreateHospitalDto): Promise<MessageResponse> {
    // TODO: Update
    const candidate: Hospital = await this.pharmacistService.getHospitalByEmail(
      1
    );
    if (candidate) {
      throw new HttpException(
        "Company with same email already exists",
        HttpStatus.BAD_REQUEST
      );
    }
    const hashPassword = await bcrypt.hash(companyDto.password, 5);
    await this.pharmacistService.createHospital({
      ...companyDto,
      password: hashPassword,
    });
    return { message: "Company successfully registered." };
  }

  async generateToken(user: Hospital): Promise<LoginResponse> {
    const payload = { id: user.id };
    return {
      token: this.jwtService.sign(payload),
    };
  }

  async validateCompany(companyDto: LoginDto): Promise<Hospital> {
    // TODO: Update
    const company: Hospital = await this.pharmacistService.getHospitalByEmail(
      1
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
