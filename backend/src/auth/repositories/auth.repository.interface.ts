import { Church, Branch, User } from '@prisma/client';
import { RegisterChurchDto } from '../dto/register-church.dto';

export interface IAuthRepository {
  createChurchWithAdmin(dto: RegisterChurchDto, hashedPassword: string, verificationToken: string): Promise<{ church: Church; branch: Branch; admin: User }>;
  findUserByEmail(email: string): Promise<User | null>;
  findUserById(id: string): Promise<User | null>;
  findUserByVerificationToken(token: string): Promise<User | null>;
  findUserByResetToken(token: string): Promise<User | null>;
  updateUser(id: string, data: Partial<User>): Promise<User>;
}
