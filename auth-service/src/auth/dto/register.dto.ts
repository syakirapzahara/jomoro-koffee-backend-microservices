import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: 'John' })
  first_name: string;

  @ApiProperty({ example: 'Doe' })
  last_name: string;

  @ApiProperty({ example: 'john@example.com' })
  email: string;

  @ApiProperty({ example: 'pass12345' })
  password: string;
}
