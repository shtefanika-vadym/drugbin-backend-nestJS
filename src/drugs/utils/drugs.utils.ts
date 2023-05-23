import { DrugPillsType } from "src/drugs/enum/drug-pills-type";

const getStringListByKey = (input: string[], key: string): string[] => {
  const result: string[] = [];
  input.forEach((str: string, index: number) => {
    if (str === key && index > 0) result.push(`${input[index - 1]} ${str}`);
    else if (str && input[index + 1] !== key) result.push(str);
  });

  return result;
};

const getDrugPack = (input: string): string[] => {
  const result: string[] = [];
  const wordList: string[] = input.split(" ");
  wordList.forEach((str: string, index: number) => {
    if (Object.keys(DrugPillsType).includes(str) && index > 0) result.push(`${wordList[index - 1]} ${str}`);
  });

  return result
};

const getDrugDetailsByKeys = (input: string[]) => {
  const result: string[] = [];
  input.forEach((str: string) => {
    const parsedStr: string[] = str
      .toLowerCase()
      .replace(",", "")
      .split(/[ /-]/);

    if (
      !parsedStr.includes(DrugPillsType.mg) &&
      !parsedStr.includes(DrugPillsType.pills) &&
      !parsedStr.includes(DrugPillsType.packets) &&
      !parsedStr.includes(DrugPillsType.capsules)
    )
      result.push(...parsedStr);
    else if (parsedStr.includes(DrugPillsType.mg))
      result.push(...getStringListByKey(parsedStr, DrugPillsType.mg));
    else if (parsedStr.includes(DrugPillsType.packets))
      result.push(...getStringListByKey(parsedStr, DrugPillsType.packets));
    else if (parsedStr.includes(DrugPillsType.pills))
      result.push(...getStringListByKey(parsedStr, DrugPillsType.pills));
    else if (parsedStr.includes(DrugPillsType.capsules))
      result.push(...getStringListByKey(parsedStr, DrugPillsType.capsules));
  });

  return [...new Set(result)];
};

export const DrugsUtils = { getDrugDetailsByKeys, getDrugPack };
