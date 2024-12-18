import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { AttributeTypeService } from 'src/modules/apps/attributeType/attribute-type.service';
import { PrismaService } from 'src/modules/share/prisma/prisma.service';

@Injectable()
export class CategoryService {
  constructor(
    private prisma: PrismaService,
    private attributeTypeService: AttributeTypeService,
  ) {}

  async getAllCategories() {
    return this.prisma.category.findMany({
      include: {
        SubCategories: true,
        allowedAttributes: true,
      },
    });
  }

  async getCategoryById(id: number) {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: {
        SubCategories: true,
        products: true,
        allowedAttributes: true,
      },
    });
    if (!category)
      throw new NotFoundException(`Category with ID ${id} not found`);
    return category;
  }

  async createCategory(data: Prisma.CategoryCreateInput) {
    const existingCategory = await this.prisma.category.findUnique({
      where: { title: data.title },
    });

    if (existingCategory) {
      throw new ConflictException(
        `Category with title "${data.title}" already exists`,
      );
    }
    try {
      return await this.prisma.category.create({
        data,
        include: {
          SubCategories: true,
          allowedAttributes: true,
        },
      });
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException(
          `Category with title "${data.title}" already exists`,
        );
      }
      throw error;
    }
  }

  async updateCategory(id: number, data: Prisma.CategoryUpdateInput) {
    const categoryExists = await this.prisma.category.findUnique({
      where: { id },
    });
    if (!categoryExists)
      throw new NotFoundException(`Category with ID ${id} not found`);

    if (data.title) {
      const existingCategory = await this.prisma.category.findFirst({
        where: {
          title: data.title as string,
          id: { not: id },
        },
      });

      if (existingCategory) {
        throw new ConflictException(
          `Category with title "${data.title}" already exists`,
        );
      }
    }

    const validAttributes = await this.validateAttributeTypes(
      Array.isArray(data.allowedAttributes?.connect)
        ? data.allowedAttributes.connect
            .map((attr) => attr.id)
            .filter((id): id is number => id !== undefined)
        : [],
    );

    try {
      return await this.prisma.category.update({
        where: { id },
        data: {
          ...data,
          allowedAttributes: {
            set: validAttributes.map((attr) => ({ id: attr.id })),
          },
        },
        include: {
          SubCategories: true,
          allowedAttributes: true,
        },
      });
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException(
          `Category with title "${data.title}" already exists`,
        );
      }
      throw error;
    }
  }

  async deleteCategory(id: number) {
    const categoryExists = await this.prisma.category.findUnique({
      where: { id },
    });
    if (!categoryExists)
      throw new NotFoundException(`Category with ID ${id} not found`);

    const deletedCategory = await this.prisma.category.delete({
      where: { id },
    });

    return `category with id ${deletedCategory.id} deleted`;
  }

  private async validateAttributeTypes(attributeTypeIds: number[]) {
    if (!attributeTypeIds || attributeTypeIds.length === 0) {
      throw new BadRequestException('No attribute types provided.');
    }

    const attributes = await Promise.all(
      attributeTypeIds.map(async (id) => {
        const attribute =
          await this.attributeTypeService.getAttributeTypeById(id);
        if (!attribute) {
          throw new NotFoundException(`AttributeType with ID ${id} not found.`);
        }
        return attribute;
      }),
    );

    return attributes;
  }
}
