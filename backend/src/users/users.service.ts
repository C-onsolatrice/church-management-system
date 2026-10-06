import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { UsersRepository } from './repositories/users.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { QueryUserDto } from './dto/query-user.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async create(dto: CreateUserDto) {
    const existing = await this.usersRepository.findWithDeleted(dto.email);
    if (existing) {
      throw new ConflictException('A user with this email address already exists.');
    }
    return this.usersRepository.create(dto);
  }

  async findAll(query: QueryUserDto) {
    const { search, role, page, limit } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.UserWhereInput = {
      deletedAt: null, // Keep deleted accounts hidden on standard queries
      ...(role && { role }),
      ...(search && {
        OR: [
          { name: { contains: search } },
          { email: { contains: search } },
        ],
      }),
    };

    const [data, total] = await this.usersRepository.findAndCount({
      skip,
      take: limit,
      where,
    });

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const user = await this.usersRepository.findOne(id);
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async update(id: string, updateData: Partial<CreateUserDto>) {
    await this.findOne(id);
    return this.usersRepository.update(id, updateData);
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.usersRepository.softDelete(id);
    return { message: 'User soft-deleted successfully.' };
  }

  async restore(id: string) {
    const user = await this.usersRepository.findWithDeleted(id);
    if (!user) throw new NotFoundException('User not found');
    await this.usersRepository.restore(id);
    return { message: 'User restored successfully.' };
  }
}