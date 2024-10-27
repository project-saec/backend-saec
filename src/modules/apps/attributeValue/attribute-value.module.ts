import { Module } from '@nestjs/common';
import { AttributeValueService } from './attribute-value.service';
import { AttributeValueController } from 'src/modules/apps/attributeValue/attribute-value.controller';

@Module({
  providers: [AttributeValueService],
  controllers: [AttributeValueController],
  exports: [AttributeValueService],
})
export class AttributeValueModule {}
