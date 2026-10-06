import {
    Controller,
    Get,
  } from "@nestjs/common";
  
  import { DashboardService } from "./dashboard.service";
  
  @Controller("api/v1/dashboard")
  export class DashboardController {
    constructor(
      private readonly dashboardService: DashboardService,
    ) {}
  
    @Get("stats")
    getStats() {
      return this.dashboardService.getStatistics();
    }
  
    @Get("tithes/monthly")
    monthlyTithes() {
      return this.dashboardService.monthlyTithes();
    }
  
    @Get("events/upcoming")
    upcomingEvents() {
      return this.dashboardService.upcomingEvents();
    }
  }