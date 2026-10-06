import {
  Body,
  Controller,
  Get,
  Param,
  Post,
} from "@nestjs/common";

import { TithesService } from "./tithes.service";

import { CreateTitheDto } from "./dto/create-tithe.dto";

@Controller("api/v1/tithes")
export class TithesController {
  constructor(
    private readonly tithesService: TithesService,
  ) {}

  @Get()
  findAll() {
    return this.tithesService.findAll();
  }

  @Post()
  create(@Body() data: CreateTitheDto) {
    return this.tithesService.create(
      data,
    );
  }

  @Get("total")
  total() {
    return this.tithesService.getTotal();
  }

  @Get("member/:id")
  findByMember(
    @Param("id") id: string,
  ) {
    return this.tithesService.findByMember(
      id,
    );
  }
}