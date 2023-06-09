import {
  Controller,
  Get,
  Param,
  Post,
  UploadedFiles,
  UseInterceptors,
} from "@nestjs/common";
import {
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { DrugsService } from "src/drugs/drugs.service";
import { Drug } from "src/drugs/drugs.model";
import { FilesInterceptor } from "@nestjs/platform-express";
import { imageFilter } from "src/filters/image.filter";
import { RequestTime } from "src/request-time/request-time";

@ApiTags("Drugs")
@Controller("drugs")
export class DrugsController {
  constructor(private drugService: DrugsService) {}

  // Get drugs by name
  @ApiOperation({ summary: "Get drugs by name" })
  @ApiResponse({ status: 200, type: [Drug] })
  @Get("/search/:name?")
  getDrugsByName(
    @RequestTime() requestTime: any,
    @Param("name") name?: string
  ): Promise<Drug[]> {
    return this.drugService.getDrugsByName(name);
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
