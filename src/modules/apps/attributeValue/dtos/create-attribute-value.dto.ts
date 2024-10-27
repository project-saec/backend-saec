import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateAttributeValueDto {
  @IsString()
  @IsNotEmpty()
  value: string;

  @IsNumber()
  @IsNotEmpty()
  attributeTypeId: number;
}
