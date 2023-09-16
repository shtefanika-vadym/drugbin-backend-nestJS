import { ConflictException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Document } from "src/documents/documents.model";
import { DocumentType } from "src/documents/enum/document-type";
import { CreateDocumentDto } from "src/documents/dto/create-document.dto";
import { RecycleDrugService } from "src/recycle-drug/recycle-drug.service";
import { RecycleDrug } from "src/recycle-drug/recycle-drug.model";

@Injectable()
export class DocumentsService {
  constructor(
    private readonly recycleDrugService: RecycleDrugService,
    @InjectModel(Document) private documentRepository: typeof Document
  ) {}

  async getAll(
    pharmacyId: number,
    documentType: DocumentType
  ): Promise<Document[]> {
    return this.documentRepository.findAll({
      where: { pharmacyId, documentType },
    });
  }

  async create(
    pharmacyId: number,
    documentType: DocumentType,
    { startDate, endDate }: CreateDocumentDto
  ): Promise<RecycleDrug[]> {
    const document: Document = await this.documentRepository.findOne({
      where: { pharmacyId, documentType, startDate, endDate },
    });

    if (document)
      throw new ConflictException("Document with this interval already exists");

    const drugsByInterval: RecycleDrug[] =
      await this.recycleDrugService.getPharmacyDrugsByInterval(
        pharmacyId,
        startDate,
        endDate
      );

    // const newDocument: Document = new Document();
    // newDocument.pharmacyId = pharmacyId;
    // newDocument.documentType = documentType;
    // newDocument.endDate = endDate;
    // newDocument.startDate = startDate;
    // await newDocument.save();

    return this.recycleDrugService.getFilteredDrugsByIsPsycholeptic(
      drugsByInterval,
      documentType === DocumentType.psycholeptic
    );
  }
}
