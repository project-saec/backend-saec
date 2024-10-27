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
import { AttributeValueService } from './attribute-value.service';
import { UpdateAttributeValueDto } from 'src/modules/apps/attributeValue/dtos/update-attrubute-value.dto';
import { CreateAttributeValueDto } from 'src/modules/apps/attributeValue/dtos/create-attribute-Value.dto';

@Controller('attribute-value')
export class AttributeValueController {
  private readonly logger = new Logger(AttributeValueController.name);
  constructor(private readonly attributeValueService: AttributeValueService) {}

  @Get()
  async getAllAttributeValues() {
    return this.attributeValueService.getAllAttributeValues();
  }

  @Get('/:id')
  async getAttributeValueById(@Param('id', ParseIntPipe) id: number) {
    return this.attributeValueService.getAttributeValueById(id);
  }

  @Post()
  async createAttributeValue(
    @Body() createAttributeValueDto: CreateAttributeValueDto,
  ) {
    return this.attributeValueService.createAttributeValue({
      value: createAttributeValueDto.value,
      attributeType: {
        connect: { id: createAttributeValueDto.attributeTypeId },
      },
    });
  }

  @Patch('/:id')
  async updateAttributeValue(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateAttributeValueDto: UpdateAttributeValueDto,
  ) {
    return this.attributeValueService.updateAttributeValue(id, {
      value: updateAttributeValueDto.value,
      attributeType: updateAttributeValueDto.attributeTypeId
        ? { connect: { id: updateAttributeValueDto.attributeTypeId } }
        : undefined,
    });
  }

  @Delete('/:id')
  async deleteAttributeValue(@Param('id', ParseIntPipe) id: number) {
    return this.attributeValueService.deleteAttributeValue(id);
  }
}
