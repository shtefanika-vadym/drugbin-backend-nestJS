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
import { GetExpiredProductDto } from "src/expired-products/dto/get-expired-product.dto";
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

  @ApiOperation({ summary: "Delete expired product" })
  @UseGuards(RolesGuard)
  @Roles(Role.pharmacy)
  @Delete(":id")
  delete(@Param("id") id: string) {
    return this.expiredProductService.delete(id);
  }

  @ApiOperation({ summary: "Confirm status expired product" })
  @UseGuards(RolesGuard)
  @Roles(Role.recycle)
  @Patch("/update-state/:id")
  updateStatus(@Param("id") id: string) {
    return this.expiredProductService.updateStatus(Number(id));
  }

  @ApiOperation({ summary: "Confirm status expired product" })
  @UseGuards(RolesGuard)
  @Roles(Role.pharmacy)
  @Put("/:id")
  updateProduct(
    @Body() productDto: CreateExpiredProductDto,
    @Param("id") id: string
  ) {
    return this.expiredProductService.updateProduct(Number(id), productDto);
  }

  @ApiOperation({ summary: "Get all expired products" })
  @UseGuards(RolesGuard)
  @Roles(Role.pharmacy)
  @ApiResponse({ status: 200, type: [GetExpiredProductDto] })
  @Get()
  getAll() {
    return this.expiredProductService.getAll();
  }

  @ApiOperation({ summary: "Get last pending expired products" })
  @ApiResponse({ status: 200, type: [GetExpiredProductDto] })
  @UseGuards(RolesGuard)
  @Roles(Role.recycle)
  @Get("/pending")
  getRecentPending() {
    return this.expiredProductService.getRecentPending();
  }
}
