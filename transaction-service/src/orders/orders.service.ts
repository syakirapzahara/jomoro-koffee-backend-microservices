import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ProductClientService, ProductInfo } from '../product-client/product-client.service';
import { CartService } from '../cart/cart.service';

@Injectable()
export class OrdersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly productClient: ProductClientService,
    private readonly cartService: CartService,
  ) {}

  async findAllByUser(userId: number) {
    return this.prisma.order.findMany({
      where: { user_id: userId },
      orderBy: { created_at: 'desc' },
    });
  }

  async findOrderDetail(userId: number, orderId: number) {
    const order = await this.prisma.order.findFirst({
      where: { id: orderId, user_id: userId },
      include: { details: true },
    });

    if (!order) {
      throw new NotFoundException('Order not found.');
    }

    const details = [];
    for (const detail of order.details) {
      const product = await this.productClient.getProduct(detail.product_id);
      details.push({
        product_id: detail.product_id,
        name: product.name,
        quantity: detail.quantity,
        price: detail.price,
      });
    }

    return {
      order_id: order.id,
      created_at: order.created_at,
      details,
    };
  }

  async checkout(userId: number) {
    const cart = await this.cartService.getCartItemsForCheckout(userId);

    if (!cart || cart.items.length === 0) {
      throw new BadRequestException('Cart is empty.');
    }

    const productDetails: Array<{
      product_id: number;
      quantity: number;
      product: ProductInfo;
    }> = [];

    for (const item of cart.items) {
      const product = await this.productClient.getProduct(item.product_id);

      if (item.quantity > product.stock) {
        throw new BadRequestException(
          `Insufficient stock for product: ${product.name}`,
        );
      }

      productDetails.push({
        product_id: item.product_id,
        quantity: item.quantity,
        product,
      });
    }

    const order = await this.prisma.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: { user_id: userId },
      });

      for (const detail of productDetails) {
        await tx.orderDetail.create({
          data: {
            order_id: newOrder.id,
            product_id: detail.product_id,
            price: detail.product.price,
            quantity: detail.quantity,
          },
        });
      }

      return newOrder;
    });

    try {
      for (const detail of productDetails) {
        await this.productClient.reduceStock(
          detail.product_id,
          detail.quantity,
        );
      }
    } catch (error) {
      await this.prisma.orderDetail.deleteMany({
        where: { order_id: order.id },
      });
      await this.prisma.order.delete({ where: { id: order.id } });
      throw error;
    }

    await this.prisma.cartItem.deleteMany({ where: { cart_id: cart.id } });

    return { message: 'Checkout successful. Order has been placed.' };
  }
}
