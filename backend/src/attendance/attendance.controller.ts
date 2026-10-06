import {
  Body,
  Controller,
  Get,
  Param,
  Post,
} from "@nestjs/common";

import { AttendanceService } from "./attendance.service";
import { CreateAttendanceDto } from "./dto/create-attendance.dto";

@Controller("api/v1/attendance")
export class AttendanceController {
  constructor(
    private readonly attendanceService: AttendanceService,
  ) {}

  @Get()
  findAll() {
    return this.attendanceService.findAll();
  }

  @Get("statistics")
  getStatistics() {
    return this.attendanceService.getStatistics();
  }

  @Get("chart")
  getChart() {
    return this.attendanceService.getMonthlyStatistics();
  }

  @Get("member/:id")
  findByMember(@Param("id") id: string) {
    return this.attendanceService.findByMember(id);
  }

  @Get("event/:id")
  findByEvent(@Param("id") id: string) {
    return this.attendanceService.findByEvent(id);
  }

  @Get("user/:id")
  findByUser(@Param("id") id: string) {
    return this.attendanceService.findByUser(id);
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.attendanceService.findOne(id);
  }

  @Post()
  create(@Body() data: CreateAttendanceDto) {
    return this.attendanceService.create(data);
  }
}