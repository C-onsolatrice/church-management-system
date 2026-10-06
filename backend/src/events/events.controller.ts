import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from "@nestjs/common";

import { EventsService } from "./events.service";
import { CreateEventDto } from "./dto/create-event.dto";

@Controller("events")
export class EventsController {
  constructor(
    private readonly eventsService: EventsService,
  ) {}

  @Get()
  findAll() {
    return this.eventsService.findAll();
  }

  @Get(":id")
  findOne(
    @Param("id") id: string,
  ) {
    return this.eventsService.findOne(id);
  }

  @Post()
  create(
    @Body() data: CreateEventDto,
  ) {
    return this.eventsService.create(data);
  }

  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body()
    data: Partial<CreateEventDto>,
  ) {
    return this.eventsService.update(
      id,
      data,
    );
  }

  @Delete(":id")
  remove(
    @Param("id") id: string,
  ) {
    return this.eventsService.remove(id);
  }
}