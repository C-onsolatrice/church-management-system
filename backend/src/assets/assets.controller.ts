import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AssetsService } from './assets.service';
import { CreateAssetDto } from './dto/create-asset.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Asset Management')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('api/v1/assets')
export class AssetsController {
  constructor(private readonly assetsService: AssetsService) {}

  @Post()
  @ApiOperation({ summary: 'Log a capital asset into parish registry' })
  create(@Body() dto: CreateAssetDto) {
    return this.assetsService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'List all registered assets and maintenance status' })
  findAll() {
    return this.assetsService.findAll();
  }

  @Get(':id/depreciation-schedule')
  @ApiOperation({ summary: 'Compute straight-line depreciation schedule' })
  getDepreciation(@Param('id') id: string) {
    return this.assetsService.calculateStraightLineDepreciation(id);
  }

  @Post(':id/maintenance')
  @ApiOperation({ summary: 'Log real-time preventative/corrective maintenance' })
  logMaintenance(
    @Param('id') id: string,
    @Body('performedBy') performedBy: string,
    @Body('cost') cost: number,
    @Body('description') description: string,
  ) {
    return this.assetsService.addMaintenanceLog(id, performedBy, cost, description);
  }
}