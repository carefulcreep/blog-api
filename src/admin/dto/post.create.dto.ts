import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString } from 'class-validator';

export class PostCreateDto {
  @ApiProperty({
    type: String,
    example: 'Example Header',
  })
  @IsString()
  header: string;

  @ApiProperty({
    type: String,
    example: 'Example Body',
  })
  @IsString()
  body: string;
}
