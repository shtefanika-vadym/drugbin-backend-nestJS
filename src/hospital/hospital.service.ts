import { Injectable, NotFoundException } from "@nestjs/common";
import { Hospital } from "src/hospital/hospital.model";
import { InjectModel } from "@nestjs/sequelize";
import { CreateHospitalDto } from "src/hospital/dto/create-hospital.dto";
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

  private haversineDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = this.toRad(lat2 - lat1);
    const dLon = this.toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(lat1)) *
        Math.cos(this.toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private toRad(value: number): number {
    return (value * Math.PI) / 180;
  }

  public findClosestLocation(
    currentLocation: {
      lat: number;
      lng: number;
    },
    locations: Hospital[]
  ): Hospital | null {
    let closestLocation: Hospital | null = null;
    let shortestDistance = Infinity;

    locations.forEach((location) => {
      const distance = this.haversineDistance(
        currentLocation.lat,
        currentLocation.lng,
        +location.lat,
        +location.lng
      );
      if (distance < shortestDistance) {
        shortestDistance = distance;
        closestLocation = location;
      }
    });

    return closestLocation;
  }

  async getAllHospitals(county?: string): Promise<Hospital[]> {
    const queryOptions = {
      attributes: [
        "id",
        "name",
        "lng",
        "lat",
        "regionShortName",
        "regionLongName",
        "fullAddress",
      ],
      where: county ? { regionLongName: county } : undefined,
    };

    return await this.hospitalRepository.findAll(queryOptions);
  }

  async getNearestHospital(location: {
    lat: number;
    lng: number;
  }): Promise<Hospital> {
    const hospitals: Hospital[] = await this.getAllHospitals();

    return this.findClosestLocation(location, hospitals);
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

  async getHospitalByEmail(email: string): Promise<Hospital> {
    return await this.hospitalRepository.findOne({
      where: { email },
      include: { all: true },
    });
  }

  async getById(id: number): Promise<Hospital> {
    return await this.hospitalRepository.findOne({
      where: {
        id: id,
      },
      attributes: { exclude: ["password", "updatedAt", "createdAt"] },
    });
  }

  async getAllCounties(): Promise<string[]> {
    const counties = await this.hospitalRepository.findAll({
      attributes: ["regionLongName"],
    });
    return [
      ...new Set(
        counties.map(({ regionLongName }: Hospital) => regionLongName)
      ),
    ];
  }

  async getPharmacyDetails(companyId: number) {
    const company: Hospital = await this.getById(companyId);

    if (!company) throw new NotFoundException("Pharmacy not found");

    return company;
  }
}
