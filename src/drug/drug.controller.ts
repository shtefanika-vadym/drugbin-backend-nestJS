import {
  Controller,
  Get,
  Param,
  Post,
  Query,
  UploadedFiles,
  UseInterceptors,
} from "@nestjs/common";
import {
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { DrugService } from "src/drug/drug.service";
import { Drug } from "src/drug/drug.model";
import { FilesInterceptor } from "@nestjs/platform-express";
import { imageFilter } from "src/filters/image.filter";
import { RequestTime } from "src/request-time/request-time";
import { IpRateLimitMiddleware } from "src/helpers/ip-rate.middleware";

@ApiTags("Drugs")
@Controller("drugs")
export class DrugController {
  constructor(private drugService: DrugService) {}

  // Get drugs by name
  @ApiOperation({ summary: "Get drugs by name" })
  @ApiResponse({ status: 200, type: [Drug] })
  @Get("/search")
  getDrugsByName(
    @Query("limit") limit: number,
    @Query("name") name?: string
  ): Promise<Drug[]> {
    return this.drugService.getDrugsByName(name, limit);
  }

  // Identify drug by image
  @ApiOperation({ summary: "Identify drugs by image" })
  @ApiConsumes("multipart/form-data")
  @UseInterceptors(FilesInterceptor("image", 1, { fileFilter: imageFilter }))
  @ApiResponse({ status: 200, type: [Drug] })
  @Post("/identify")
  identifyDrugByImage(
    @UploadedFiles()
    files: Express.Multer.File[],
    @RequestTime() requestTime: any
  ): Promise<Drug[]> {
    return this.drugService.identifyDrugByImage(files[0]);
  }
}
