import {
  Controller,
  Get,
  Res,
} from "@nestjs/common";

import type { Response } from "express";

import { ReportsService } from "./reports.service";

@Controller("reports")
export class ReportsController {
  constructor(
    private readonly reportsService: ReportsService,
  ) {}

  @Get("dashboard")
  async getDashboardData() {
    return this.reportsService.getDashboardData();
  }

  @Get("members/excel")
  async membersExcel(
    @Res() res: Response,
  ) {
    return this.reportsService.exportExcel(
      res,
      "members",
    );
  }

  @Get("members/pdf")
  async membersPDF(
    @Res() res: Response,
  ) {
    return this.reportsService.exportPDF(
      res,
      "members",
    );
  }

  @Get("tithes/excel")
  async tithesExcel(
    @Res() res: Response,
  ) {
    return this.reportsService.exportExcel(
      res,
      "tithes",
    );
  }

  @Get("tithes/pdf")
  async tithesPDF(
    @Res() res: Response,
  ) {
    return this.reportsService.exportPDF(
      res,
      "tithes",
    );
  }

  @Get("attendance/excel")
  async attendanceExcel(
    @Res() res: Response,
  ) {
    return this.reportsService.exportExcel(
      res,
      "attendance",
    );
  }

  @Get("attendance/pdf")
  async attendancePDF(
    @Res() res: Response,
  ) {
    return this.reportsService.exportPDF(
      res,
      "attendance",
    );
  }
}