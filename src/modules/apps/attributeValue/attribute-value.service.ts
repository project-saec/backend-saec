import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { PrismaService } from 'src/modules/share/prisma/prisma.service';

@Injectable()
export class AttributeValueService {
  constructor(private prisma: PrismaService) {}

  async getAllAttributeValues() {
    return this.prisma.attributeValue.findMany({
      include: {
        attributeType: true,
      },
    });
  }

  async getAttributeValueById(id: number) {
    const attributeValue = await this.prisma.attributeValue.findUnique({
      where: { id },
      include: {
        attributeType: true,
      },
    });
    if (!attributeValue)
      throw new NotFoundException(`AttributeValue with ID ${id} not found`);
    return attributeValue;
  }

  async createAttributeValue(data: Prisma.AttributeValueCreateInput) {
    try {
      return await this.prisma.attributeValue.create({
        data,
        include: {
          attributeType: true,
        },
      });
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException(
          `AttributeValue "${data.value}" already exists for this AttributeType`,
        );
      }
      throw error;
    }
  }

  async updateAttributeValue(
    id: number,
    data: Prisma.AttributeValueUpdateInput,
  ) {
    const attributeValueExists = await this.prisma.attributeValue.findUnique({
      where: { id },
    });
    if (!attributeValueExists)
      throw new NotFoundException(`AttributeValue with ID ${id} not found`);

    try {
      return await this.prisma.attributeValue.update({
        where: { id },
        data,
        include: {
          attributeType: true,
        },
      });
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException(
          `AttributeValue "${data.value}" already exists for this AttributeType`,
        );
      }
      throw error;
    }
  }

  async deleteAttributeValue(id: number) {
    const attributeValueExists = await this.prisma.attributeValue.findUnique({
      where: { id },
    });
    if (!attributeValueExists)
      throw new NotFoundException(`AttributeValue with ID ${id} not found`);

    return this.prisma.attributeValue.delete({
      where: { id },
    });
  }
}
