import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from "sequelize-typescript";
import { Company } from "src/company/company.model";
import { Status } from "src/expired-products/enum/Status";

interface ExpiredProductCreationAttrs {
  name: string;
  brand: string;
  type: string;
  pack: string;
  status: Status;
  companyId: number;
}

@Table({ tableName: "expired-products" })
export class ExpiredProduct extends Model<
  ExpiredProduct,
  ExpiredProductCreationAttrs
> {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @Column({ type: DataType.STRING, allowNull: false })
  name: string;
  @Column({ type: DataType.STRING, allowNull: false })
  brand: string;
  @Column({ type: DataType.STRING, allowNull: false })
  type: string;
  @Column({ type: DataType.STRING, allowNull: false })
  pack: string;
  @Column({ type: DataType.STRING, allowNull: false })
  status: Status;

  @ForeignKey(() => Company)
  @Column({ type: DataType.INTEGER })
  companyId: number;
}
