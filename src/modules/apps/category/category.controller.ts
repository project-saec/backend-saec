import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { CategoryService } from 'src/modules/apps/category/category.service';
import { CreateCategoryDto } from 'src/modules/apps/category/dtos/create-category.dto';
import { UpdateCategoryDto } from 'src/modules/apps/category/dtos/update-category.dto';

@Controller('category')
export class CategoryController {
  private logger = new Logger(CategoryController.name);
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  async getAllCategories() {
    return this.categoryService.getAllCategories();
  }

  @Get('/:id')
  async getCategoryById(@Param('id', ParseIntPipe) id: string) {
    return this.categoryService.getCategoryById(+id);
  }

  @Post()
  createCategory(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.createCategory({
      title: createCategoryDto.title,
      description: createCategoryDto.description,
      allowedAttributes: createCategoryDto.allowedAttributes
        ? {
            connect: createCategoryDto.allowedAttributes.map((id) => ({ id })),
          }
        : undefined,
    });
  }

  @Patch(':id')
  updateCategory(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoryService.updateCategory(id, {
      title: updateCategoryDto.title,
      description: updateCategoryDto.description,
      allowedAttributes: updateCategoryDto.allowedAttributes
        ? {
            connect: updateCategoryDto.allowedAttributes.map((id) => ({ id })),
          }
        : undefined,
    });
  }

  @Delete(':id')
  deleteCategory(@Param('id', ParseIntPipe) id: number) {
    return this.categoryService.deleteCategory(id);
  }
}
