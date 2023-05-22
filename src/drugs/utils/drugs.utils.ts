const getStringListByKey = (input: string[], key: string): string[] => {
  const result: string[] = [];
  input.forEach((str: string, index: number) => {
    if (str === key && index > 0) result.push(`${input[index - 1]} ${str}`);
    else if (str && input[index + 1] !== key) result.push(str);
  });

  return result;
};

const getDrugDetailsByKeys = (input: string[]) => {
  const result: string[] = [];
  input.forEach((str: string) => {
    const parsedStr: string[] = str
      .toLowerCase()
      .replace(",", "")
      .split(/[ /-]/);

    if (
      !parsedStr.includes("mg") &&
      !parsedStr.includes("plicuri") &&
      !parsedStr.includes("drajeuri") &&
      !parsedStr.includes("capsule")
    )
      result.push(...parsedStr);
    else if (parsedStr.includes("mg"))
      result.push(...getStringListByKey(parsedStr, "mg"));
    else if (parsedStr.includes("plicuri"))
      result.push(...getStringListByKey(parsedStr, "plicuri"));
    else if (parsedStr.includes("drajeuri"))
      result.push(...getStringListByKey(parsedStr, "drajeuri"));
    else if (parsedStr.includes("capsule"))
      result.push(...getStringListByKey(parsedStr, "capsule"));
  });

  return [...new Set(result)];
};

export const DrugsUtils = { getDrugDetailsByKeys };
