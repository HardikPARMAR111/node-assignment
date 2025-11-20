import { IsEmail, MinLength } from "class-validator";

export class LoginDto {
  @IsEmail({}, { message: "enter a valid email" })
  email!: string;

  @MinLength(6, { message: "password should at least contain 6 characters" })
  password!: string;
}
