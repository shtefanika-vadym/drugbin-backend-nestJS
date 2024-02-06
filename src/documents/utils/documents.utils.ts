import PDFDocument from "pdfkit-table";
import { Recycle } from "src/recycle/recycle.model";
import { ProductPack } from "src/recycle/enum/product-pack";
import { IRecycledDrug } from "src/recycle/interfaces/drug.interface";
import { Hospital } from "src/hospital/hospital.model";

const buildDocHeader = (
  doc: PDFDocument,
  title: string,
  description: string,
  data: string
): void => {
  doc.font("src/fonts/Montserrat.ttf");
  doc.image("src/recycle/logo.jpg", { width: 130 });

  doc.moveDown();

  doc
    .strokeColor("#2949a6")
    .lineWidth(1)
    .moveTo(35, 90)
    .lineTo(565, 90)
    .stroke();

  doc.moveDown();
  doc.moveDown();

  doc.text(`Data ${data}`, {
    align: "right",
  });

  doc.moveDown();
  doc.moveDown();
  doc.moveDown();

  doc.fontSize(17).font("src/fonts/Montserrat-SemiBold.ttf").text(title, {
    align: "center",
  });

  doc.moveDown();
  doc.font("src/fonts/Montserrat.ttf");

  doc.fontSize(14);
  doc.text(description);

  doc.moveDown();
};

const buildDocFooter = (
  doc: PDFDocument,
  userName: string,
  hospitalName: string,
  isEmptyList: boolean
) => {
  doc.font("src/fonts/Montserrat.ttf");

  if (!isEmptyList) {
    doc.moveDown();
    doc.fontSize(14);
    doc.text("Motivul predarii medicamentelor: PP-OP-05-F03, rev 06");
  }

  doc.moveDown();
  doc.moveDown();

  doc.text("Am predat:", { continued: true });
  doc.text("Am preluat:", { align: "right" });

  doc.text(`${userName}`, { continued: true });
  doc.text(hospitalName, { align: "right" });
};

const getDocument = (
  recycleInfo: Recycle[],
  isPsycholeptic: boolean,
  createdAt: string,
  hospital: Hospital
) => {
  const isEmptyRecycleList = !recycleInfo.length;
  const doc = new PDFDocument({ size: "A4", margin: 35 });
  const additionalInfo = isPsycholeptic ? " stupifiante" : "";
  const title = `Proces verbal lunar de predare-primire medicamente${additionalInfo} expirate către firma de casare`;
  let description = `${hospital.name}, predau spre distrugere către firma de casare Demeco următoarele medicamente${additionalInfo}:`;
  const emptyDescription = `Farmacia ${hospital.name}, nu predau spre distrugere către firma de casare Demeco niciun medicament psihotrop.`;

  if (isEmptyRecycleList) {
    description = `${hospital.name}, nu predau spre distrugere către firma de casare Demeco niciun medicament`;
  }

  const drugList = recycleInfo
    .map((recycle: Recycle) => recycle.drugList)
    .flat();

  const filteredDrugList = drugList.filter(
    ({ drugDetails }) => drugDetails.isPsycholeptic === isPsycholeptic
  );

  const isEmptyPsycholepticList = isPsycholeptic && !filteredDrugList.length;

  buildDocHeader(
    doc,
    title,
    isEmptyPsycholepticList ? emptyDescription : description,
    createdAt.slice(0, 10)
  );

  buildDocTable(doc, filteredDrugList);

  buildDocFooter(doc, hospital.name, "Demeco", isEmptyPsycholepticList);
  return doc;
};

const buildDocTable = (doc: PDFDocument, drugList: IRecycledDrug[]) => {
  if (!drugList.length) {
    return;
  }
  let tableData = drugList.map(
    ({ lot, quantity, pack, drugDetails }, index: number) => {
      return {
        lot,
        quantity,
        id: index + 1,
        name: drugDetails.name,
        pack: ProductPack.pack ? "cutie" : pack,
        observation: drugDetails.isPsycholeptic ? "psihotrop" : "",
      };
    }
  );

  doc.table(
    {
      headers: [
        {
          width: 50,
          label: "Nr",
          property: "id",
          align: "center",
          headerColor: "#67BAEF",
        },
        {
          width: 270,
          label: "Nume",
          property: "name",
          headerColor: "#67BAEF",
        },
        {
          width: 100,
          property: "pack",
          headerColor: "#67BAEF",
          label: "Tip (cutie/blister)",
        },
        {
          width: 100,
          align: "center",
          label: "Cantitate",
          property: "quantity",
          headerColor: "#67BAEF",
        },
      ],
      datas: tableData as any,
    },
    {
      divider: {
        header: { disabled: true },
        horizontal: { disabled: true },
      },
      prepareRow: () =>
        doc.font("src/fonts/Montserrat-SemiBold.ttf").fontSize(10),
      prepareHeader: () =>
        doc.font("src/fonts/Montserrat-SemiBold.ttf").fontSize(10),
    }
  );
};

export const DocumentUtils = {
  getDocument,
};
