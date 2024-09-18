import {
  Column,
  DataType,
  Model,
  Table,
  PrimaryKey,
  Unique,
  AllowNull,
  AutoIncrement,
} from "sequelize-typescript";

interface ContactUsCreationAttrs {
  name: string;
  email: string;
  message: string;
}

@Table({ tableName: "contact_us", underscored: true })
export class ContactUs extends Model<ContactUs, ContactUsCreationAttrs> {
  @PrimaryKey
  @AutoIncrement
  @Unique
  @AllowNull(false)
  @Column(DataType.INTEGER)
  id: number;

  @AllowNull(false)
  @Column(DataType.STRING)
  name: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  email: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  message: string;
}
