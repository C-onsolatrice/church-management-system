import {
  Injectable,
  NotFoundException,
} from "@nestjs/common";

import { PrismaService } from "../database/prisma.service";

import { CreateEventDto } from "./dto/create-event.dto";

@Injectable()
export class EventsService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  findAll() {
    return this.prisma.event.findMany({
      include: {
        branch: true,
      },
      orderBy: {
        date: "asc",
      },
    });
  }

  async findOne(id: string) {
    const event =
      await this.prisma.event.findUnique({
        where: { id },
        include: {
          branch: true,
        },
      });

    if (!event) {
      throw new NotFoundException(
        "Event not found",
      );
    }

    return event;
  }

  create(data: CreateEventDto) {
    return this.prisma.event.create({
      data: {
        title: data.title,
        description: data.description,
        type: data.type,
        date: new Date(data.date),
        startDate: data.startDate
          ? new Date(data.startDate)
          : undefined,
        endDate: data.endDate
          ? new Date(data.endDate)
          : undefined,
        location: data.location,
        capacity: data.capacity,
        isPublic: data.isPublic ?? false,
        branchId: data.branchId,
      },
    });
  }

  async update(
    id: string,
    data: Partial<CreateEventDto>,
  ) {
    await this.findOne(id);

    return this.prisma.event.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description,
        type: data.type,
        date: data.date
          ? new Date(data.date)
          : undefined,
        location: data.location,
        capacity: data.capacity,
        isPublic: data.isPublic,
        branchId: data.branchId,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.event.delete({
      where: { id },
    });
  }
}