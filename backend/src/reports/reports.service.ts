import { Injectable } from "@nestjs/common";
import { PrismaService } from "../database/prisma.service";

import { Response } from "express";

import PDFDocument from "pdfkit";
import * as ExcelJS from "exceljs";

@Injectable()
export class ReportsService {
  constructor(private readonly prisma: PrismaService) {}

  async getDashboardData() {
    const members = await this.prisma.member.count();

    const events = await this.prisma.event.count();

    const tithes = await this.prisma.tithe.aggregate({
      _sum: {
        amount: true,
      },
    });

    const attendance = await this.prisma.attendance.count();

    const present = await this.prisma.attendance.count({
      where: {
        present: true,
      },
    });

    const attendanceRate =
      attendance > 0
        ? Math.round((present / attendance) * 100)
        : 0;

    return {
      members,
      events,
      totalTithes: tithes._sum.amount ?? 0,
      attendanceRate,
    };
  }

  async exportExcel(
    res: Response,
    type: string,
  ) {
    const workbook = new ExcelJS.Workbook();

    if (type === "members") {
      const sheet =
        workbook.addWorksheet("Members");

      const members =
        await this.prisma.member.findMany({
          orderBy: {
            createdAt: "desc",
          },
        });

      sheet.columns = [
        {
          header: "First Name",
          key: "firstName",
          width: 20,
        },
        {
          header: "Last Name",
          key: "lastName",
          width: 20,
        },
        {
          header: "Email",
          key: "email",
          width: 30,
        },
        {
          header: "Phone",
          key: "phone",
          width: 20,
        },
        {
          header: "Status",
          key: "status",
          width: 15,
        },
      ];

      for (const member of members) {
        sheet.addRow({
          firstName: member.firstName,
          lastName: member.lastName,
          email: member.email ?? "",
          phone: member.phoneNumber ?? "",
          status: member.status,
        });
      }
    }

    if (type === "tithes") {
      const sheet =
        workbook.addWorksheet("Tithes");

      const tithes =
        await this.prisma.tithe.findMany({
          include: {
            member: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        });

      sheet.columns = [
        {
          header: "Member",
          key: "member",
          width: 30,
        },
        {
          header: "Amount",
          key: "amount",
          width: 15,
        },
        {
          header: "Payment Method",
          key: "paymentMethod",
          width: 20,
        },
        {
          header: "Date",
          key: "date",
          width: 20,
        },
      ];

      for (const tithe of tithes) {
        sheet.addRow({
          member: tithe.member
            ? `${tithe.member.firstName} ${tithe.member.lastName}`
            : "N/A",
          amount: tithe.amount,
          paymentMethod:
            tithe.paymentMethod,
          date: tithe.createdAt,
        });
      }
    }

    if (type === "attendance") {
      const sheet =
        workbook.addWorksheet("Attendance");

      const attendance =
        await this.prisma.attendance.findMany({
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

      sheet.columns = [
        {
          header: "User",
          key: "user",
          width: 30,
        },
        {
          header: "Event",
          key: "event",
          width: 30,
        },
        {
          header: "Branch",
          key: "branch",
          width: 25,
        },
        {
          header: "Present",
          key: "present",
          width: 15,
        },
        {
          header: "Date",
          key: "date",
          width: 20,
        },
      ];

      for (const item of attendance) {
        sheet.addRow({
          user:
            // item.user.name ??
            `${item.member.firstName ?? ""} ${
              item.member.lastName ?? ""
            }`.trim(),

          event: item.event.title,

          branch: item.branch.name,

          present: item.present
            ? "Present"
            : "Absent",

          date: item.createdAt,
        });
      }
    }

    const buffer =
      await workbook.xlsx.writeBuffer();

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    );

    res.setHeader(
      "Content-Disposition",
      `attachment; filename=${type}-report.xlsx`,
    );

    return res.send(buffer);
  }

  async exportPDF(
    res: Response,
    type: string,
  ) {
    const doc = new PDFDocument({
      margin: 40,
    });

    res.setHeader(
      "Content-Type",
      "application/pdf",
    );

    res.setHeader(
      "Content-Disposition",
      `attachment; filename=${type}-report.pdf`,
    );

    doc.pipe(res);

    doc
      .fontSize(20)
      .text(
        `${type.toUpperCase()} REPORT`,
        {
          align: "center",
        },
      );

    doc.moveDown();

    if (type === "members") {
      const members =
        await this.prisma.member.findMany({
          orderBy: {
            createdAt: "desc",
          },
        });

      for (const member of members) {
        doc
          .fontSize(11)
          .text(
            `${member.firstName} ${member.lastName} | ${
              member.email ?? ""
            } | ${
              member.phoneNumber ?? ""
            }`,
          );

        doc.moveDown(0.5);
      }
    }

    if (type === "tithes") {
      const tithes =
        await this.prisma.tithe.findMany({
          include: {
            member: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        });

      for (const tithe of tithes) {
        const memberName =
          tithe.member
            ? `${tithe.member.firstName} ${tithe.member.lastName}`
            : "N/A";

        doc
          .fontSize(11)
          .text(
            `${memberName} | ${tithe.amount} | ${
              tithe.paymentMethod
            } | ${tithe.createdAt.toLocaleDateString()}`,
          );

        doc.moveDown(0.5);
      }
    }

    if (type === "attendance") {
      const attendance =
        await this.prisma.attendance.findMany({
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

      for (const item of attendance) {
        const userName =
          // item.member.name ??
          `${item.member.firstName ?? ""} ${
            item.member.lastName ?? ""
          }`.trim();

        doc
          .fontSize(11)
          .text(
            `${userName} | ${item.event.title} | ${
              item.branch.name
            } | ${
              item.present
                ? "Present"
                : "Absent"
            } | ${item.createdAt.toLocaleDateString()}`,
          );

        doc.moveDown(0.5);
      }
    }

    doc.end();
  }
}