import PDFDocument from "pdfkit-table";
import { Recycle } from "src/recycle/recycle.model";
import { ProductPack } from "src/recycle/enum/product-pack";
import { IDrug } from "src/recycle/interfaces/drug.interface";
import { DrugCategory } from "src/vision/interfaces/identified-drug.interface";

// TODO: Refactor
const categoryLabels: Record<number, string> = {
  1: "citotoxice și citostatice",
  2: "inhalatoare",
  3: "tăietoare",
  4: "insuline",
  5: "uzuale",
  6: "suplimente",
  7: "stupefiante",
};

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
  doc.fillColor("black");

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

const getRecycleDoc = (
  { firstName, lastName, drugList, createdAt, hospital }: Recycle,
  category: DrugCategory
) => {
  const doc = new PDFDocument({ margin: 35 });
  doc.fillColor("black");

  const userName = `${firstName ?? ""} ${lastName ?? ""}`;
  const title = `Proces verbal de predare-primire medicamente expirate din categoria ${categoryLabels[category]}`;
  const description = `Subsemnatul(a) ${userName}, predau spre distrugere in ${hospital.name} urmatoarele medicamente:`;
  const emptyDescription = `Subsemnatul(a) ${userName}, nu predau spre distrugere in ${hospital.name} niciun medicament expirat din categeoria ${categoryLabels[category]}.`;

  const filteredDrugList = drugList.filter(
    (drug) => drug.category === category
  );

  const isEmptyDrugList = !filteredDrugList.length;
  buildDocHeader(
    doc,
    title,
    isEmptyDrugList ? emptyDescription : description,
    createdAt.toISOString().slice(0, 10)
  );

  if (!isEmptyDrugList) {
    buildDocTable(doc, filteredDrugList);
  }

  buildDocFooter(doc, userName, hospital.name, isEmptyDrugList);
  return doc;
};

const buildDocTable = (doc: PDFDocument, drugList: IDrug[]) => {
  let tableData = drugList.map(
    ({ quantity, pack, name, atc }, index: number) => {
      return {
        name,
        quantity,
        id: index + 1,
        pack: pack === ProductPack.box ? "cutie" : "unitate",
        observation: atc?.startsWith("N05") ? "psihotrop" : "",
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
          label: "Tip (cutie/unitate)",
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

export const RecycleUtils = {
  getRecycleDoc,
};
