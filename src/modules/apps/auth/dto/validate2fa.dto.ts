import { IsNotEmpty, IsString } from 'class-validator';

export class Validate2FADto {
  @IsNotEmpty()
  @IsString()
  token: string;

  @IsNotEmpty()
  @IsString()
  access_token: string;
}
