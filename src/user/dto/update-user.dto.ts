import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsString, Length } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsString()
  @Length(3, 50)
  first_name: string;

  @IsString()
  @Length(3, 50)
  last_name: string;
}
