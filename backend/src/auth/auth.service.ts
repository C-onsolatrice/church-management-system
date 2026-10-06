import { Injectable, ConflictException, UnauthorizedException, BadRequestException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as crypto from 'crypto';
import { AuthRepository } from './repositories/auth.repository';
import { RegisterChurchDto } from './dto/register-church.dto';
import { LoginDto } from './dto/login.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly authRepository: AuthRepository,
    private readonly jwtService: JwtService,
  ) {}

  private async hashValue(val: string): Promise<string> {
    return crypto.createHash('sha256').update(val).digest('hex');
  }

  async registerChurch(dto: RegisterChurchDto) {
    const existingUser = await this.authRepository.findUserByEmail(dto.adminEmail);
    if (existingUser) {
      throw new ConflictException('Email address is already registered');
    }

    const hashedPassword = await this.hashValue(dto.adminPassword);
    const verificationToken = crypto.randomBytes(32).toString('hex');

    const result = await this.authRepository.createChurchWithAdmin(
      dto,
      hashedPassword,
      verificationToken,
    );

    // Mock Email Service Log for Verification
    this.logger.log(`[Verification Email Sent] Code: ${verificationToken} dispatched to ${dto.adminEmail}`);

    return {
      message: 'Church and Admin account initialized successfully. Please verify your email.',
      churchId: result.church.id,
      adminId: result.admin.id,
    };
  }

  async login(dto: LoginDto) {
    const user = await this.authRepository.findUserByEmail(dto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isMatch = (await this.hashValue(dto.password)) === user.passwordHash;
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // if (!user.isEmailVerified) {
    //   throw new UnauthorizedException('Please verify your email before logging in.');
    // }

    const tokens = await this.getTokens(user.id, user.email, user.role);
    await this.updateRefreshToken(user.id, tokens.refreshToken);

    return tokens;
  }

  async verifyEmail(token: string) {
    const user = await this.authRepository.findUserByVerificationToken(token);
    if (!user) {
      throw new BadRequestException('Invalid or expired verification token');
    }

    await this.authRepository.updateUser(user.id, {
      isEmailVerified: true,
      emailVerifiedAt: new Date(),
      verificationToken: null,
    });

    return { message: 'Email verified successfully. You can now log in.' };
  }

  async forgotPassword(email: string) {
    const user = await this.authRepository.findUserByEmail(email);
    if (!user) {
      // Avoid user enumeration
      return { message: 'If the email exists, a password reset link has been dispatched.' };
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 3600000); // 1 hour expiration

    await this.authRepository.updateUser(user.id, {
      resetPasswordToken: resetToken,
      resetTokenExpires: expires,
    });

    this.logger.log(`[Reset Password Email Sent] Code: ${resetToken} dispatched to ${email}`);
    return { message: 'If the email exists, a password reset link has been dispatched.' };
  }

  async resetPassword(dto: ResetPasswordDto) {
    const user = await this.authRepository.findUserByResetToken(dto.token);
    if (!user || !user.resetTokenExpires || user.resetTokenExpires < new Date()) {
      throw new BadRequestException('Invalid or expired reset token');
    }

    const newHashed = await this.hashValue(dto.newPassword);
    await this.authRepository.updateUser(user.id, {
      passwordHash: newHashed,
      resetPasswordToken: null,
      resetTokenExpires: null,
    });

    return { message: 'Password has been successfully updated.' };
  }

  async logout(userId: string) {
    await this.authRepository.updateUser(userId, { refreshTokenHash: null });
    return { message: 'Logged out successfully.' };
  }

  async refreshTokens(userId: string, refreshToken: string) {
    const user = await this.authRepository.findUserById(userId);
    if (!user || !user.refreshTokenHash) {
      throw new UnauthorizedException('Access Denied');
    }

    const rTokenMatch = (await this.hashValue(refreshToken)) === user.refreshTokenHash;
    if (!rTokenMatch) {
      throw new UnauthorizedException('Access Denied');
    }

    const tokens = await this.getTokens(user.id, user.email, user.role);
    await this.updateRefreshToken(user.id, tokens.refreshToken);
    return tokens;
  }

  private async getTokens(userId: string, email: string, role: string) {
    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(
        { sub: userId, email, role },
        { secret: process.env.JWT_SECRET || 'super_secret_fallback_key', expiresIn: '15m' },
      ),
      this.jwtService.signAsync(
        { sub: userId, email, role },
        { secret: process.env.JWT_REFRESH_SECRET || 'refresh_secret_fallback_key', expiresIn: '7d' },
      ),
    ]);

    return { accessToken: at, refreshToken: rt };
  }

  private async updateRefreshToken(userId: string, rToken: string) {
    const hash = await this.hashValue(rToken);
    await this.authRepository.updateUser(userId, { refreshTokenHash: hash });
  }
}