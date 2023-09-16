import { forwardRef, Module } from "@nestjs/common";
import { PharmacyController } from "src/pharmacies/pharmacy.controller";
import { PharmacyService } from "src/pharmacies/pharmacy.service";
import { SequelizeModule } from "@nestjs/sequelize";
import { Pharmacy } from "src/pharmacies/pharmacy.model";
import { AuthModule } from "src/auth/auth.module";
import { SeederModule } from "nestjs-sequelize-seeder";
import { PharmacySeed } from "src/database/seeders/pharmacy.seed";

@Module({
  controllers: [PharmacyController],
  providers: [PharmacyService],
  imports: [
    SequelizeModule.forFeature([Pharmacy]),
    SeederModule.forFeature([PharmacySeed]),
    forwardRef(() => AuthModule),
  ],
  exports: [PharmacyService],
})
export class PharmacyModule {}
