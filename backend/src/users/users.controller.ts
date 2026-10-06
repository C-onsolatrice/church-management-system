import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { QueryUserDto } from './dto/query-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { RequirePermissions } from '../auth/decorators/permissions.decorator';
import { Permission } from '../auth/rbac/role-permissions';
import { GetUser } from '../auth/decorators/get-user.decorator';




@ApiTags('User Management')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('api/v1/users')

export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @RequirePermissions(Permission.CREATE_USER)
  @ApiOperation({ summary: 'Create a new user within the church or branch' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'User created successfully.' })
  create(@Body() dto: CreateUserDto) {
    return this.usersService.create(dto);
  }

  @Get()
  @RequirePermissions(Permission.READ_USER)
  @ApiOperation({ summary: 'Paginate, filter, and query active church staff and members' })
  findAll(@Query() query: QueryUserDto) {
    return this.usersService.findAll(query);
  }
  
 

@Get('me')
@ApiOperation({ summary: 'Get current logged in user' })
getMe(@GetUser('id') userId: string) {
  return this.usersService.findOne(userId);
}

  @Get(':id')
  @RequirePermissions(Permission.READ_USER)
  @ApiOperation({ summary: 'Fetch user details by ID' })
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @RequirePermissions(Permission.UPDATE_USER)
  @ApiOperation({ summary: 'Modify user profile parameters' })
  update(@Param('id') id: string, @Body() updateData: Partial<CreateUserDto>) {
    return this.usersService.update(id, updateData);
  }

  @Delete(':id')
  @RequirePermissions(Permission.DELETE_USER)
  @ApiOperation({ summary: 'Soft-delete a user, revoking system access' })
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }

  @Post(':id/restore')
  @RequirePermissions(Permission.UPDATE_USER)
  @ApiOperation({ summary: 'Restore a soft-deleted user account' })
  restore(@Param('id') id: string) {
    return this.usersService.restore(id);
  }
  
  
}

