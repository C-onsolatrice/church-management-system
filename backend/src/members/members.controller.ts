import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from "@nestjs/common";

import { MembersService } from "./members.service";
import { CreateMemberDto } from "./dto/create-member.dto";

@Controller("members")
export class MembersController {
  constructor(
    private readonly membersService: MembersService,
  ) {}

  // GET /api/v1/members
  @Get()
  findAll() {
    return this.membersService.findAll();
  }

  // GET /api/v1/members/:id
  @Get(":id")
  findOne(
    @Param("id") id: string,
  ) {
    return this.membersService.findOne(id);
  }

  // POST /api/v1/members
  @Post()
  create(
    @Body() data: CreateMemberDto,
  ) {
    return this.membersService.create(data);
  }

  // PATCH /api/v1/members/:id
  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body()
    data: Partial<CreateMemberDto>,
  ) {
    return this.membersService.update(
      id,
      data,
    );
  }

  // DELETE /api/v1/members/:id
  @Delete(":id")
  remove(
    @Param("id") id: string,
  ) {
    return this.membersService.remove(id);
  }
}