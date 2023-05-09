import * as path from "path";

const getCurrentDate = (): string => new Date().toISOString().slice(0, 10);

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

const getPathMonthlyTemplate = (): string =>
  path.join(process.cwd(), "templates", "pdf-verbal-process-month.hbs");

export const RecycleDrugUtils = {
  getCurrentDate,
  getPdfFormat,
  getPathTemplate,
  getPathMonthlyTemplate,
};
