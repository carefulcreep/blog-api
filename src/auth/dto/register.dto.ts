import {
  IsEmail,
  IsString,
  MinLength,
  MaxLength,
  Matches,
  Length,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class RegisterDto {
  @ApiProperty({
    default: 'First name',
    type: String,
  })
  @IsString()
  @Length(2, 30)
  readonly firstName: string;

  @ApiProperty({
    default: 'Last name',
    type: String,
  })
  @IsString()
  @Length(2, 30)
  readonly lastName: string;

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
  @MinLength(8, { message: 'The min length of password is 8' })
  @MaxLength(100, {
    message: "The password can't accept more than 100 characters",
  })
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d[\]{};:=<>_+^#$@!%*?&]{8,100}$/,
    {
      message:
        'A password at least contains one digit, one uppercase letter and one lowercase letter',
    },
  )
  readonly password: string;
}

export default RegisterDto;
