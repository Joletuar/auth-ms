import { IsEmail, IsString, IsStrongPassword } from 'class-validator';

export class LogingUserDto {
  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @IsStrongPassword()
  password: string;
}
