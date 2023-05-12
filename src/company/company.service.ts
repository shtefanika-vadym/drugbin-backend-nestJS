import { Injectable, NotFoundException } from "@nestjs/common";
import { Company } from "src/company/company.model";
import { InjectModel } from "@nestjs/sequelize";
import { CreateCompanyDto } from "src/company/dto/create-company.dto";
import { Role } from "src/company/enum/Role";
import { UpdateCompanyDto } from "src/company/dto/update-company.dto";
import { MessageResponse } from "src/reponses/message-response";

@Injectable()
export class CompanyService {
  constructor(
    @InjectModel(Company) private companyRepository: typeof Company
  ) {}

  async createCompany(dto: CreateCompanyDto): Promise<Company> {
    const user: Company = await this.companyRepository.create(dto);
    return user;
  }

  async getAllCompanies(role: Role): Promise<Company[]> {
    const companies: Company[] = await this.companyRepository.findAll({
      where: { role },
      attributes: ["id", "name", "email", "weight"],
    });
    return companies;
  }

  async updateCompany(
    dto: UpdateCompanyDto,
    id: string
  ): Promise<MessageResponse> {
    const company: Company = await this.companyRepository.findByPk(id);
    if (!company)
      throw new NotFoundException(`Company with id ${id} does not exist`);

    await company.update(dto);
    return { message: "Company successfully updated" };
  }

  async getCompanyByEmail(email: string): Promise<Company> {
    const user: Company = await this.companyRepository.findOne({
      where: { email },
      include: { all: true },
    });
    return user;
  }

  async getPharmacyById(id: number): Promise<Company> {
    const pharmacy: Company = await this.companyRepository.findOne({
      where: {
        id: id,
        role: Role.pharmacy,
      },
      attributes: { exclude: ["password", "updatedAt", "createdAt", "role"] },
    });

    return pharmacy;
  }

  async getPharmacyDetails(companyId: number) {
    const company: Company = await this.getPharmacyById(companyId);

    if (!company) throw new NotFoundException("Pharmacy not found");

    return company;
  }
}
