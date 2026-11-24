import { Controller, Get, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Loan & Retail Credit Services')
@Controller('loans')
export class LoansController {
  private static loans = [
    {
      id: 'loan_01',
      loanNumber: 'LN2024773821',
      loanType: 'PERSONAL',
      principalAmount: 300000,
      interestRate: 10.50,
      tenureMonths: 36,
      emiAmount: 9748,
      outstandingAmount: 215400,
      status: 'ACTIVE',
    }
  ];

  @Get()
  @ApiOperation({ summary: 'List customer loans portfolio' })
  async list() {
    return LoansController.loans;
  }

  @Post('apply')
  @ApiOperation({ summary: 'Apply for pre-approved loan with instant disbursal' })
  async apply(@Body() body: { type: string; principal: number; tenureMonths: number; interestRate: number }) {
    const monthlyRate = (body.interestRate / 12) / 100;
    const emi = Math.round((body.principal * monthlyRate * Math.pow(1 + monthlyRate, body.tenureMonths)) / (Math.pow(1 + monthlyRate, body.tenureMonths) - 1));

    const newLoan = {
      id: `loan_${Date.now()}`,
      loanNumber: `LN2026${Math.floor(100000 + Math.random() * 900000)}`,
      loanType: body.type,
      principalAmount: body.principal,
      interestRate: body.interestRate,
      tenureMonths: body.tenureMonths,
      emiAmount: emi,
      outstandingAmount: body.principal,
      status: 'ACTIVE',
    };
    LoansController.loans.unshift(newLoan);
    return newLoan;
  }
}
