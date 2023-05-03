import {
  Column,
  DataType,
  Model,
  Table,
  PrimaryKey,
  AutoIncrement,
  Unique,
  AllowNull,
} from "sequelize-typescript";

interface ContactUsCreationAttrs {
  name: string;
  email: string;
  message: string;
}

@Table({ tableName: "contact_us" })
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

  @Unique
  @AllowNull(false)
  @Column(DataType.STRING)
  email: string;

  @Unique
  @AllowNull(false)
  @Column(DataType.STRING)
  message: string;
}
