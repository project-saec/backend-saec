import { PartialType } from '@nestjs/mapped-types';
import { CreateAttributeTypeDto } from 'src/modules/apps/attributeType/dtos/create-attribute-type.dto';

export class UpdateAttributeTypeDto extends PartialType(
  CreateAttributeTypeDto,
) {}
