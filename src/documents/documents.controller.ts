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
import { DocumentType } from "src/documents/enum/document-type";
import { Document } from "src/documents/documents.model";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { EnumValidatorInterceptor } from "src/interceptors/enum-validator.interceptor";
import { CreateDocumentDto } from "src/documents/dto/create-document.dto";
import { Recycle } from "src/recycle/recycle.model";
import { MessageResponse } from "src/reponses/message-response";
import { Readable } from "stream";
import { DocumentUtils } from "src/documents/utils/documents.utils";

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
    @Query("type") documentType: DocumentType
  ): Promise<Document[]> {
    return this.documentsService.getAll(id, documentType);
  }

  // Get start document date
  @ApiOperation({ summary: "Get start document date" })
  @Get("/start-date")
  getLastDocumentDate(
    @HospitalId() id: number,
    @Query("type") documentType: DocumentType
  ): Promise<{ startDate: string }> {
    return this.documentsService.getLastDocumentDate(id, documentType);
  }

  // Create new document
  @ApiOperation({ summary: "Create new document" })
  @ApiResponse({ status: 200, type: [MessageResponse] })
  @Post("/:documentType")
  @UseInterceptors(new EnumValidatorInterceptor(DocumentType))
  create(
    @HospitalId() id: number,
    @Body() dto: CreateDocumentDto,
    @Param("documentType") documentType: DocumentType
  ): Promise<MessageResponse> {
    return this.documentsService.create(id, documentType, dto);
  }

  // Delete document
  @ApiOperation({ summary: "Delete document" })
  @ApiResponse({ status: 200, type: MessageResponse })
  @Delete("/:documentType/:documentId")
  @UseInterceptors(new EnumValidatorInterceptor(DocumentType))
  delete(
    @HospitalId() id: number,
    @Param("documentId") documentId: number,
    @Param("documentType") documentType: DocumentType
  ): Promise<MessageResponse> {
    return this.documentsService.delete(id, documentType, documentId);
  }

  // Share document
  @ApiOperation({ summary: "Share document" })
  @ApiResponse({ status: 200, type: MessageResponse })
  @Patch("/:documentType/:documentId")
  @UseInterceptors(new EnumValidatorInterceptor(DocumentType))
  share(
    @HospitalId() id: number,
    @Param("documentId") documentId: number,
    @Param("documentType") documentType: DocumentType
  ): Promise<MessageResponse> {
    return this.documentsService.share(id, documentType, documentId);
  }

  // Get document data
  // @ApiOperation({ summary: "Get document data" })
  // @ApiResponse({ status: 200, type: [Recycle] })
  // @Get("/data/:documentType/:documentId")
  // @UseInterceptors(new EnumValidatorInterceptor(DocumentType))
  // getDocumentDataById(
  //   @HospitalId() id: number,
  //   @Param("documentId") documentId: number,
  //   @Param("documentType") documentType: DocumentType
  // ): Promise<Recycle[]> {
  //   return this.documentsService.getDocumentDataById(
  //     id,
  //     documentType,
  //     documentId
  //   );
  // }

  @ApiOperation({ summary: "Get document pdf" })
  @Get("/data/:id")
  async getVerbalData(
    @Res() res: any,
    @HospitalId() hospitalId: number,
    @Param("id") id: string,
    @Query("type") type: DocumentType
  ): Promise<any> {
    try {
      const { recycleData, createdAt } =
        await this.documentsService.getDocumentDataById(hospitalId, type, id);
      const doc = DocumentUtils.getDocument(
        recycleData,
        type === DocumentType.psycholeptic,
        createdAt
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
