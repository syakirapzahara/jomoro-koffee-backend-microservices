import { Body, Controller, Param, ParseIntPipe, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ProductsService } from '../products/products.service';
import { ReduceStockDto } from '../products/dto/reduce-stock.dto';

@ApiTags('Inter-Service Communication')
@Controller('service/products')
export class ServiceController {
  constructor(private readonly productsService: ProductsService) {}

  @Post(':id/reduce')
  @ApiOperation({
    summary: 'Reduce product stock (called by Transaction Service during checkout)',
  })
  reduce(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ReduceStockDto,
  ) {
    return this.productsService.reduceStock(id, dto.quantity);
  }
}
