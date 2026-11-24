import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AccountsService } from './accounts.service';

@ApiTags('Accounts & Balances')
@Controller('accounts')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Get()
  @ApiOperation({ summary: 'List customer accounts with real-time balances' })
  async getAccounts() {
    return this.accountsService.listAccounts('usr_apex_01');
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get specific account coordinates and branch details' })
  async getAccountById(@Param('id') id: string) {
    return this.accountsService.getAccountById(id);
  }
}
