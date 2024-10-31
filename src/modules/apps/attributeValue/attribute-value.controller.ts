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
  UseGuards,
} from '@nestjs/common';
import { AttributeValueService } from './attribute-value.service';
import { UpdateAttributeValueDto } from 'src/modules/apps/attributeValue/dtos/update-attrubute-value.dto';
import { CreateAttributeValueDto } from 'src/modules/apps/attributeValue/dtos/create-attribute-Value.dto';
import { Roles } from 'src/decorators/role.decorator';
import { JwtAuthGuard } from 'src/modules/apps/auth/gaurds/auth.gaurd';
import { UserRole } from 'src/modules/core/user/role.enum';
import { RolesGuard } from 'src/modules/apps/auth/gaurds/roles.gaurd';

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

  @Roles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
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

  @Roles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
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

  @Roles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete('/:id')
  async deleteAttributeValue(@Param('id', ParseIntPipe) id: number) {
    return this.attributeValueService.deleteAttributeValue(id);
  }
}
