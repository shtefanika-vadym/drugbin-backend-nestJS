import Handlebars from "handlebars";

const registerHandlebarsHelpers = (): void => {
  Handlebars.registerHelper("math", function (lvalue, operator, rvalue) {
    lvalue = parseFloat(lvalue);
    rvalue = parseFloat(rvalue);

    return {
      "+": lvalue + rvalue,
    }[operator];
  });
};

export const HandlebarsUtils = { registerHandlebarsHelpers };
