import { Module } from '@nestjs/common';

import {TithesController} from './tithes.controller';

import {TithesService} from './tithes.service';

import {PrismaService} from '../database/prisma.service';



@Module({

controllers:[
TithesController
],

providers:[
TithesService,
PrismaService
]


})

export class TithesModule {}