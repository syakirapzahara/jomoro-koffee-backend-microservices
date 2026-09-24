import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({ example: 'Classic Espresso Shot Dark' })
  name: string;

  @ApiProperty({
    example: 'Rich and bold single shot espresso made from premium beans.',
  })
  description: string;

  @ApiProperty({ example: 25000 })
  price: number;

  @ApiProperty({ example: 100 })
  stock: number;

  @ApiProperty({ example: null, required: false })
  image_url?: string | null;

  @ApiProperty({ example: 1 })
  category_id: number;
}
