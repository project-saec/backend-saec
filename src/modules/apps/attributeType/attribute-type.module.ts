import { Module } from '@nestjs/common';
import { AttributeTypeService } from './attribute-type.service';
import { AttributeTypeController } from 'src/modules/apps/attributeType/attribute-type.controller';

@Module({
  providers: [AttributeTypeService],
  controllers: [AttributeTypeController],
  exports: [AttributeTypeService],
})
export class AttributeTypeModule {}
