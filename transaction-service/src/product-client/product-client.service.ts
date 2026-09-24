import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export interface ProductInfo {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  image_url: string | null;
  category_id: number;
}

@Injectable()
export class ProductClientService {
  private readonly baseUrl: string;

  constructor(private readonly configService: ConfigService) {
    this.baseUrl =
      this.configService.get<string>('PRODUCT_SERVICE_URL') ??
      'http://localhost:3002';
  }

  async getProduct(productId: number): Promise<ProductInfo> {
    const response = await fetch(`${this.baseUrl}/products/${productId}`);

    if (response.status === 404) {
      throw new NotFoundException('Product not found.');
    }

    if (!response.ok) {
      throw new BadRequestException('Failed to fetch product from Product Service.');
    }

    return (await response.json()) as ProductInfo;
  }

  async reduceStock(productId: number, quantity: number): Promise<void> {
    const response = await fetch(
      `${this.baseUrl}/service/products/${productId}/reduce`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity }),
      },
    );

    if (!response.ok) {
      const errorBody = (await response.json().catch(() => ({}))) as {
        message?: string;
      };
      throw new BadRequestException(
        errorBody.message ?? 'Failed to reduce product stock.',
      );
    }
  }
}
