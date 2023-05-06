import * as path from "path";

const getCurrentDate = (): string =>
  new Date()
    .toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
    .replace(/\//g, "-");

const getPdfFormat = () => ({
  format: "A4",
  displayHeaderFooter: false,
  margin: {
    left: "20mm",
    top: "20mm",
    right: "20mm",
    bottom: "20mm",
  },
  landscape: false,
});

const getPathTemplate = (): string =>
  path.join(process.cwd(), "templates", "pdf-verbal-process.hbs");

export const RecycleDrugUtils = {
  getCurrentDate,
  getPdfFormat,
  getPathTemplate,
};
