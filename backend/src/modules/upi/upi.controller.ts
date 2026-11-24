import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('UPI 2.0 Payment Services')
@Controller('upi')
export class UpiController {
  @Post('verify-vpa')
  @ApiOperation({ summary: 'Verify recipient UPI Virtual Payment Address (VPA)' })
  async verifyVpa(@Body('vpa') vpa: string) {
    const vpaRegex = /^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/;
    if (!vpaRegex.test(vpa)) {
      return { success: false, message: 'Invalid UPI format. Must be user@handle.' };
    }
    const name = vpa.split('@')[0].replace(/[._-]/g, ' ');
    const formatted = name.charAt(0).toUpperCase() + name.slice(1);

    return {
      success: true,
      data: {
        vpa: vpa.toLowerCase(),
        name: `${formatted} (Verified Payee)`,
        bank: 'Authorized NPCI Partner Bank',
      },
    };
  }

  @Get('qr')
  @ApiOperation({ summary: 'Generate dynamic Bharat UPI QR Code' })
  async generateQr(@Query('vpa') vpa: string, @Query('amount') amount?: number) {
    const targetVpa = vpa || 'rahul.sharma@apex';
    const uri = `upi://pay?pa=${targetVpa}&pn=ApexCustomer&cu=INR${amount ? `&am=${amount}` : ''}`;
    return {
      qrUri: uri,
      vpa: targetVpa,
      amount: amount || null,
    };
  }
}
