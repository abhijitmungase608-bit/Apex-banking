import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Fraud & Risk Analytics')
@Controller('fraud')
export class FraudController {
  @Get('alerts')
  @ApiOperation({ summary: 'List flagged behavioral anomalies and velocity warnings' })
  async getAlerts() {
    return [
      {
        id: 'FRD-9912',
        account: '1088 0155 2391',
        customer: 'Rahul Sharma',
        anomaly: 'Rapid succession of 3 international IP logins in under 2 minutes',
        riskScore: 78,
        status: 'UNDER_REVIEW',
      }
    ];
  }
}
