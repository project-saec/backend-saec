import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { AttributeTypeModule } from 'src/modules/apps/attributeType/attribute-type.module';

@Module({
  imports: [AttributeTypeModule],
  providers: [CategoryService],
  controllers: [CategoryController],
  exports: [CategoryService],
})
export class CategoryModule {}
