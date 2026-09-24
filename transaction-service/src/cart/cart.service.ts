import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ProductClientService } from '../product-client/product-client.service';
import { AddCartItemDto } from './dto/add-cart-item.dto';

@Injectable()
export class CartService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly productClient: ProductClientService,
  ) {}

  private async getOrCreateCart(userId: number) {
    let cart = await this.prisma.cart.findFirst({
      where: { user_id: userId },
      include: { items: true },
    });

    if (!cart) {
      cart = await this.prisma.cart.create({
        data: { user_id: userId },
        include: { items: true },
      });
    }

    return cart;
  }

  async getCart(userId: number) {
    const cart = await this.prisma.cart.findFirst({
      where: { user_id: userId },
      include: { items: true },
    });

    if (!cart || cart.items.length === 0) {
      return { items: [] };
    }

    const items = [];
    for (const item of cart.items) {
      const product = await this.productClient.getProduct(item.product_id);
      items.push({
        product_id: item.product_id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
      });
    }

    return { items };
  }

  async addItem(userId: number, dto: AddCartItemDto) {
    if (!Number.isInteger(dto.product_id) || dto.product_id < 1) {
      throw new BadRequestException('Product id must be a valid integer.');
    }

    if (!Number.isInteger(dto.quantity) || dto.quantity < 1) {
      throw new BadRequestException('Quantity must be a positive integer.');
    }

    const product = await this.productClient.getProduct(dto.product_id);

    if (dto.quantity > product.stock) {
      throw new BadRequestException(
        'Requested quantity exceeds product stock availability.',
      );
    }

    const cart = await this.getOrCreateCart(userId);

    const existingItem = cart.items.find(
      (item) => item.product_id === dto.product_id,
    );

    if (existingItem) {
      throw new BadRequestException('Product already exists in the cart.');
    }

    await this.prisma.cartItem.create({
      data: {
        cart_id: cart.id,
        product_id: dto.product_id,
        quantity: dto.quantity,
      },
    });

    return { message: 'Item added to cart successfully.' };
  }

  async updateItem(userId: number, productId: number, quantity: number) {
    if (!Number.isInteger(quantity) || quantity < 1) {
      throw new BadRequestException('Quantity must be a positive integer.');
    }

    const cart = await this.prisma.cart.findFirst({
      where: { user_id: userId },
      include: { items: true },
    });

    if (!cart) {
      throw new NotFoundException('Cart not found.');
    }

    const cartItem = cart.items.find((item) => item.product_id === productId);

    if (!cartItem) {
      throw new NotFoundException('Product not found in cart.');
    }

    const product = await this.productClient.getProduct(productId);

    if (quantity > product.stock) {
      throw new BadRequestException(
        'Quantity exceeds product stock availability.',
      );
    }

    await this.prisma.cartItem.update({
      where: { id: cartItem.id },
      data: { quantity },
    });

    return { message: 'Cart item updated successfully.' };
  }

  async removeItem(userId: number, productId: number) {
    const cart = await this.prisma.cart.findFirst({
      where: { user_id: userId },
      include: { items: true },
    });

    if (!cart) {
      throw new NotFoundException('Cart not found.');
    }

    const cartItem = cart.items.find((item) => item.product_id === productId);

    if (!cartItem) {
      throw new NotFoundException('Product not found in cart.');
    }

    await this.prisma.cartItem.delete({ where: { id: cartItem.id } });

    return { message: 'Product removed from cart successfully.' };
  }

  async clearCart(userId: number) {
    const cart = await this.prisma.cart.findFirst({
      where: { user_id: userId },
      include: { items: true },
    });

    if (!cart || cart.items.length === 0) {
      return { message: 'Cart cleared successfully.' };
    }

    await this.prisma.cartItem.deleteMany({ where: { cart_id: cart.id } });

    return { message: 'Cart cleared successfully.' };
  }

  async getCartItemsForCheckout(userId: number) {
    const cart = await this.prisma.cart.findFirst({
      where: { user_id: userId },
      include: { items: true },
    });

    return cart;
  }
}
