import {
    Controller,
    Get,
  } from "@nestjs/common";
  
  import { BranchesService } from "./branches.service";
  
  @Controller("api/v1/branches")
  export class BranchesController {
    constructor(
      private readonly branchesService: BranchesService,
    ) {}
  
    @Get()
    findAll() {
      return this.branchesService.findAll();
    }
  }