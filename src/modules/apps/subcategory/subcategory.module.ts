import { Module } from '@nestjs/common';
import { SubCategoryController } from './subcategory.controller';
import { SubCategoryService } from './subcategory.service';
import { CategoryModule } from 'src/modules/apps/category/category.module';

@Module({
  imports: [CategoryModule],
  controllers: [SubCategoryController],
  providers: [SubCategoryService],
  exports: [SubCategoryService],
})
export class SubCategoryModule {}
