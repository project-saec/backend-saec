import { Controller, Get, Logger, Param, ParseIntPipe } from '@nestjs/common';
import { CategoryService } from 'src/modules/apps/category/category.service';

@Controller('category')
export class CategoryController {
  private logger = new Logger(CategoryController.name);
  constructor(private readonly categoryService: CategoryService) {}

  @Get('/')
  async getAllCategories() {
    return this.categoryService.getAllCategories();
  }

  @Get('/:id')
  async getCategoryById(@Param('id', ParseIntPipe) id: string) {
    return this.categoryService.getCategoryById(+id);
  }
}
