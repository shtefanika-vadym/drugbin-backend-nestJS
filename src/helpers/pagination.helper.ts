import { Injectable } from "@nestjs/common";
import {
  IPagination,
  IPaginationProps,
} from "src/helpers/pagination.interface";
import { Model } from "sequelize-typescript";

@Injectable()
export class PaginationHelper<Entity extends Model> {
  constructor() {}

  async paginate({
    model,
    page = 1,
    limit = 10,
    options = {},
  }: IPaginationProps<Entity>): Promise<IPagination<Entity[]>> {
    const offset: number = (page - 1) * limit;
    const { count, rows } = await model.findAndCountAll({
      offset,
      limit,
      ...options,
    });

    return {
      page,
      limit,
      data: rows,
      totalItems: count,
    };
  }
}
