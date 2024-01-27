import PDFDocument from "pdfkit-table";
import { Recycle } from "src/recycle/recycle.model";
import { ProductPack } from "src/recycle/enum/product-pack";
import { IRecycledDrug } from "src/recycle/interfaces/drug.interface";

const getRecycleDoc = ({
  firstName,
  lastName,
  drugList,
  createdAt,
  hospital,
}: Recycle) => {
  const doc = new PDFDocument({ size: "A4", margin: 35 });

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

  doc.text(`Data ${createdAt.toISOString().slice(0, 10)}`, {
    align: "right",
  });

  doc.moveDown();
  doc.moveDown();
  doc.moveDown();

  doc
    .fontSize(17)
    .font("src/fonts/Montserrat-SemiBold.ttf")
    .text("Proces verbal de predare-primire medicamente expirate", {
      align: "center",
    });

  doc.moveDown();
  doc.font("src/fonts/Montserrat.ttf");

  doc.fontSize(14);
  doc.text(
    `Subsemnatul(a) ${firstName ?? ""} ${
      lastName ?? ""
    }, predau spre distrugere in ${hospital.name} urmatoarele medicamente:`
  );

  doc.moveDown();

  buildDocTable(doc, drugList);

  doc.font("src/fonts/Montserrat.ttf");

  doc.moveDown();
  doc.fontSize(14);

  doc.text("Motivul predarii medicamentelor: PP-OP-05-F03, rev 06");

  doc.moveDown();
  doc.moveDown();
  doc.moveDown();

  doc.text("Am predat:", { continued: true });
  doc.text("Am preluat:", { align: "right" });

  doc.text(`${firstName ?? ""} ${lastName ?? ""}`, { continued: true });
  doc.text(hospital.name, { align: "right" });
  return doc;
};

const buildDocTable = (doc: PDFDocument, drugList: IRecycledDrug[]) => {
  const tableData = drugList.map(
    ({ lot, quantity, pack, drugDetails }, index: number) => {
      return {
        lot,
        quantity,
        id: index + 1,
        name: drugDetails.name,
        pack: ProductPack.pack ? "cutie" : pack,
        observation: drugDetails.isPsycholeptic ? drugDetails.atc : "",
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
          width: 150,
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
          width: 62,
          label: "Lot",
          property: "lot",
          headerColor: "#67BAEF",
        },
        {
          width: 62,
          label: "Cantitate",
          property: "quantity",
          headerColor: "#67BAEF",
        },
        {
          width: 100,
          align: "center",
          label: "Observatii",
          property: "observation",
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
