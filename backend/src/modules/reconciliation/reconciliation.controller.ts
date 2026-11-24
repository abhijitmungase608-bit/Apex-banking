import { Controller, Get, Post } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Settlement Reconciliation Engine')
@Controller('reconciliation')
export class ReconciliationController {
  @Get('summary')
  @ApiOperation({ summary: 'Get daily 3-way reconciliation settlement summary' })
  async getSummary() {
    return [
      {
        batchId: 'REC-20261124-01',
        switch: 'NPCI UPI 2.0 Settlement',
        matched: 1420,
        discrepancy: 0,
        grossVolume: 4892000,
        status: 'RECONCILED',
      }
    ];
  }
}
