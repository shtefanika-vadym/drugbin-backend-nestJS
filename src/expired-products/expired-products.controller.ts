import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Headers,
  UseGuards,
  UsePipes,
} from "@nestjs/common";
import { CreateExpiredProductDto } from "src/expired-products/dto/create-expired-product.dto";
import { ExpiredProductsService } from "src/expired-products/expired-products.service";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { ExpiredProductDto } from "src/expired-products/dto/expired-product.dto";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { RolesGuard } from "src/auth/roles.guard";
import { Roles } from "src/auth/roles.decorator";
import { Role } from "src/company/enum/Role";
import { ValidationPipe } from "src/pipes/validation.pipe";

@UseGuards(JwtAuthGuard)
@ApiTags("Expired Products")
@Controller("expired-products")
export class ExpiredProductsController {
  constructor(private expiredProductService: ExpiredProductsService) {}

  // Create expired product
  @ApiOperation({ summary: "Create expired product" })
  @UsePipes(ValidationPipe)
  @UseGuards(RolesGuard)
  @Roles(Role.pharmacy)
  @Post()
  create(
    @Body() dto: CreateExpiredProductDto,
    @Headers("Authorization") token: string
  ) {
    return this.expiredProductService.create(dto, token);
  }

  // Delete expired product
  @ApiOperation({ summary: "Delete expired product" })
  @UseGuards(RolesGuard)
  @Roles(Role.pharmacy)
  @Delete(":id")
  delete(@Param("id") id: number) {
    return this.expiredProductService.delete(id);
  }

  // Confirm expired product status
  @ApiOperation({ summary: "Confirm status expired product" })
  @UseGuards(RolesGuard)
  @Roles(Role.recycle)
  @Patch("/update-status/:id")
  updateStatus(@Param("id") id: number) {
    return this.expiredProductService.updateStatus(id);
  }

  // Update expired product
  @ApiOperation({ summary: "Update product" })
  @UseGuards(RolesGuard)
  @Roles(Role.pharmacy)
  @Put("/:id")
  updateProduct(
    @Body() productDto: CreateExpiredProductDto,
    @Param("id") id: number,
    @Headers("Authorization") token: string
  ) {
    return this.expiredProductService.updateProduct(id, productDto, token);
  }

  @ApiOperation({ summary: "Get all expired products" })
  @UseGuards(RolesGuard)
  @Roles(Role.pharmacy)
  @ApiResponse({ status: 200, type: [ExpiredProductDto] })
  @Get()
  getAllProducts(@Headers("Authorization") token: string) {
    return this.expiredProductService.getAllProducts(token);
  }

  // Retrieve all expired products
  @ApiOperation({ summary: "Get all pending expired products" })
  @ApiResponse({ status: 200, type: [ExpiredProductDto] })
  @UseGuards(RolesGuard)
  @Roles(Role.recycle)
  @Get("/pending")
  getAllPending() {
    return this.expiredProductService.getAllPending();
  }
}
