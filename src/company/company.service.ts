import { Injectable, NotFoundException } from "@nestjs/common";
import { Company } from "src/company/company.model";
import { InjectModel } from "@nestjs/sequelize";
import { CreateCompanyDto } from "src/company/dto/create-company.dto";
import { Role } from "src/company/enum/Role";
import { UpdateCompanyDto } from "src/company/dto/update-company.dto";
import { ExpiredProduct } from "src/expired-products/expired-products.model";
import { DrugStockService } from "src/drug-stock/drug-stock.service";
import { DrugStock } from "src/drug-stock/drug-stock.model";
import { ProductPack } from "src/expired-products/enum/product-pack";

@Injectable()
export class CompanyService {
  constructor(
    @InjectModel(Company) private companyRepository: typeof Company,
    @InjectModel(ExpiredProduct)
    private expiredProductRepository: typeof ExpiredProduct,
    private drugStockService: DrugStockService
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
    // Improve this
    const company = await this.companyRepository.findByPk(companyId, {
      attributes: { exclude: ["password", "updatedAt", "createdAt", "role"] },
    });
    if (!company) throw new NotFoundException("Company not found");

    const expiredProducts = await this.expiredProductRepository.findAll({
      where: { companyId },
      include: [
        {
          model: DrugStock,
          as: "drug",
        },
      ],
    });

    let totalR = expiredProducts.reduce((total, product) => {
      let pack = 1;
      if (product.pack === ProductPack.pack) pack = 24;
      else if (product.pack === ProductPack.blister) pack = 12;

      return total + product.quantity * (pack * product.drug.weight);
    }, 0);
    return { ...company.toJSON(), expiredProducts, total: totalR };
  }
}
