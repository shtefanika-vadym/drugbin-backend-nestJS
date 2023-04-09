import { Injectable } from "@nestjs/common";
import { CreateExpiredProductDto } from "src/expired-products/dto/create-expired-product.dto";
import { InjectModel } from "@nestjs/sequelize";
import { ExpiredProduct } from "src/expired-products/expired-products.model";
import { JwtService } from "@nestjs/jwt";
import { Status } from "src/expired-products/enum/Status";

@Injectable()
export class ExpiredProductsService {
  constructor(
    @InjectModel(ExpiredProduct)
    private expiredProductsRepository: typeof ExpiredProduct,
    private jwtService: JwtService
  ) {}

  async create(dto: CreateExpiredProductDto, req) {
    const token = req.headers.authorization.split(" ")[1];
    const { id } = this.jwtService.verify(token);
    const product = {
      ...dto,
      companyId: id,
      status: Status.pending,
    };
    await this.expiredProductsRepository.create(product);
    const products = await this.getAll();
    return {
      data: products,
      message: "Expired product successfully created",
    };
  }

  async updateStatus(id: number) {
    const product = await this.expiredProductsRepository.findByPk(id);

    if (!product)
      return {
        message: "Expired product not found",
      };
    else if (product.status === Status.recycled)
      return {
        message: "Product is already confirmed",
      };

    await product.update({ ...product, status: Status.recycled });

    return {
      message: "Status successfully updated",
    };
  }

  async updateProduct(id: number, productDto: CreateExpiredProductDto) {
    const product = await this.expiredProductsRepository.findByPk(id);

    if (!product)
      return {
        message: "Expired product not found",
      };
    else if (product.status === Status.recycled)
      return {
        message: "Product is already confirmed",
      };

    await product.update(productDto);

    return {
      message: "Status successfully updated",
    };
  }

  async getAll() {
    const expiredProducts = await this.expiredProductsRepository.findAll({
      include: { all: true },
    });
    return expiredProducts.map(
      ({ id, name, brand, type, pack, status, createdAt }) => ({
        id,
        name,
        brand,
        type,
        pack,
        status,
        createdAt,
      })
    );
  }

  async delete(id: string) {
    const deletedProduct = await this.expiredProductsRepository.destroy({
      where: { id },
    });

    return {
      message: deletedProduct
        ? "Expired product successfully deleted"
        : "Expired product not found",
    };
  }

  async getRecentPending() {
    const expiredProducts = await this.expiredProductsRepository.findAll({
      include: { all: true },
    });

    const filtered = expiredProducts.filter(
      (product) => product.status === Status.pending
    );

    return filtered;
  }

  async getByCompanyId(companyId: string) {
    const products = await this.expiredProductsRepository.findOne({
      where: { companyId },
      include: { all: true },
    });
    return products;
  }
}
