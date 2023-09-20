import { Injectable } from "@nestjs/common";
import { RecycleDrugService } from "src/recycle-drug/recycle-drug.service";

@Injectable()
export class DashboardService {
  constructor(private readonly recycleDrugService: RecycleDrugService) {}

  async get(pharmacyId: number, year: string): Promise<any> {
    return this.recycleDrugService.geDashboardDataByYear(pharmacyId, year);
  }
}
