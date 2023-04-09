import { Injectable } from "@nestjs/common";
import { Company } from "src/company/company.model";
import { InjectModel } from "@nestjs/sequelize";
import { CreateCompanyDto } from "src/company/dto/create-company.dto";
import { Role } from "src/company/enum/Role";
import { UpdateCompanyDto } from "src/company/dto/update-company.dto";
import { ExpiredProduct } from "src/expired-products/expired-products.model";

@Injectable()
export class CompanyService {
  constructor(
    @InjectModel(Company) private companyRepository: typeof Company,
    @InjectModel(ExpiredProduct)
    private expiredProductRepository: typeof ExpiredProduct
  ) {}

  async createCompany(dto: CreateCompanyDto) {
    const user = await this.companyRepository.create(dto);
    return user;
  }

  async getAllCompanies(role: Role) {
    const companies = await this.companyRepository.findAll({
      where: { role },
    });
    return companies.map(({ id, name, email }) => ({ id, name, email }));
  }

  async updateCompany(dto: UpdateCompanyDto, id: string) {
    const company = await this.companyRepository.findByPk(id);
    if (!company) return { message: "Company not found" };

    await company.update(dto);
    return { message: "Company successfully updated" };
  }

  async getCompanyByEmail(email: string) {
    const user = await this.companyRepository.findOne({
      where: { email },
      include: { all: true },
    });
    return user;
  }

  async getPharmacyById(companyId: string) {
    const company = await this.companyRepository.findByPk(companyId);
    if (!company) return { message: "Company not found" };

    const companyInfo = {
      id: company.id,
      name: company.name,
      email: company.email,
      location: company.location,
      street: company.street,
      schedule: company.schedule,
      createdAt: company.createdAt,
      phone: company.phone,
    };

    const expiredProducts = await this.expiredProductRepository.findAll({
      where: { companyId },
      include: { all: true },
    });

    return { ...companyInfo, expiredProducts };
  }
}
