import { IsEmail, IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class LoginDto {
  @ApiProperty({
    default: 'test@email1.com',
    type: String,
  })
  @Transform(({ value }) => value.toLowerCase())
  @IsEmail()
  readonly email: string;

  @ApiProperty({
    default: 'P@ssword12',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  readonly password: string;
}

export default LoginDto;
