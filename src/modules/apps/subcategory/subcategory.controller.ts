import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  Patch,
} from '@nestjs/common';
import { SubCategoryService } from './subcategory.service';
import { CreateSubCategoryDto } from './dtos/create-subcategory.dto';
import { UpdateSubCategoryDto } from './dtos/update-subcategory.dto';

@Controller('subcategory')
export class SubCategoryController {
  constructor(private readonly subCategoryService: SubCategoryService) {}

  @Get()
  getAllSubCategories() {
    return this.subCategoryService.getAllSubCategories();
  }

  @Get(':id')
  getSubCategoryById(@Param('id', ParseIntPipe) id: number) {
    return this.subCategoryService.getSubCategoryById(id);
  }

  @Post()
  createSubCategory(@Body() createSubCategoryDto: CreateSubCategoryDto) {
    return this.subCategoryService.createSubCategory({
      title: createSubCategoryDto.title,
      description: createSubCategoryDto.description,
      category: {
        connect: { id: createSubCategoryDto.categoryId },
      },
      allowedAttributes: createSubCategoryDto.allowedAttributes
        ? {
            connect: createSubCategoryDto.allowedAttributes.map((id) => ({
              id,
            })),
          }
        : undefined,
    });
  }

  @Patch(':id')
  updateSubCategory(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateSubCategoryDto: UpdateSubCategoryDto,
  ) {
    return this.subCategoryService.updateSubCategory(id, {
      title: updateSubCategoryDto.title,
      description: updateSubCategoryDto.description,
      category: updateSubCategoryDto.categoryId
        ? {
            connect: { id: updateSubCategoryDto.categoryId },
          }
        : undefined,
      allowedAttributes: updateSubCategoryDto.allowedAttributes
        ? {
            set: updateSubCategoryDto.allowedAttributes.map((id) => ({ id })),
          }
        : undefined,
    });
  }

  @Delete(':id')
  deleteSubCategory(@Param('id', ParseIntPipe) id: number) {
    return this.subCategoryService.deleteSubCategory(id);
  }
}
