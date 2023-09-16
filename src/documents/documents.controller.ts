import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { DocumentsService } from "src/documents/documents.service";
import { PharmacyId } from "src/auth/pharmacy-id.decorator";
import { DocumentType } from "src/documents/enum/document-type";
import { Document } from "src/documents/documents.model";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { EnumValidatorInterceptor } from "src/interceptors/enum-validator.interceptor";
import { CreateDocumentDto } from "src/documents/dto/create-document.dto";
import { RecycleDrug } from "src/recycle-drug/recycle-drug.model";

@UseGuards(JwtAuthGuard)
@ApiTags("Documents")
@Controller("documents")
export class DocumentsController {
  constructor(private documentsService: DocumentsService) {}

  // Get all last documents
  @ApiOperation({ summary: "Get all last documents" })
  @ApiResponse({ status: 200, type: [Document] })
  @Get("/:documentType")
  @UseInterceptors(new EnumValidatorInterceptor(DocumentType))
  getAll(
    @PharmacyId() id: number,
    @Param("documentType") documentType: DocumentType
  ): Promise<Document[]> {
    return this.documentsService.getAll(id, documentType);
  }

  // Get last document date
  @ApiOperation({ summary: "Get last document date" })
  @Get("/:documentType/last-date")
  @UseInterceptors(new EnumValidatorInterceptor(DocumentType))
  getLastDocumentDate(
    @PharmacyId() id: number,
    @Param("documentType") documentType: DocumentType
  ): Promise<{ date: string }> {
    return this.documentsService.getLastDocumentDate(id, documentType);
  }

  // Create new document
  @ApiOperation({ summary: "Create new document" })
  @ApiResponse({ status: 200, type: [RecycleDrug] })
  @Post("/:documentType")
  @UseInterceptors(new EnumValidatorInterceptor(DocumentType))
  create(
    @PharmacyId() id: number,
    @Body() dto: CreateDocumentDto,
    @Param("documentType") documentType: DocumentType
  ): Promise<RecycleDrug[]> {
    return this.documentsService.create(id, documentType, dto);
  }
}
