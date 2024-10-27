import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { PrismaService } from 'src/modules/share/prisma/prisma.service';

@Injectable()
export class AttributeTypeService {
  constructor(private prisma: PrismaService) {}

  async getAllAttributeTypes() {
    return this.prisma.attributeType.findMany({
      include: {
        values: true,
        Category: true,
        SubCategory: true,
      },
    });
  }

  async getAttributeTypeById(id: number) {
    const attributeType = await this.prisma.attributeType.findUnique({
      where: { id },
      include: {
        values: true,
      },
    });
    if (!attributeType)
      throw new NotFoundException(`AttributeType with ID ${id} not found`);
    return attributeType;
  }

  async createAttributeType(data: Prisma.AttributeTypeCreateInput) {
    try {
      return await this.prisma.attributeType.create({
        data,
        include: {
          values: true,
        },
      });
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException(
          `AttributeType with name "${data.name}" already exists`,
        );
      }
      throw error;
    }
  }

  async updateAttributeType(id: number, data: Prisma.AttributeTypeUpdateInput) {
    const attributeTypeExists = await this.prisma.attributeType.findUnique({
      where: { id },
    });
    if (!attributeTypeExists)
      throw new NotFoundException(`AttributeType with ID ${id} not found`);

    try {
      return await this.prisma.attributeType.update({
        where: { id },
        data,
        include: {
          values: true,
        },
      });
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException(
          `AttributeType with name "${data.name}" already exists`,
        );
      }
      throw error;
    }
  }

  async deleteAttributeType(id: number) {
    const attributeTypeExists = await this.prisma.attributeType.findUnique({
      where: { id },
    });
    if (!attributeTypeExists)
      throw new NotFoundException(`AttributeType with ID ${id} not found`);

    return this.prisma.attributeType.delete({
      where: { id },
    });
  }
}
