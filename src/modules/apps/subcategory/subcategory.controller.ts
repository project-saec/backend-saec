import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { SubCategoryService } from './subcategory.service';
import { CreateSubCategoryDto } from './dtos/create-subcategory.dto';
import { UpdateSubCategoryDto } from './dtos/update-subcategory.dto';
import { Roles } from 'src/decorators/role.decorator';
import { UserRole } from 'src/modules/core/user/role.enum';
import { JwtAuthGuard } from 'src/modules/apps/auth/gaurds/auth.gaurd';
import { RolesGuard } from 'src/modules/apps/auth/gaurds/roles.gaurd';

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

  @Roles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
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

  @Roles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
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

  @Roles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':id')
  deleteSubCategory(@Param('id', ParseIntPipe) id: number) {
    return this.subCategoryService.deleteSubCategory(id);
  }
}
