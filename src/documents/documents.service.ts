import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Document } from "src/documents/documents.model";
import { DocumentType } from "src/documents/enum/document-type";
import { CreateDocumentDto } from "src/documents/dto/create-document.dto";
import { RecycleDrugService } from "src/recycle-drug/recycle-drug.service";
import { RecycleDrug } from "src/recycle-drug/recycle-drug.model";
import * as moment from "moment";
import { MessageResponse } from "src/reponses/message-response";
import { Op } from "sequelize";

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
      where: { pharmacyId, documentType, deletedAt: null },
      attributes: {
        exclude: ["pharmacyId", "updatedAt", "documentType"],
      },
    });
  }

  async delete(
    pharmacyId: number,
    documentType: DocumentType,
    documentId: number
  ): Promise<MessageResponse> {
    const document: Document = await this.documentRepository.findOne({
      where: { pharmacyId, id: documentId, documentType, deletedAt: null },
    });

    if (!document)
      throw new NotFoundException("Document with this id doesn't exist");

    await document.update({ deletedAt: new Date() });

    return { message: "Document deleted successfully" };
  }

  async share(
    pharmacyId: number,
    documentType: DocumentType,
    documentId: number
  ): Promise<MessageResponse> {
    const document: Document = await this.documentRepository.findOne({
      where: {
        pharmacyId,
        id: documentId,
        documentType,
        deletedAt: null,
        sharedAt: null,
      },
    });

    if (!document)
      throw new NotFoundException("Document with this id doesn't exist");

    await document.update({ sharedAt: new Date() });

    return { message: "Document shared successfully" };
  }

  async getDocumentDataById(
    pharmacyId: number,
    documentType: DocumentType,
    documentId: number
  ): Promise<RecycleDrug[]> {
    const document: Document = await this.documentRepository.findOne({
      where: {
        pharmacyId,
        id: documentId,
        documentType,
      },
    });

    if (!document)
      throw new NotFoundException("Document with this id doesn't exist");

    return this.recycleDrugService.getPharmacyDrugsByInterval(
      pharmacyId,
      document.startDate,
      document.endDate
    );
  }

  async getAllShared(pharmacyId: number): Promise<Document[]> {
    return this.documentRepository.findAll({
      where: { pharmacyId, sharedAt: { [Op.ne]: null } },
      attributes: {
        exclude: ["pharmacyId", "updatedAt"],
      },
      order: [["sharedAt", "DESC"]],
    });
  }

  async getAllRemoved(pharmacyId: number): Promise<Document[]> {
    return this.documentRepository.findAll({
      where: { pharmacyId, deletedAt: { [Op.ne]: null } },
      attributes: {
        exclude: ["pharmacyId", "updatedAt"],
      },
      order: [["deletedAt", "DESC"]],
    });
  }

  async getLastDocumentDate(
    pharmacyId: number,
    documentType: DocumentType
  ): Promise<{ date: string }> {
    const document: Document = await this.documentRepository.findOne({
      where: { pharmacyId, documentType },
      order: [["startDate", "DESC"]],
    });

    if (document)
      return {
        date: moment(document.endDate).add(1, "days").format("YYYY-MM-DD"),
      };

    const lastRecycledDrug: RecycleDrug =
      await this.recycleDrugService.getLastRecycledDrug(pharmacyId);

    if (lastRecycledDrug)
      return { date: moment(lastRecycledDrug.updatedAt).format("YYYY-MM-DD") };

    return { date: moment().startOf("month").format("YYYY-MM-DD") };
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
