import { Injectable } from "@nestjs/common";

import { PrismaService } from "../database/prisma.service";

@Injectable()
export class DashboardService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async getStatistics() {
    const totalMembers =
      await this.prisma.member.count();

    const totalEvents =
      await this.prisma.event.count();

    const totalTithes =
      await this.prisma.tithe.aggregate({
        _sum: {
          amount: true,
        },
      });

    const totalAttendance =
      await this.prisma.attendance.count();

    const presentAttendance =
      await this.prisma.attendance.count({
        where: {
          present: true,
        },
      });

    return {
      totalMembers,
      totalEvents,
      totalTithes:
        totalTithes._sum.amount ?? 0,
      attendanceRate:
        totalAttendance > 0
          ? Math.round(
              (presentAttendance /
                totalAttendance) *
                100,
            )
          : 0,
    };
  }

  async monthlyTithes() {
    return this.prisma.$queryRaw`
      SELECT
        DATE_TRUNC(
          'month',
          "createdAt"
        ) AS month,
        SUM(amount) AS total
      FROM "Tithe"
      GROUP BY month
      ORDER BY month ASC
    `;
  }

  async upcomingEvents() {
    return this.prisma.event.findMany({
      where: {
        date: {
          gte: new Date(),
        },
      },
      orderBy: {
        date: "asc",
      },
      take: 5,
    });
  }
}