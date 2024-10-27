import { PartialType } from '@nestjs/mapped-types';
import { CreateAttributeValueDto } from 'src/modules/apps/attributeValue/dtos/create-attribute-Value.dto';

export class UpdateAttributeValueDto extends PartialType(
  CreateAttributeValueDto,
) {}
