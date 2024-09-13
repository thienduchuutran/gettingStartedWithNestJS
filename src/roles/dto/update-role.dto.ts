import { PartialType } from '@nestjs/mapped-types';
import { CreateRoleDto } from './create-Role.dto';

export class UpdateRoleDto extends PartialType(CreateRoleDto) {

}