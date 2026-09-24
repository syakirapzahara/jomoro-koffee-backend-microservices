import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  hasAtLeastThreeWords,
  isValidCategoryId,
  isValidDescription,
  isValidPrice,
  isValidStock,
} from '../common/validators';
import { CreateProductDto } from './dto/create-product.dto';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.product.findMany({
      include: { category: true },
    });
  }

  async findOne(id: number) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: { category: true },
    });

    if (!product) {
      throw new NotFoundException('Product not found.');
    }

    return product;
  }

  async findByCategory(categoryId: number) {
    const category = await this.prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (!category) {
      throw new NotFoundException('Category not found.');
    }

    return this.prisma.product.findMany({
      where: { category_id: categoryId },
      include: { category: true },
    });
  }

  private async validateProductData(dto: CreateProductDto) {
    if (!hasAtLeastThreeWords(dto.name)) {
      throw new BadRequestException(
        'Product name must contain at least 3 words.',
      );
    }

    if (!isValidDescription(dto.description)) {
      throw new BadRequestException(
        'Product description must have at least 20 characters.',
      );
    }

    if (!isValidPrice(dto.price)) {
      throw new BadRequestException('Price must be a positive integer (at least 1).');
    }

    if (!isValidStock(dto.stock)) {
      throw new BadRequestException('Product stock must be between 0 and 999.');
    }

    if (!isValidCategoryId(dto.category_id)) {
      throw new BadRequestException('Category id must be a valid integer.');
    }

    const category = await this.prisma.category.findUnique({
      where: { id: dto.category_id },
    });

    if (!category) {
      throw new BadRequestException(
        'Category id must reference an existing category.',
      );
    }
  }

  async create(dto: CreateProductDto) {
    await this.validateProductData(dto);

    await this.prisma.product.create({
      data: {
        name: dto.name,
        description: dto.description,
        price: dto.price,
        stock: dto.stock,
        image_url: dto.image_url ?? null,
        category_id: dto.category_id,
      },
    });

    return { message: 'Product created successfully.' };
  }

  async update(id: number, dto: CreateProductDto) {
    const product = await this.prisma.product.findUnique({ where: { id } });

    if (!product) {
      throw new NotFoundException('Product not found.');
    }

    await this.validateProductData(dto);

    await this.prisma.product.update({
      where: { id },
      data: {
        name: dto.name,
        description: dto.description,
        price: dto.price,
        stock: dto.stock,
        image_url: dto.image_url ?? null,
        category_id: dto.category_id,
      },
    });

    return { message: 'Product updated successfully.' };
  }

  async reduceStock(id: number, quantity: number) {
    if (!Number.isInteger(quantity) || quantity < 1) {
      throw new BadRequestException('Quantity must be a positive integer.');
    }

    const product = await this.prisma.product.findUnique({ where: { id } });

    if (!product) {
      throw new NotFoundException('Product not found.');
    }

    if (quantity > product.stock) {
      throw new BadRequestException(
        'Quantity exceeds the product stock availability.',
      );
    }

    await this.prisma.product.update({
      where: { id },
      data: { stock: product.stock - quantity },
    });

    return { message: 'Product stock reduced successfully.' };
  }

  async remove(id: number) {
    const product = await this.prisma.product.findUnique({ where: { id } });

    if (!product) {
      throw new NotFoundException('Product not found.');
    }

    await this.prisma.product.delete({ where: { id } });

    return { message: 'Product deleted successfully.' };
  }
}
