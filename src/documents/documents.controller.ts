import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Res,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { DocumentsService } from "src/documents/documents.service";

import { HospitalId } from "src/auth/hospital-id.decorator";
import { Document } from "src/documents/documents.model";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { EnumValidatorInterceptor } from "src/interceptors/enum-validator.interceptor";
import { CreateDocumentDto } from "src/documents/dto/create-document.dto";
import { MessageResponse } from "src/reponses/message-response";
import { Readable } from "stream";
import { DocumentUtils } from "src/documents/utils/documents.utils";
import { DrugCategory } from "src/vision/interfaces/identified-drug.interface";

@UseGuards(JwtAuthGuard)
@ApiTags("Documents")
@Controller("documents")
export class DocumentsController {
  constructor(private documentsService: DocumentsService) {}

  // Get all removed documents
  @ApiOperation({ summary: "Get all removed documents" })
  @ApiResponse({ status: 200, type: [Document] })
  @Get("/removed")
  getAllRemoved(@HospitalId() id: number): Promise<Document[]> {
    return this.documentsService.getAllRemoved(id);
  }

  // Get all shared documents
  @ApiOperation({ summary: "Get all shared documents" })
  @ApiResponse({ status: 200, type: [Document] })
  @Get("/shared")
  getAllShared(@HospitalId() id: number): Promise<Document[]> {
    return this.documentsService.getAllShared(id);
  }

  // Get all last documents
  @ApiOperation({ summary: "Get all last documents" })
  @ApiResponse({ status: 200, type: [Document] })
  @Get("/all")
  getAll(
    @HospitalId() id: number,
    @Query("category") category: DrugCategory
  ): Promise<Document[]> {
    return this.documentsService.getAll(id, category);
  }

  // Get start document date
  @ApiOperation({ summary: "Get start document date" })
  @Get("/start-date")
  getLastDocumentDate(
    @HospitalId() id: number,
    @Query("type") category: DrugCategory
  ): Promise<{ startDate: string }> {
    return this.documentsService.getLastDocumentDate(id, category);
  }

  // Create new document
  @ApiOperation({ summary: "Create new document" })
  @ApiResponse({ status: 200, type: [MessageResponse] })
  @Post()
  create(
    @HospitalId() id: number,
    @Body() dto: CreateDocumentDto,
    @Query("category") category: DrugCategory
  ): Promise<MessageResponse> {
    return this.documentsService.create(id, category, dto);
  }

  // Delete document
  @ApiOperation({ summary: "Delete document" })
  @ApiResponse({ status: 200, type: MessageResponse })
  @Delete("/:category/:documentId")
  @UseInterceptors(new EnumValidatorInterceptor(DrugCategory))
  delete(
    @HospitalId() id: number,
    @Param("documentId") documentId: number,
    @Param("category") category: DrugCategory
  ): Promise<MessageResponse> {
    return this.documentsService.delete(id, category, documentId);
  }

  // Share document
  @ApiOperation({ summary: "Share document" })
  @ApiResponse({ status: 200, type: MessageResponse })
  @Patch("/:category/:documentId")
  @UseInterceptors(new EnumValidatorInterceptor(DrugCategory))
  share(
    @HospitalId() id: number,
    @Param("documentId") documentId: number,
    @Param("category") category: DrugCategory
  ): Promise<MessageResponse> {
    return this.documentsService.share(id, category, documentId);
  }

  @ApiOperation({ summary: "Get document pdf" })
  @Get("/data/:id")
  async getVerbalData(
    @Res() res: any,
    @HospitalId() hospitalId: number,
    @Param("id") id: string,
    @Query("category") category: DrugCategory
  ): Promise<any> {
    try {
      const { recycleData, hospital, createdAt } =
        await this.documentsService.getDocumentDataById(
          hospitalId,
          category,
          id
        );
      const doc = DocumentUtils.getDocument(
        recycleData,
        category,
        createdAt,
        hospital
      );

      doc.pipe(res);
      doc.end();
    } catch (error) {
      console.error("Error generating PDF:", error);
      res.status(500).send("Error generating PDF");
    }
  }

  private sendPdfResponse(res: any, pdfBuffer: Buffer): void {
    const stream = new Readable();
    stream.push(pdfBuffer);
    stream.push(null);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "inline; filename=result.pdf");
    stream.pipe(res);
  }
}
