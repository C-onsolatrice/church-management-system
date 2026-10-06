import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";

import { PrismaService } from "../database/prisma.service";

@Injectable()
export class MembersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.member.findMany({
      include: {
        branch: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async findOne(id: string) {
    const member = await this.prisma.member.findUnique({
      where: { id },
      include: {
        branch: true,
      },
    });

    if (!member) {
      throw new NotFoundException("Member not found");
    }

    return member;
  }

  async create(data: {
    firstName: string;
    lastName: string;
    email?: string;
    phoneNumber?: string;
    status?: string;
    branchId?: string;
  }) {
    let branchId: string | null = null;

    if (data.branchId && data.branchId.trim() !== "") {
      const branch = await this.prisma.branch.findUnique({
        where: {
          id: data.branchId,
        },
      });

      if (!branch) {
        throw new BadRequestException(
          "The selected branch does not exist.",
        );
      }

      branchId = data.branchId;
    }

    return this.prisma.member.create({
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email || null,
        phoneNumber: data.phoneNumber || null,
        status: data.status || "ACTIVE",
        branchId,
      },
      include: {
        branch: true,
      },
    });
  }

  async update(
    id: string,
    data: {
      firstName?: string;
      lastName?: string;
      email?: string;
      phoneNumber?: string;
      status?: string;
      branchId?: string;
    },
  ) {
    await this.findOne(id);

    let branchId: string | null | undefined = undefined;

    if (data.branchId !== undefined) {
      if (!data.branchId.trim()) {
        branchId = null;
      } else {
        const branch = await this.prisma.branch.findUnique({
          where: {
            id: data.branchId,
          },
        });

        if (!branch) {
          throw new BadRequestException(
            "The selected branch does not exist.",
          );
        }

        branchId = data.branchId;
      }
    }

    return this.prisma.member.update({
      where: { id },
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phoneNumber: data.phoneNumber,
        status: data.status,
        branchId,
      },
      include: {
        branch: true,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.member.delete({
      where: { id },
    });
  }
}