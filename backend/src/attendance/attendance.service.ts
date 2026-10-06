import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";

import { PrismaService } from "../database/prisma.service";
import { CreateAttendanceDto } from "./dto/create-attendance.dto";

@Injectable()
export class AttendanceService {
  constructor(private readonly prisma: PrismaService) {}

  // GET ALL ATTENDANCE
  async findAll() {
    return this.prisma.attendance.findMany({
      include: {
        member: true,
        event: true,
        branch: true,
        User: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  // GET ONE ATTENDANCE
  async findOne(id: string) {
    const attendance = await this.prisma.attendance.findUnique({
      where: { id },
      include: {
        member: true,
        event: true,
        branch: true,
        User: true,
      },
    });

    if (!attendance) {
      throw new NotFoundException("Attendance record not found");
    }

    return attendance;
  }

  // CREATE ATTENDANCE
  async create(data: CreateAttendanceDto) {
    const member = await this.prisma.member.findUnique({
      where: {
        id: data.memberId,
      },
    });

    if (!member) {
      throw new NotFoundException("Member not found");
    }

    const event = await this.prisma.event.findUnique({
      where: {
        id: data.eventId,
      },
    });

    if (!event) {
      throw new NotFoundException("Event not found");
    }

    const branch = await this.prisma.branch.findUnique({
      where: {
        id: data.branchId,
      },
    });

    if (!branch) {
      throw new NotFoundException("Branch not found");
    }

    // Prevent duplicate attendance for same member + event
    const existing = await this.prisma.attendance.findFirst({
      where: {
        memberId: data.memberId,
        eventId: data.eventId,
      },
    });

    if (existing) {
      throw new BadRequestException(
        "This member already has attendance for this event.",
      );
    }

    const status =
      data.status ??
      (data.present === false ? "ABSENT" : "PRESENT");

    const present =
      data.present ??
      (status === "PRESENT" || status === "LATE");

    return this.prisma.attendance.create({
      data: {
        memberId: data.memberId,
        eventId: data.eventId,
        branchId: data.branchId,
        present,
        status,
        notes: data.notes,
        userId: data.userId,
      },
      include: {
        member: true,
        event: true,
        branch: true,
        User: true,
      },
    });
  }

  // GET ATTENDANCE BY MEMBER
  async findByMember(memberId: string) {
    return this.prisma.attendance.findMany({
      where: {
        memberId,
      },
      include: {
        member: true,
        event: true,
        branch: true,
        User: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  // GET ATTENDANCE BY EVENT
  async findByEvent(eventId: string) {
    return this.prisma.attendance.findMany({
      where: {
        eventId,
      },
      include: {
        member: true,
        event: true,
        branch: true,
        User: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  // GET ATTENDANCE BY USER
  async findByUser(userId: string) {
    return this.prisma.attendance.findMany({
      where: {
        userId,
      },
      include: {
        member: true,
        event: true,
        branch: true,
        User: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  // DASHBOARD STATISTICS
  async getStatistics() {
    const [
      total,
      present,
      absent,
      late,
      excused,
    ] = await Promise.all([
      this.prisma.attendance.count(),

      this.prisma.attendance.count({
        where: {
          status: "PRESENT",
        },
      }),

      this.prisma.attendance.count({
        where: {
          status: "ABSENT",
        },
      }),

      this.prisma.attendance.count({
        where: {
          status: "LATE",
        },
      }),

      this.prisma.attendance.count({
        where: {
          status: "EXCUSED",
        },
      }),
    ]);

    const attendanceRate =
      total > 0
        ? Number(((present + late) / total * 100).toFixed(2))
        : 0;

    return {
      total,
      present,
      absent,
      late,
      excused,
      attendanceRate,
    };
  }

  // MONTHLY CHART
  async getMonthlyStatistics() {
    const records = await this.prisma.attendance.findMany({
      select: {
        createdAt: true,
        status: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    const monthly: Record<
      string,
      {
        present: number;
        absent: number;
        late: number;
        excused: number;
      }
    > = {};

    for (const record of records) {
      const month = record.createdAt.toISOString().slice(0, 7);

      if (!monthly[month]) {
        monthly[month] = {
          present: 0,
          absent: 0,
          late: 0,
          excused: 0,
        };
      }

      switch (record.status) {
        case "ABSENT":
          monthly[month].absent++;
          break;

        case "LATE":
          monthly[month].late++;
          break;

        case "EXCUSED":
          monthly[month].excused++;
          break;

        default:
          monthly[month].present++;
          break;
      }
    }

    return Object.entries(monthly).map(
      ([month, values]) => ({
        month,
        ...values,
      }),
    );
  }
}