import { IsNotEmpty, IsString } from 'class-validator';

export class CreateAttributeTypeDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}
