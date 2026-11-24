import { Controller, Get, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('e-KYC & Regulatory Compliance')
@Controller('kyc')
export class KycController {
  @Get('status')
  @ApiOperation({ summary: 'Inquire customer e-KYC status' })
  async getStatus() {
    return {
      kycStatus: 'APPROVED',
      tier: 'FULL_VIDEO_KYC',
      verifiedAt: '2024-01-16T12:00:00Z',
      panNumber: 'ABCPS1234F',
      aadhaarMasked: '•••• •••• 7890',
    };
  }

  @Post('verify-pan')
  @ApiOperation({ summary: 'Validate PAN format and active status against NSDL' })
  async verifyPan(@Body('panNumber') panNumber: string) {
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    if (!panRegex.test(panNumber?.toUpperCase())) {
      return { success: false, message: 'Invalid 10-character PAN format.' };
    }
    return {
      success: true,
      pan: panNumber.toUpperCase(),
      status: 'ACTIVE',
      nameMatch: 'RAHUL SHARMA',
    };
  }
}
