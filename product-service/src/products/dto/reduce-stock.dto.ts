import { ApiProperty } from '@nestjs/swagger';

export class ReduceStockDto {
  @ApiProperty({ example: 5 })
  quantity: number;
}
