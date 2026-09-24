import {
  Body,
  Controller,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ProductsService } from '../products/products.service';
import { CreateProductDto } from '../products/dto/create-product.dto';
import { ReduceStockDto } from '../products/dto/reduce-stock.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@ApiTags('Product Management (Admin)')
@ApiBearerAuth()
@Controller('admin/products')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
export class AdminController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new product' })
  create(@Body() dto: CreateProductDto) {
    return this.productsService.create(dto);
  }

  @Post(':id/update')
  @ApiOperation({ summary: 'Update product details' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CreateProductDto,
  ) {
    return this.productsService.update(id, dto);
  }

  @Post(':id/reduce')
  @ApiOperation({ summary: 'Reduce product stock quantity' })
  reduce(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ReduceStockDto,
  ) {
    return this.productsService.reduceStock(id, dto.quantity);
  }

  @Post(':id/delete')
  @ApiOperation({ summary: 'Delete a product' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.remove(id);
  }
}
