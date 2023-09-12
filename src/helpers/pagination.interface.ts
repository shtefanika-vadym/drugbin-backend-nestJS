import { Attributes, FindOptions } from "sequelize/types/model";
import { Model } from "sequelize-typescript";

export interface IPagination<T> {
  data: T;
  page: number;
  limit: number;
  totalItems: number;
}

export interface IPaginationProps<Entity extends Model> {
  page: number;
  limit: number;
  // TS2693: 'Entity' only refers to a type, but is being used as a value here.
  // @ts-ignore
  model: typeof Entity;
  options?: FindOptions<Attributes<Entity>>;
}
