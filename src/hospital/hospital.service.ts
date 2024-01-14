import { Injectable, NotFoundException } from "@nestjs/common";
import { Hospital } from "src/hospital/hospital.model";
import { InjectModel } from "@nestjs/sequelize";
import { CreateHospitalDto } from "src/hospital/dto/create-hospital.dto";
import { Role } from "src/hospital/enum/Role";
import { UpdateHospitalDto } from "src/hospital/dto/update-hospital.dto";
import { MessageResponse } from "src/reponses/message-response";

@Injectable()
export class HospitalService {
  constructor(
    @InjectModel(Hospital) private hospitalRepository: typeof Hospital
  ) {}

  async createHospital(dto: CreateHospitalDto): Promise<Hospital> {
    const user: Hospital = await this.hospitalRepository.create(dto);
    return user;
  }

  async getAllHospitals(role: Role): Promise<Hospital[]> {
    const hospitals: Hospital[] = await this.hospitalRepository.findAll({
      attributes: ["id", "name", "location", "street", "schedule"],
    });
    return hospitals;
  }

  async updateCompany(
    dto: UpdateHospitalDto,
    id: string
  ): Promise<MessageResponse> {
    const company: Hospital = await this.hospitalRepository.findByPk(id);
    if (!company)
      throw new NotFoundException(`Company with id ${id} does not exist`);

    await company.update(dto);
    return { message: "Company successfully updated" };
  }

  async getHospitalByEmail(id: number): Promise<Hospital> {
    const user: Hospital = await this.hospitalRepository.findOne({
      where: { id },
      include: { all: true },
    });
    return user;
  }

  async getById(id: number): Promise<Hospital> {
    const pharmacy: Hospital = await this.hospitalRepository.findOne({
      where: {
        id: id,
      },
      attributes: { exclude: ["password", "updatedAt", "createdAt"] },
    });

    return pharmacy;
  }

  async getPharmacyDetails(companyId: number) {
    const company: Hospital = await this.getById(companyId);

    if (!company) throw new NotFoundException("Pharmacy not found");

    return company;
  }
}
