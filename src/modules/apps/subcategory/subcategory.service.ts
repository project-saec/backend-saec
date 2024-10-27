import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { CategoryService } from 'src/modules/apps/category/category.service';
import { PrismaService } from 'src/modules/share/prisma/prisma.service';

@Injectable()
export class SubCategoryService {
  constructor(
    private prisma: PrismaService,
    private categoryService: CategoryService,
  ) {}

  async getAllSubCategories() {
    return this.prisma.subCategory.findMany({
      include: {
        category: true,
        products: true,
        allowedAttributes: true,
      },
    });
  }

  async getSubCategoryById(id: number) {
    const subCategory = await this.prisma.subCategory.findUnique({
      where: { id },
      include: {
        category: true,
        products: true,
        allowedAttributes: true,
      },
    });
    if (!subCategory)
      throw new NotFoundException(`SubCategory with ID ${id} not found`);
    return subCategory;
  }

  async createSubCategory(data: Prisma.SubCategoryCreateInput) {
    const categoryExists = await this.categoryService.getCategoryById(
      (data.category as { connect: { id: number } }).connect.id,
    );

    if (!categoryExists) {
      throw new BadRequestException(
        `Category with ID ${(data.category as { connect: { id: number } }).connect.id} does not exist`,
      );
    }
    const existingSubCategory = await this.prisma.subCategory.findUnique({
      where: { title: data.title },
    });
    if (existingSubCategory) {
      throw new ConflictException(
        `SubCategory with title "${data.title}" already exists`,
      );
    }
    try {
      return await this.prisma.subCategory.create({
        data,
        include: {
          category: true,
          allowedAttributes: true,
        },
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException(
            `SubCategory with title "${data.title}" already exists`,
          );
        }
        if (error.code === 'P2003') {
          throw new BadRequestException(
            'Invalid category ID or attribute IDs provided',
          );
        }
      }
      throw error;
    }
  }

  async updateSubCategory(id: number, data: Prisma.SubCategoryUpdateInput) {
    const subCategoryExists = await this.prisma.subCategory.findUnique({
      where: { id },
    });
    if (!subCategoryExists)
      throw new NotFoundException(`SubCategory with ID ${id} not found`);

    if (data.category && (data.category as any).connect?.id) {
      const categoryExists = await this.prisma.category.findUnique({
        where: { id: (data.category as any).connect.id },
      });

      if (!categoryExists) {
        throw new BadRequestException(
          `Category with ID ${(data.category as any).connect.id} does not exist`,
        );
      }
    }

    if (data.title) {
      const existingSubCategory = await this.prisma.subCategory.findFirst({
        where: {
          title: data.title as string,
          id: { not: id },
        },
      });

      if (existingSubCategory) {
        throw new ConflictException(
          `SubCategory with title "${data.title}" already exists`,
        );
      }
    }

    try {
      return await this.prisma.subCategory.update({
        where: { id },
        data,
        include: {
          category: true,
          allowedAttributes: true,
        },
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException(
            `SubCategory with title "${data.title}" already exists`,
          );
        }
        if (error.code === 'P2003') {
          throw new BadRequestException(
            'Invalid category ID or attribute IDs provided',
          );
        }
      }
      throw error;
    }
  }

  async deleteSubCategory(id: number) {
    const subCategoryExists = await this.prisma.subCategory.findUnique({
      where: { id },
    });
    if (!subCategoryExists)
      throw new NotFoundException(`SubCategory with ID ${id} not found`);

    const deletedSubCategory = await this.prisma.subCategory.delete({
      where: { id },
    });

    return `subcategory with id ${deletedSubCategory.id} deleted`;
  }
}
