import { Module } from "@nestjs/common";
import { AdditionalController } from "src/additional/additional.controller";
import { AdditionalService } from "src/additional/additional.service";

@Module({
  controllers: [AdditionalController],
  providers: [AdditionalService],
  imports: [],
  exports: [],
})
export class AdditionalModule {}
