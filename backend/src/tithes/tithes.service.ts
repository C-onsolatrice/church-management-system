import { Injectable } from "@nestjs/common";

import { PrismaService } from "../database/prisma.service";

import { CreateTitheDto } from "./dto/create-tithe.dto";

@Injectable()
export class TithesService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  findAll() {
    return this.prisma.tithe.findMany({
      include: {
        member: true,
        user: true,
        branch: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  create(data: CreateTitheDto) {
    return this.prisma.tithe.create({
      data: {
        amount: Number(data.amount),
        paymentMethod: data.paymentMethod,
        description: data.description,
        note: data.note,
        userId: data.userId,
        memberId: data.memberId,
        branchId: data.branchId,
      },
      include: {
        member: true,
        user: true,
        branch: true,
      },
    });
  }

  getTotal() {
    return this.prisma.tithe.aggregate({
      _sum: {
        amount: true,
      },
    });
  }

  findByMember(memberId: string) {
    return this.prisma.tithe.findMany({
      where: { memberId },
      include: {
        member: true,
        branch: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }
}