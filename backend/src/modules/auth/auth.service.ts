import { Injectable, UnauthorizedException, BadRequestException, Logger } from '@nestjs/common';
import { RegisterDto, LoginDto, VerifyOtpDto } from './auth.dto';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(private readonly prisma: PrismaService) {}

  async register(dto: RegisterDto) {
    this.logger.log(`Registering new customer account for ${dto.email}`);
    
    // In production, encrypt password with bcrypt and insert into database
    return {
      success: true,
      message: 'Account created successfully. Please verify mobile via 6-digit OTP.',
      userId: `usr_${Date.now()}`,
      requireOtp: true,
    };
  }

  async login(dto: LoginDto) {
    this.logger.log(`Authentication challenge initiated for ${dto.identifier}`);

    // Verify credentials
    if (!dto.identifier || !dto.password) {
      throw new BadRequestException('Invalid credentials.');
    }

    // Require MFA OTP as mandated by RBI digital banking security directions
    return {
      success: true,
      requireOtp: true,
      message: 'MFA challenge dispatched. Enter sandbox OTP: 123456',
      sessionId: `sess_${Date.now()}`,
    };
  }

  async verifyOtp(dto: VerifyOtpDto) {
    if (dto.code !== '123456') {
      throw new UnauthorizedException('Invalid 6-digit verification code.');
    }

    this.logger.log(`MFA challenge verified for ${dto.identifier}`);

    return {
      accessToken: `apex_jwt_token_${Date.now()}_secure_access`,
      refreshToken: `apex_refresh_token_${Date.now()}_secure_refresh`,
      expiresIn: 3600,
      user: {
        id: 'usr_apex_01',
        fullName: 'Rahul Sharma',
        email: 'rahul.sharma@apexbank.in',
        role: 'CUSTOMER',
        kycStatus: 'APPROVED',
      },
    };
  }
}
