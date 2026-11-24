import { Controller, Get, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Fixed Term Deposits')
@Controller('deposits')
export class DepositsController {
  private static fds = [
    {
      id: 'fd_01',
      fdNumber: 'FD2024098812',
      depositAmount: 200000,
      interestRate: 7.75,
      tenureMonths: 18,
      maturityAmount: 224320,
      maturityDate: '2027-05-15',
      status: 'ACTIVE',
    }
  ];

  @Get()
  @ApiOperation({ summary: 'List active fixed term deposits' })
  async list() {
    return DepositsController.fds;
  }

  @Post('open')
  @ApiOperation({ summary: 'Open instant high-yield term deposit' })
  async open(@Body() body: { amount: number; tenureMonths: number; interestRate: number }) {
    const years = body.tenureMonths / 12;
    const r = body.interestRate / 100;
    const maturityAmount = Math.round(body.amount * Math.pow(1 + r / 4, 4 * years));
    
    const maturityDate = new Date();
    maturityDate.setMonth(maturityDate.getMonth() + body.tenureMonths);

    const newFd = {
      id: `fd_${Date.now()}`,
      fdNumber: `FD2026${Math.floor(100000 + Math.random() * 900000)}`,
      depositAmount: body.amount,
      interestRate: body.interestRate,
      tenureMonths: body.tenureMonths,
      maturityAmount,
      maturityDate: maturityDate.toISOString().split('T')[0],
      status: 'ACTIVE',
    };
    DepositsController.fds.unshift(newFd);
    return newFd;
  }
}
