import { Injectable, NotFoundException } from "@nestjs/common";
import { Company } from "src/company/company.model";
import { InjectModel } from "@nestjs/sequelize";
import { CreateCompanyDto } from "src/company/dto/create-company.dto";
import { Role } from "src/company/enum/Role";
import { UpdateCompanyDto } from "src/company/dto/update-company.dto";
import { ExpiredProduct } from "src/expired-products/expired-products.model";
import { DrugStock } from "src/drug-stock/drug-stock.model";
import { ProductPack } from "src/expired-products/enum/product-pack";
import { DrugType } from "src/drug-stock/enum/drug-type";
import { MessageResponse } from "src/reponses/message-response";

@Injectable()
export class CompanyService {
  constructor(
    @InjectModel(Company) private companyRepository: typeof Company,
    @InjectModel(ExpiredProduct)
    private expiredProductRepository: typeof ExpiredProduct
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

  calculateProductWeight(
    quantity: number,
    weight: number,
    pack: ProductPack,
    packageTotal: number
  ): number {
    let total: number = quantity * parseFloat(String(weight));

    if (pack === ProductPack.pack) total *= packageTotal;

    return total;
  }

  // Need updates
  async updateQuantity(companyId: number): Promise<void> {
    const company = await this.companyRepository.findByPk(companyId);
    const products = await this.expiredProductRepository.findAll({
      where: { companyId },
      include: [
        {
          model: DrugStock,
          as: "drug",
        },
      ],
    });

    const initialWeights = {
      [DrugType.rx]: 0,
      [DrugType.otc]: 0,
      [DrugType.supplement]: 0,
    };

    const weights = products.reduce((acc, product) => {
      const { drug, quantity, pack, type } = product;
      const { weight, packageTotal } = drug;

      const totalWeight = this.calculateProductWeight(
        quantity,
        weight,
        pack,
        packageTotal
      );
      acc[type] += totalWeight;

      return acc;
    }, initialWeights);

    const totalWeight =
      weights[DrugType.rx] +
      weights[DrugType.otc] +
      weights[DrugType.supplement];

    await company.update({
      weight: totalWeight,
      weightRx: weights[DrugType.rx],
      weightOtc: weights[DrugType.otc],
      weightSupplement: weights[DrugType.supplement],
    });
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

    const expiredProducts: ExpiredProduct[] = await this.expiredProductRepository.findAll(
      {
        where: { companyId },
        include: [
          {
            model: DrugStock,
            as: "drug",
          },
        ],
      }
    );

    return { ...company.toJSON(), expiredProducts };
  }
}
