import { IsEmail, IsIn, IsString, Length, MinLength } from 'class-validator';

export class RegisterDto {
  @IsEmail() email!: string;
  @IsString() @MinLength(12) password!: string;
}

export class LoginDto extends RegisterDto {}

export class CreateOrganizationDto {
  @IsString() @Length(2, 120) name!: string;
  @IsIn(['artist', 'label']) type!: 'artist' | 'label';
}

export class CreateArtistDto {
  @IsString() @Length(1, 120) stageName!: string;
  @IsString() @Length(2, 160) legalName!: string;
}

export class CreateLabelDto {
  @IsString() @Length(2, 160) name!: string;
}
