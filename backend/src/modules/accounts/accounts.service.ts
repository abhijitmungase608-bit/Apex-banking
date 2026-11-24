import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AccountsService {
  constructor(private readonly prisma: PrismaService) {}

  async listAccounts(userId: string) {
    return [
      {
        id: 'acc_apex_sav_01',
        accountNumber: '108801552391',
        ifscCode: 'APEX0001088',
        branchName: 'Pune Financial District Branch',
        accountType: 'SAVINGS',
        status: 'ACTIVE',
        currency: 'INR',
        availableBalance: 184350.50,
        ledgerBalance: 184350.50,
        isPrimary: true,
      },
      {
        id: 'acc_apex_cur_02',
        accountNumber: '108802998412',
        ifscCode: 'APEX0001088',
        branchName: 'Pune Financial District Branch',
        accountType: 'CURRENT',
        status: 'ACTIVE',
        currency: 'INR',
        availableBalance: 450000.00,
        ledgerBalance: 450000.00,
        isPrimary: false,
      }
    ];
  }

  async getAccountById(accountId: string) {
    const accounts = await this.listAccounts('usr_apex_01');
    const acc = accounts.find(a => a.id === accountId || a.accountNumber === accountId);
    if (!acc) throw new NotFoundException(`Account ${accountId} not found.`);
    return acc;
  }
}
