import { Controller, Get, Param, UploadedFiles, UseInterceptors } from "@nestjs/common";
import { ApiConsumes, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { DrugsService } from "src/drugs/drugs.service";
import { Drug } from "src/drugs/drugs.model";
import { FilesInterceptor } from "@nestjs/platform-express";
import { Express } from "express";

@ApiTags("Drugs")
@Controller("drugs")
export class DrugsController {
  constructor(private drugService: DrugsService) {}

  // Get drugs by name
  @ApiOperation({ summary: "Get drugs by name" })
  @ApiResponse({ status: 200, type: [Drug] })
  @Get("/search/:name?")
  getDrugsByName(@Param("name") name?: string): Promise<Drug[]> {
    return this.drugService.getDrugsByName(name);
  }

  // Identify drug by image
  @ApiOperation({ summary: "Identify drug by image" })
  @ApiConsumes("multipart/form-data")
  @UseInterceptors(FilesInterceptor("image"))
  @ApiResponse({ status: 200, type: [Drug] })
  @Get("/identify")
  identifyDrugByImage(@UploadedFiles() files: Array<Express.Multer.File>) {
    return this.drugService.identifyDrugByImage(files[0]);
  }
}
