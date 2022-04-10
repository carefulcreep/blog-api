import {
  Controller,
  Delete,
  Get,
  Param,
  Put,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { AdminService } from './admin.service';
import { AdminGuard } from '../guards/admin.guard';
import { JwtAccessValidateGuard } from '../guards/jwt-access-validate.guard';

@ApiBearerAuth()
@UseGuards(JwtAccessValidateGuard, AdminGuard)
@ApiTags('Admin')
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Delete('/:id')
  deletePost(@Param('id') id: string, @Request() req): Promise<any> {
    return this.adminService.deletePost(id, req.user.id);
  }
}
