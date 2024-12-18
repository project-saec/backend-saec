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
import { AttributeTypeService } from './attribute-type.service';
import { CreateAttributeTypeDto } from 'src/modules/apps/attributeType/dtos/create-attribute-type.dto';
import { UpdateAttributeTypeDto } from 'src/modules/apps/attributeType/dtos/update-attrubute-type.dto';
import { Roles } from 'src/decorators/role.decorator';
import { JwtAuthGuard } from 'src/modules/apps/auth/gaurds/auth.gaurd';
import { UserRole } from 'src/modules/core/user/role.enum';
import { RolesGuard } from 'src/modules/apps/auth/gaurds/roles.gaurd';

@Controller('attribute-type')
export class AttributeTypeController {
  private readonly logger = new Logger(AttributeTypeController.name);
  constructor(private readonly attributeTypeService: AttributeTypeService) {}

  @Get()
  async getAllAttributeTypes() {
    return this.attributeTypeService.getAllAttributeTypes();
  }

  @Get('/:id')
  async getAttributeTypeById(@Param('id', ParseIntPipe) id: number) {
    return this.attributeTypeService.getAttributeTypeById(id);
  }

  @Roles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  async createAttributeType(
    @Body() createAttributeTypeDto: CreateAttributeTypeDto,
  ) {
    return this.attributeTypeService.createAttributeType({
      name: createAttributeTypeDto.name,
    });
  }

  @Roles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch('/:id')
  async updateAttributeType(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateAttributeTypeDto: UpdateAttributeTypeDto,
  ) {
    return this.attributeTypeService.updateAttributeType(id, {
      name: updateAttributeTypeDto.name,
    });
  }

  @Roles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete('/:id')
  async deleteAttributeType(@Param('id', ParseIntPipe) id: number) {
    return this.attributeTypeService.deleteAttributeType(id);
  }
}
