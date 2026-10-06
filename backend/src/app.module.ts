// import { Module } from '@nestjs/common';
// import { AppController } from './app.controller';
// import { AppService } from './app.service';
// import { DatabaseModule } from './database/database.module';
// import { AuthModule } from './auth/auth.module';
// import { UsersModule } from './users/users.module';
// import { EventsModule } from './events/events.module';
// import { AssetsModule } from './assets/assets.module';
// import { NotificationsModule } from './notifications/notifications.module';
// import { ReportsModule } from './reports/reports.module';
// import { DashboardModule } from './dashboard/dashboard.module';
// import { AttendanceModule } from './attendance/attendance.module';
// import { TithesModule } from './tithes/tithes.module';
// import { MembersModule } from "./members/members.module";
// import { BranchesModule } from "./branches/branches.module";

// @Module({
//   imports: [
//     MembersModule,
//     DatabaseModule,
//     AuthModule,
//     AttendanceModule,
//     UsersModule,
//     EventsModule,
//     BranchesModule,
//     AssetsModule,
//     NotificationsModule,
//     ReportsModule,
//     DashboardModule,
//     TithesModule,
//   ],
//   controllers: [AppController],
//   providers: [AppService],
// })
// export class AppModule {}
import { Module } from "@nestjs/common";

import { MembersModule } from "./members/members.module";
import { AttendanceModule } from "./attendance/attendance.module";
import { TithesModule } from "./tithes/tithes.module";
import { EventsModule } from "./events/events.module";
import { BranchesModule } from "./branches/branches.module";
import { DashboardModule } from "./dashboard/dashboard.module";
import { ReportsModule } from "./reports/reports.module";
import { NotificationsModule } from "./notifications/notifications.module";

@Module({
  imports: [
    MembersModule,
    AttendanceModule,
    TithesModule,
    EventsModule,
    BranchesModule,
    DashboardModule,
    ReportsModule,
    NotificationsModule,
  ],
})
export class AppModule {}