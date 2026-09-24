import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'john@jomoro.com' })
  email: string;

  @ApiProperty({ example: 'pass12345' })
  password: string;
}
