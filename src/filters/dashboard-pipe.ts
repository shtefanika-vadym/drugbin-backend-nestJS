import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from "@nestjs/common";
import { DashboardDto } from "src/dashboard/dto/dashboard.dto";
import * as moment from "moment";

@Injectable()
export class DashboardDatePipe implements PipeTransform {
  async transform(
    dto: DashboardDto,
    { metatype }: ArgumentMetadata
  ): Promise<string> {
    if (!metatype) {
      return dto.date;
    }
    if (!dto?.date || !moment(dto.date, "YYYY", true).isValid()) {
      throw new BadRequestException("Invalid year format. Use YYYY.");
    }
    return dto.date;
  }
}
