import { Injectable, NotFoundException } from "@nestjs/common";
import { Pharmacy } from "src/pharmacies/pharmacy.model";
import { InjectModel } from "@nestjs/sequelize";
import { CreatePharmacyDto } from "src/pharmacies/dto/create-pharmacy.dto";
import { Role } from "src/pharmacies/enum/Role";
import { UpdatePharmacyDto } from "src/pharmacies/dto/update-pharmacy.dto";
import { MessageResponse } from "src/reponses/message-response";

@Injectable()
export class PharmacyService {
  constructor(
    @InjectModel(Pharmacy) private companyRepository: typeof Pharmacy
  ) {}

  async createCompany(dto: CreatePharmacyDto): Promise<Pharmacy> {
    const user: Pharmacy = await this.companyRepository.create(dto);
    return user;
  }

  async getAllCompanies(role: Role): Promise<Pharmacy[]> {
    const companies: Pharmacy[] = await this.companyRepository.findAll({
      attributes: ["id", "name", "email", "weight"],
    });
    return companies;
  }

  async updateCompany(
    dto: UpdatePharmacyDto,
    id: string
  ): Promise<MessageResponse> {
    const company: Pharmacy = await this.companyRepository.findByPk(id);
    if (!company)
      throw new NotFoundException(`Company with id ${id} does not exist`);

    await company.update(dto);
    return { message: "Company successfully updated" };
  }

  async getCompanyByEmail(email: string): Promise<Pharmacy> {
    const user: Pharmacy = await this.companyRepository.findOne({
      where: { email },
      include: { all: true },
    });
    return user;
  }

  async getById(id: number): Promise<Pharmacy> {
    const pharmacy: Pharmacy = await this.companyRepository.findOne({
      where: {
        id: id,
      },
      attributes: { exclude: ["password", "updatedAt", "createdAt"] },
    });

    return pharmacy;
  }

  async getPharmacyDetails(companyId: number) {
    const company: Pharmacy = await this.getById(companyId);

    if (!company) throw new NotFoundException("Pharmacy not found");

    return company;
  }
}
