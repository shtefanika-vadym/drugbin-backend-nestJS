import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Drug } from "src/drugs/drugs.model";
import { VisionService } from "src/vision/vision.service";
import { Op } from "sequelize";
import { DrugPillsType } from "src/drugs/enum/drug-pills-type";
import axios from "axios";

@Injectable()
export class DrugsService {
  constructor(
    @InjectModel(Drug) private drugRepository: typeof Drug,
    private visionService: VisionService
  ) {}

  getDrugsByName(name: string): Promise<Drug[]> {
    if (!name)
      return this.drugRepository.findAll({
        limit: 10,
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
      });

    return this.drugRepository.findAll({
      limit: 10,
      where: {
        [Op.or]: [{ name: { [Op.iLike]: `%${name}%` } }],
      },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });
  }

  getDrugByIdList(idList: number[]): Promise<Drug[]> {
    return this.drugRepository.findAll({
      where: {
        id: idList,
      },
    });
  }

  getDrugPackageDetails(drugDetailsList: string[], pack: string) {
    const drugPackageList: string[] = pack.match(/\d+/g) || [];

    const hasPackage: boolean = drugDetailsList.some(
      (details: string): boolean =>
        details.includes(DrugPillsType.pills) ||
        details.includes(DrugPillsType.packets) ||
        details.includes(DrugPillsType.capsules)
    );

    // const drugPackList: string[] = DrugsUtils.getDrugPack(pack);

    // console.log(pack);

    let packageTotal: number = drugPackageList
      .map(Number)
      .reduce((acc: number, el: number) => acc * el, 1);

    const isSamePackage: boolean = drugDetailsList.some(
      (drugDetails: string) => {
        return (
          drugDetails.split(" ").length === 2 &&
          !drugDetails.includes(DrugPillsType.mg) &&
          drugDetails.includes(String(packageTotal))
        );
      }
    );

    return { hasPackage: false, packageTotal, isSamePackage };
  }

  async identifyDrugByImage(image: Express.Multer.File): Promise<Drug[]> {
    const textList: string[] = await this.visionService.identifyText(image);
    const makeAPICall = async (search_term: string) => {
      try {
        const response = await axios.post("http://127.0.0.1:5000/similarity", {
          search_term,
        });
        return response.data;
      } catch (error) {
        console.error(`Error for text "${search_term}":`, error);
        return null;
      }
    };
    console.log(textList);
    const apiCallPromises = textList.map((text) => makeAPICall(text));
    const results = await Promise.all(apiCallPromises);
    return results;
    // const response = await axios.post("http://127.0.0.1:5000/similarity", {
    //   search_term: "paduden 400mg",
    // });
    // console.log(response.data);
    // return response.data
    // const {
    //   data: { items = [] },
    // } = await firstValueFrom(
    //   this.httpService.get('apiUrl').pipe(
    //     catchError((error: AxiosError): Promise<any> => {
    //       throw error;
    //     }),
    //   ),
    // );
    return [];

    const drugs: Drug[] = await this.drugRepository.findAll();
    // const textList: string[][] = await this.visionService.identifyText(image);

    const identifiedDrugs: Drug[] = [];

    console.log(textList);

    // textList.forEach((drugDetailsList: string[]): void => {
    //   let bestScore: number = -1;
    //   let bestDrug: Drug = null;
    //
    //   drugs.forEach((drug: Drug): void => {
    //     // const drugPackageList: string[] = drug.packaging.match(/\d+/g) || [];
    //
    //     const drugConcentration: string[] = drug.concentration
    //       ?.split(/[ \/,+-]/)
    //       ?.map((str: string) => str.replace(/(\d+)\s*(\D+)/i, "$1 $2"));
    //
    //     const nameWithConcentration = drug.name
    //       // " " +
    //       // drugConcentration
    //       .toLowerCase()
    //       .replace("(", "")
    //       .replace(")", "")
    //       .replace("ⓡ", "");
    //
    //     const drugNameWithConcentration: string[] =
    //       nameWithConcentration.split(/[ \/,+-]/);
    //
    //     const uniqueDrugNameList: string[] = [
    //       ...new Set(drugNameWithConcentration),
    //     ];
    //
    //     const { isSamePackage, packageTotal, hasPackage } =
    //       this.getDrugPackageDetails(drugDetailsList, drug.packaging);
    //
    //     // const packageTotal: number = drugPackageList
    //     //   .map(Number)
    //     //   .reduce((acc: number, el: number) => acc * el, 1);
    //
    //     let totalCount: number = drugDetailsList.reduce(
    //       (acc: number, el: string): number => {
    //         const isCounting: boolean = nameWithConcentration.includes(el);
    //         return isCounting ? acc + 1 : acc;
    //       },
    //       0
    //     );
    //
    //     // const hasPackage: boolean = drugDetailsList.some(
    //     //   (details: string): boolean =>
    //     //     details.includes(DrugPillsType.pills) ||
    //     //     details.includes(DrugPillsType.packets) ||
    //     //     details.includes(DrugPillsType.capsules)
    //     // );
    //     //
    //     // const isSamePackage: boolean = drugDetailsList.some(
    //     //   (drugDetails: string) => {
    //     //     return (
    //     //       drugDetails.split(" ").length === 2 &&
    //     //       !drugDetails.includes(DrugPillsType.mg) &&
    //     //       drugDetails.includes(String(packageTotal))
    //     //     );
    //     //   }
    //     // );
    //
    //     const isContainsAll: boolean = uniqueDrugNameList.every(
    //       (item: string) =>
    //         drugDetailsList.some((el: string): boolean => {
    //           if (item === "&") return true;
    //           if (item.length === 1) return el === item;
    //           // if ((item.length === 1 || el.length === 1) && !Number(item))
    //           // return el === item;
    //           return el.includes(item);
    //         })
    //     );
    //
    //     // if (
    //     //   drug.id === 6438
    //     //   // uniqueDrugNameList.includes("coldrex") &&
    //     //   // drugDetailsList.includes("coldrex")
    //     // ) {
    //     //   console.log(uniqueDrugNameList, isContainsAll, drugDetailsList);
    //     //
    //     //   const gf: boolean = uniqueDrugNameList.every((item: string) =>
    //     //     drugDetailsList.some((el: string): boolean => {
    //     //       if (item === "&") return true;
    //     //       if (item.length === 1) return el === item;
    //     //
    //     //       return el.includes(item);
    //     //     })
    //     //   );
    //     //   console.log(gf);
    //     // }
    //
    //     if (totalCount >= bestScore && isContainsAll) {
    //       if ((hasPackage && isSamePackage) || !hasPackage) {
    //         // console.log(uniqueDrugNameList);
    //         bestScore = totalCount;
    //         bestDrug = drug;
    //       }
    //     }
    //   });
    //
    //   const isAlreadyExisted: boolean =
    //     bestDrug &&
    //     identifiedDrugs.some((drug: Drug): boolean => drug.id === bestDrug.id);
    //
    //   if (bestDrug && !isAlreadyExisted) identifiedDrugs.push(bestDrug);
    // });
    return identifiedDrugs;
  }
}
