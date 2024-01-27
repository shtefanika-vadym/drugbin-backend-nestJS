import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Res,
  UseGuards,
} from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { RecycleService } from "src/recycle/recycle.service";
import { CreateRecycleDto } from "src/recycle/dto/create-recycle.dto";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { Recycle } from "src/recycle/recycle.model";
import { CreateRecycleResponse } from "src/recycle/responses/create-recycle-response";
import { MessageResponse } from "src/reponses/message-response";
import { HospitalId } from "src/auth/hospital-id.decorator";
import { IRecycledDrug } from "src/recycle/interfaces/drug.interface";
import { IPagination } from "src/helpers/pagination.interface";
import { RecycleUtils } from "src/recycle/utils/recycle-drug.utils";
import { Readable } from "stream";
import * as pdf from "html-pdf";
import * as PDFDocument from "pdfkit";

@ApiTags("Recycle Drug")
@Controller("recycle")
export class RecycleController {
  constructor(private recycleDrugService: RecycleService) {}

  // Create recycle drug
  @ApiOperation({ summary: "Create recycle drug" })
  @ApiResponse({ status: 200, type: CreateRecycleResponse })
  @Post()
  async create(@Body() dto: CreateRecycleDto): Promise<CreateRecycleResponse> {
    return this.recycleDrugService.create(dto);
  }

  // Get all recycle drug
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "Get all recycle drug" })
  @ApiResponse({ status: 200, type: [Recycle] })
  @Get()
  getDrugsByhospitalId(
    @HospitalId() id: number,
    @Query("page", ParseIntPipe) page: number = 1,
    @Query("limit", ParseIntPipe) limit: number = 10
  ): Promise<any> {
    return this.recycleDrugService.getDrugsByHospitalId(id, page, limit);
  }

  // Get filtered drugs by (id or name)
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "Get filtered drugs by (id or name)" })
  @Get("/search/:query")
  getFilteredDrugsByName(
    @HospitalId() id: number,
    @Param("query") query: string,
    @Query("page", ParseIntPipe) page: number = 1,
    @Query("limit", ParseIntPipe) limit: number = 10
  ): Promise<IPagination<Recycle[]>> {
    return this.recycleDrugService.getFilteredDrugsByName(
      query,
      id,
      page,
      limit
    );
  }

  // Get all drugs
  @UseGuards(JwtAuthGuard)
  @Get("/history")
  getAllDrugsByPharmacy(
    @HospitalId() id: number,
    @Query("page", ParseIntPipe) page: number = 1,
    @Query("limit", ParseIntPipe) limit: number = 10
  ): Promise<IPagination<IRecycledDrug[]>> {
    return this.recycleDrugService.getAllDrugsByPharmacy(id, page, limit);
  }

  // Confirm recycle drug status
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "Confirm recycle drug status" })
  @ApiResponse({ status: 200, type: MessageResponse })
  @Patch("/:id")
  updateRecycleDrugStatus(
    @HospitalId() companyId: number,
    @Param("id") id: number
  ): Promise<MessageResponse> {
    return this.recycleDrugService.updateRecycleDrugStatus(id, companyId);
  }

  // Get data for verbal process
  // @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "Get data for verbal process" })
  @Get("/process/:id")
  async getVerbalData(@Res() res: any, @Param("id") id: string): Promise<any> {
    try {
      const invoice = {
        shipping: {
          name: "John Doe",
          address: "1234 Main Street",
          city: "San Francisco",
          state: "CA",
          country: "US",
          postal_code: 94111,
        },
        items: [
          {
            item: "TC 100",
            description: "Toner Cartridge",
            quantity: 2,
            amount: 6000,
          },
          {
            item: "USB_EXT",
            description: "USB Cable Extender",
            quantity: 1,
            amount: 2000,
          },
        ],
        subtotal: 8000,
        paid: 0,
        invoice_nr: 1234,
      };
      function generateHeader(doc) {
        // doc
        //   .image("./logo.svg", 50, 45, { width: 50 })
        //   .fillColor("#444444")
        //   .fontSize(20)
        //   .text("ACME Inc.", 110, 57)
        //   .fontSize(10)
        //   .text("ACME Inc.", 200, 50, { align: "right" })
        //   .text("123 Main Street", 200, 65, { align: "right" })
        //   .text("New York, NY, 10025", 200, 80, { align: "right" })
        //   .moveDown();
      }

      function generateCustomerInformation(doc, invoice) {
        doc.fillColor("#444444").fontSize(20).text("Invoice", 50, 160);

        generateHr(doc, 185);

        const customerInformationTop = 200;

        doc
          .fontSize(10)
          .text("Invoice Number:", 50, customerInformationTop)
          .font("Helvetica-Bold")
          .text(invoice.invoice_nr, 150, customerInformationTop)
          .font("Helvetica")
          .text("Invoice Date:", 50, customerInformationTop + 15)
          .text(formatDate(new Date()), 150, customerInformationTop + 15)
          .text("Balance Due:", 50, customerInformationTop + 30)
          .text(
            formatCurrency(invoice.subtotal - invoice.paid),
            150,
            customerInformationTop + 30
          )

          .font("Helvetica-Bold")
          .text(invoice.shipping.name, 300, customerInformationTop)
          .font("Helvetica")
          .text(invoice.shipping.address, 300, customerInformationTop + 15)
          .text(
            invoice.shipping.city +
              ", " +
              invoice.shipping.state +
              ", " +
              invoice.shipping.country,
            300,
            customerInformationTop + 30
          )
          .moveDown();

        generateHr(doc, 252);
      }

      function generateInvoiceTable(doc, invoice) {
        let i;
        const invoiceTableTop = 330;

        doc.font("Helvetica-Bold");
        generateTableRow(
          doc,
          invoiceTableTop,
          "Item",
          "Description",
          "Unit Cost",
          "Quantity",
          "Line Total"
        );
        generateHr(doc, invoiceTableTop + 20);
        doc.font("Helvetica");

        for (i = 0; i < invoice.items.length; i++) {
          const item = invoice.items[i];
          const position = invoiceTableTop + (i + 1) * 30;
          generateTableRow(
            doc,
            position,
            item.item,
            item.description,
            formatCurrency(item.amount / item.quantity),
            item.quantity,
            formatCurrency(item.amount)
          );

          generateHr(doc, position + 20);
        }

        const subtotalPosition = invoiceTableTop + (i + 1) * 30;
        generateTableRow(
          doc,
          subtotalPosition,
          "",
          "",
          "Subtotal",
          "",
          formatCurrency(invoice.subtotal)
        );

        const paidToDatePosition = subtotalPosition + 20;
        generateTableRow(
          doc,
          paidToDatePosition,
          "",
          "",
          "Paid To Date",
          "",
          formatCurrency(invoice.paid)
        );

        const duePosition = paidToDatePosition + 25;
        doc.font("Helvetica-Bold");
        generateTableRow(
          doc,
          duePosition,
          "",
          "",
          "Balance Due",
          "",
          formatCurrency(invoice.subtotal - invoice.paid)
        );
        doc.font("Helvetica");
      }

      function generateFooter(doc) {
        doc
          .fontSize(10)
          .text(
            "Payment is due within 15 days. Thank you for your business.",
            50,
            780,
            { align: "center", width: 500 }
          );
      }

      function generateTableRow(
        doc,
        y,
        item,
        description,
        unitCost,
        quantity,
        lineTotal
      ) {
        doc
          .fontSize(10)
          .text(item, 50, y)
          .text(description, 150, y)
          .text(unitCost, 280, y, { width: 90, align: "right" })
          .text(quantity, 370, y, { width: 90, align: "right" })
          .text(lineTotal, 0, y, { align: "right" });
      }

      function generateHr(doc, y) {
        doc
          .strokeColor("#aaaaaa")
          .lineWidth(1)
          .moveTo(50, y)
          .lineTo(550, y)
          .stroke();
      }

      function formatCurrency(cents) {
        return "$" + (cents / 100).toFixed(2);
      }

      function formatDate(date) {
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();

        return year + "/" + month + "/" + day;
      }

      let doc = new PDFDocument({ size: "A4", margin: 50 });

      generateHeader(doc);
      generateCustomerInformation(doc, invoice);
      generateInvoiceTable(doc, invoice);
      generateFooter(doc);

      doc.pipe(res);

      // Add content to the PDF (in this case, it's empty)
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

  // Get monthly audit
  // @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "Get monthly audit" })
  @Get("/audit")
  async getMonthlyAudit(@Res() res): Promise<any> {
    try {
      const monthlyAuditPdf = await this.recycleDrugService.getMonthlyAudit(1);
      res.set({
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=pdf.pdf`,
        "Content-Length": monthlyAuditPdf.length,
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
        Expires: 0,
      });
      console.log(monthlyAuditPdf);
      res.end(monthlyAuditPdf);
    } catch (error) {
      if (error instanceof NotFoundException)
        res.status(404).send({ error: error.message });
      else res.status(500).send({ error: "Internal Server Error" });
    }
  }
}
