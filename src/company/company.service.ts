import { Injectable, NotFoundException } from "@nestjs/common";
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
      attributes: ["id", "name", "email"],
    });
    return companies;
  }

  async updateCompany(dto: UpdateCompanyDto, id: string) {
    const company = await this.companyRepository.findByPk(id);
    if (!company)
      throw new NotFoundException(`Company with id ${id} does not exist`);

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

  async getPharmacyById(companyId: number) {
    const company = await this.companyRepository.findByPk(companyId, {
      attributes: [
        "id",
        "name",
        "email",
        "location",
        "street",
        "schedule",
        "createdAt",
        "phone",
      ],
    });
    if (!company) throw new NotFoundException("Company not found");

    const expiredProducts = await this.expiredProductRepository.findAll({
      where: { companyId },
      include: { all: true },
    });

    return { ...company.toJSON(), expiredProducts };
  }
}
