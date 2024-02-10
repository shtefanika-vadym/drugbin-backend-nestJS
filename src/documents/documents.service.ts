import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Document } from "src/documents/documents.model";
import { DocumentType } from "src/documents/enum/document-type";
import { CreateDocumentDto } from "src/documents/dto/create-document.dto";
import { RecycleService } from "src/recycle/recycle.service";
import { Recycle } from "src/recycle/recycle.model";
import * as moment from "moment";
import { MessageResponse } from "src/reponses/message-response";
import { Op } from "sequelize";
import { v4 as uuidv4 } from "uuid";

@Injectable()
export class DocumentsService {
  constructor(
    private readonly recycleDrugService: RecycleService,
    @InjectModel(Document) private documentRepository: typeof Document
  ) {}

  async getAll(
    hospitalId: number,
    documentType: DocumentType
  ): Promise<Document[]> {
    return this.documentRepository.findAll({
      where: { hospitalId, documentType, deletedAt: null },
      attributes: {
        exclude: ["hospitalId", "updatedAt", "documentType"],
      },
    });
  }

  async delete(
    hospitalId: number,
    documentType: DocumentType,
    documentId: number
  ): Promise<MessageResponse> {
    const document: Document = await this.documentRepository.findOne({
      where: { hospitalId, id: documentId, documentType, deletedAt: null },
    });

    if (!document)
      throw new NotFoundException("Document with this id doesn't exist");

    await document.update({ deletedAt: new Date() });

    return { message: "Document deleted successfully" };
  }

  async share(
    hospitalId: number,
    documentType: DocumentType,
    documentId: number
  ): Promise<MessageResponse> {
    const document: Document = await this.documentRepository.findOne({
      where: {
        hospitalId,
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
    hospitalId: number,
    documentType: DocumentType,
    documentId: string
  ) {
    const document: Document = await this.documentRepository.findOne({
      where: {
        hospitalId,
        documentId,
        documentType,
      },
      include: { all: true },
    });

    if (!document)
      throw new NotFoundException("Document with this id doesn't exist");

    const { recycleData, hospital } =
      await this.recycleDrugService.getHospitalDrugsByInterval(
        hospitalId,
        document.startDate,
        document.endDate
      );

    return {
      hospital,
      recycleData,
      createdAt: document.createdAt.toISOString(),
    };
  }

  async getAllShared(hospitalId: number): Promise<Document[]> {
    return this.documentRepository.findAll({
      where: { hospitalId, sharedAt: { [Op.ne]: null } },
      attributes: {
        exclude: ["hospitalId", "updatedAt"],
      },
      order: [["sharedAt", "DESC"]],
    });
  }

  async getAllRemoved(hospitalId: number): Promise<Document[]> {
    return this.documentRepository.findAll({
      where: { hospitalId, deletedAt: { [Op.ne]: null } },
      attributes: {
        exclude: ["hospitalId", "updatedAt"],
      },
      order: [["deletedAt", "DESC"]],
    });
  }

  async getLastDocumentDate(
    hospitalId: number,
    documentType: DocumentType
  ): Promise<{ startDate: string }> {
    const document: Document = await this.documentRepository.findOne({
      where: { hospitalId, documentType },
      order: [["startDate", "DESC"]],
    });

    if (document)
      return {
        startDate: moment(document.endDate).add(1, "days").format("YYYY-MM-DD"),
      };

    const lastRecycledDrug: Recycle =
      await this.recycleDrugService.getLastRecycledDrug(hospitalId);

    if (lastRecycledDrug)
      return {
        startDate: moment(lastRecycledDrug.updatedAt).format("YYYY-MM-DD"),
      };

    return { startDate: moment().startOf("month").format("YYYY-MM-DD") };
  }

  async create(
    hospitalId: number,
    documentType: DocumentType,
    { endDate }: CreateDocumentDto
  ): Promise<MessageResponse> {
    const document: Document = await this.documentRepository.findOne({
      where: { hospitalId, documentType, endDate },
    });

    if (document)
      throw new ConflictException("Document with this interval already exists");

    const { startDate } = await this.getLastDocumentDate(
      hospitalId,
      documentType
    );

    const { recycleData } =
      await this.recycleDrugService.getHospitalDrugsByInterval(
        hospitalId,
        startDate,
        endDate
      );

    if (!recycleData.length)
      throw new NotFoundException("No recycle data found in this interval");

    const newDocument: Document = new Document();
    newDocument.hospitalId = hospitalId;
    newDocument.documentType = documentType;
    newDocument.endDate = endDate;
    newDocument.startDate = startDate;
    newDocument.documentId = uuidv4();
    await newDocument.save();
    return { message: "Document created successfully" };
    // TODO: CHECK
    // return this.recycleDrugService.getFilteredDrugsByIsPsycholeptic(
    //   drugsByInterval,
    //   documentType === DocumentType.psycholeptic
    // );
  }
}
