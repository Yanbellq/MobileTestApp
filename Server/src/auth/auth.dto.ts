import {
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsOptional,
  MinLength,
} from 'class-validator';

export class SignUpDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsNotEmpty()
  @IsIn(['WORKER', 'EMPLOYER'])
  userType: 'WORKER' | 'EMPLOYER';

  @IsNotEmpty()
  @MinLength(2)
  name: string;
}

export class SignInDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  password: string;
}

export class UpdateProfileDto {
  @IsOptional()
  @MinLength(2)
  name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  avatarUrl?: string;
}

export class UpdatePasswordDto {
  @IsNotEmpty()
  @MinLength(6)
  currentPassword: string;

  @IsNotEmpty()
  @MinLength(6)
  newPassword: string;
}
