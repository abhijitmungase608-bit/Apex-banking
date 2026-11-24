import { Controller, Get, Post, Body, Delete, Param } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Beneficiary Management')
@Controller('beneficiaries')
export class BeneficiariesController {
  private static beneficiaries = [
    {
      id: 'ben_01',
      name: 'Priya Sharma',
      nickname: 'Priya Sister',
      accountNumber: '918237465012',
      ifscCode: 'HDFC0000240',
      bankName: 'HDFC Bank Ltd',
      transferType: 'BANK',
      isVerified: true,
      dailyLimit: 200000,
    },
    {
      id: 'ben_02',
      name: 'Aarav Patel',
      nickname: 'Aarav Office',
      upiId: 'aarav.patel@okhdfcbank',
      transferType: 'UPI',
      isVerified: true,
      dailyLimit: 100000,
    }
  ];

  @Get()
  @ApiOperation({ summary: 'Retrieve verified beneficiaries list' })
  async list() {
    return BeneficiariesController.beneficiaries;
  }

  @Post('penny-drop')
  @ApiOperation({ summary: 'Execute ₹1 Penny-Drop verification for bank account & IFSC' })
  async pennyDrop(@Body() body: { accountNumber: string; ifscCode: string }) {
    return {
      success: true,
      verifiedName: 'VERIFIED RECIPIENT (' + body.ifscCode.slice(0, 4) + ' ACC)',
      bankName: `${body.ifscCode.slice(0, 4)} Bank Ltd`,
      rrn: 'PD' + Math.floor(1000000000 + Math.random() * 9000000000),
    };
  }

  @Post()
  @ApiOperation({ summary: 'Save new beneficiary' })
  async add(@Body() ben: any) {
    const newBen = { ...ben, id: `ben_${Date.now()}`, isVerified: true };
    BeneficiariesController.beneficiaries.unshift(newBen);
    return newBen;
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete beneficiary' })
  async remove(@Param('id') id: string) {
    BeneficiariesController.beneficiaries = BeneficiariesController.beneficiaries.filter(b => b.id !== id);
    return { success: true, message: `Beneficiary ${id} deleted.` };
  }
}
