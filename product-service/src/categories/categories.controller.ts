import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CategoriesService } from './categories.service';
import { ProductsService } from '../products/products.service';

@ApiTags('Categories')
@Controller('categories')
export class CategoriesController {
  constructor(
    private readonly categoriesService: CategoriesService,
    private readonly productsService: ProductsService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'List all categories' })
  findAll() {
    return this.categoriesService.findAll();
  }

  @Get(':categoryId/products')
  @ApiOperation({ summary: 'Filter products by category' })
  findProductsByCategory(
    @Param('categoryId', ParseIntPipe) categoryId: number,
  ) {
    return this.productsService.findByCategory(categoryId);
  }
}
