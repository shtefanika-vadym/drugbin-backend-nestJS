import { Injectable } from "@nestjs/common";
import { RecycleService } from "src/recycle/recycle.service";

@Injectable()
export class DashboardService {
  constructor(private readonly recycleDrugService: RecycleService) {}

  async get(hospitalId: number, year: string): Promise<any> {
    return this.recycleDrugService.geDashboardDataByYear(hospitalId, year);
  }
}
