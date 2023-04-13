import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { CreateExpiredProductDto } from "src/expired-products/dto/create-expired-product.dto";
import { InjectModel } from "@nestjs/sequelize";
import { ExpiredProduct } from "src/expired-products/expired-products.model";
import { ProductStatus } from "src/expired-products/enum/product-status";
import { TokenUtils } from "src/utils/token.utils";
import { CompanyService } from "src/company/company.service";
import { DrugStockService } from "src/drug-stock/drug-stock.service";

@Injectable()
export class ExpiredProductsService {
  constructor(
    @InjectModel(ExpiredProduct)
    private expiredProductsRepository: typeof ExpiredProduct,
    private companyService: CompanyService,
    private drugService: DrugStockService,
    private tokenUtils: TokenUtils
  ) {}

  async create(dto: CreateExpiredProductDto, token: string) {
    const companyId = this.tokenUtils.getCompanyIdFromToken(token);
    const product = {
      ...dto,
      companyId,
      status: ProductStatus.pending,
    };

    await this.expiredProductsRepository.create(product);
    await this.companyService.updateQuantity(companyId);

    return {
      message: "Expired product successfully created",
    };
  }

  async updateStatus(id: number) {
    const product = await this.expiredProductsRepository.findByPk(id);

    if (!product) throw new NotFoundException("Expired product not found");

    if (product.status === ProductStatus.recycled)
      throw new BadRequestException("Product is already confirmed");

    await product.update({ ...product, status: ProductStatus.recycled });

    return {
      message: "ProductStatus successfully updated",
    };
  }

  async updateProduct(
    id: number,
    productDto: CreateExpiredProductDto,
    token: string
  ) {
    const companyId = this.tokenUtils.getCompanyIdFromToken(token);
    const product = await this.expiredProductsRepository.findByPk(id);

    if (!product) throw new NotFoundException("Expired product not found");

    if (product.companyId !== companyId)
      throw new ForbiddenException("Forbidden");

    if (product.status === ProductStatus.recycled)
      throw new BadRequestException("Product is already confirmed");

    await product.update(productDto);

    return {
      message: "ProductStatus successfully updated",
    };
  }

  async getAllProducts(token: string) {
    const companyId = this.tokenUtils.getCompanyIdFromToken(token);
    const products = await this.expiredProductsRepository.findAll({
      where: { companyId },
    });
    return products;
  }

  async delete(id: number) {
    const deletedProduct = await this.expiredProductsRepository.destroy({
      where: { id },
    });

    if (!deletedProduct)
      throw new NotFoundException("Expired product not found");

    return {
      message: "Expired product successfully deleted",
    };
  }

  async getAllPending() {
    const expiredProducts = await this.expiredProductsRepository.findAll({
      include: { all: true },
      where: {
        status: ProductStatus.pending,
      },
    });

    return expiredProducts;
  }

  async getByCompanyId(companyId: string) {
    const products = await this.expiredProductsRepository.findOne({
      where: { companyId },
      include: { all: true },
    });
    return products;
  }
}
