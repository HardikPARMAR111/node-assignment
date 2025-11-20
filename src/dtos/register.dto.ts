import {
  IsEmail,
  IsNotEmpty,
  MinLength,
  IsIn,
  IsOptional,
} from "class-validator";

export class RegisterDto {
  @IsNotEmpty({ message: "Name is Required" })
  name!: string;

  @IsEmail({}, { message: "Enter valid email" })
  email!: string;

  @MinLength(6, { message: "Passowrd should at least contain 6 characters" })
  password!: string;

  @IsIn(["ADMIN", "STAFF"], { message: "Role must be ADMIN or STAFF" })
  role!: "ADMIN" | "STAFF";

  @IsOptional()
  phone?: string;

  @IsOptional()
  city?: string;

  @IsOptional()
  country?: string;
}
