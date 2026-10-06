import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateAssetDto } from './dto/create-asset.dto';

@Injectable()
export class AssetsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateAssetDto) {
    return this.prisma.asset.create({
      data: {
        name: dto.name,
        category: dto.category,
        serialNumber: dto.serialNumber,
        purchaseDate: new Date(dto.purchaseDate),
        purchaseCost: dto.purchaseCost,
        salvageValue: dto.salvageValue ?? 0,
        usefulLifeYears: dto.usefulLifeYears,
        state: dto.state ?? 'ACTIVE',
        location: dto.location,
        branchId: dto.branchId || 'default-branch-id',
      },
    });
  }

  async findAll() {
    return this.prisma.asset.findMany({
      include: {
        _count: {
          select: { maintenanceLogs: true },
        },
      },
      orderBy: { purchaseDate: 'desc' },
    });
  }

  async calculateStraightLineDepreciation(id: string) {
    const asset = await this.prisma.asset.findUnique({ where: { id } });
    if (!asset) throw new NotFoundException('Asset not found');

    const cost = Number(asset.purchaseCost);
    const salvage = Number(asset.salvageValue);
    const life = asset.usefulLifeYears || 1;

    const annualDepreciation = (cost - salvage) / life;
    
    const schedule: any[] = [];
    let currentBookValue = cost;

    for (let year = 1; year <= life; year++) {
      currentBookValue -= annualDepreciation;
      schedule.push({
        year,
        annualDepreciation: annualDepreciation.toFixed(2),
        bookValue: Math.max(currentBookValue, salvage).toFixed(2),
      });
    }

    return {
      assetId: asset.id,
      name: asset.name,
      purchaseCost: cost,
      salvageValue: salvage,
      usefulLifeYears: life,
      schedule,
    };
  }

  async addMaintenanceLog(assetId: string, performedBy: string, cost: number, description: string) {
    const assetExists = await this.prisma.asset.findUnique({ where: { id: assetId } });
    if (!assetExists) throw new NotFoundException('Asset record not found');

    return this.prisma.maintenanceLog.create({
      data: {
        assetId,
        performedDate: new Date(),
        cost,
        description,
        performedBy,
      },
    });
  }
}