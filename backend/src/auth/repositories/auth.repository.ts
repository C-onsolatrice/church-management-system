import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { IAuthRepository } from './auth.repository.interface';
import { RegisterChurchDto } from '../dto/register-church.dto';
import { Church, Branch, User } from '@prisma/client';

@Injectable()
export class AuthRepository implements IAuthRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createChurchWithAdmin(
    dto: RegisterChurchDto,
    hashedPassword: string,
    verificationToken: string,
  ): Promise<{ church: Church; branch: Branch; admin: User }> {
    return this.prisma.$transaction(async (tx) => {
      const church = await tx.church.create({
        data: {
          name: dto.churchName,
          legalRegNo: dto.legalRegNo,
          address: dto.address,
        },
      });

      const mainBranch = await tx.branch.create({
        data: {
          name: 'Main HQ Branch',
          location: dto.address,
          churchId: church.id,
        },
      });

      const admin = await tx.user.create({
        data: {
          email: dto.adminEmail,
          passwordHash: hashedPassword,
          name: dto.adminName,
          role: 'SUPER_ADMIN',
          branchId: mainBranch.id,
          verificationToken,
          isEmailVerified: false,
        },
      });

      return { church, branch: mainBranch, admin };
    });
  }

  async findUserByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async findUserById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async findUserByVerificationToken(token: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { verificationToken: token } });
  }

  async findUserByResetToken(token: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { resetPasswordToken: token } });
  }

  async updateUser(id: string, data: Partial<User>): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data,
    });
  }
}