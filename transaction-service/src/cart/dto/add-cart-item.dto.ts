import { ApiProperty } from '@nestjs/swagger';

export class AddCartItemDto {
  @ApiProperty({ example: 1 })
  product_id: number;

  @ApiProperty({ example: 2 })
  quantity: number;
}
