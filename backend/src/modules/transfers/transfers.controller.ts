import { Controller, Post, Body, Headers, UseInterceptors } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiHeader } from '@nestjs/swagger';
import { TransfersService } from './transfers.service';
import { InitiateTransferDto } from './transfers.dto';
import { IdempotencyInterceptor } from '../../common/interceptors/idempotency.interceptor';

@ApiTags('Payments & Money Transfers')
@Controller('transfers')
@UseInterceptors(IdempotencyInterceptor)
export class TransfersController {
  constructor(private readonly transfersService: TransfersService) {}

  @Post('initiate')
  @ApiOperation({ summary: 'Execute deterministic financial transfer (UPI, IMPS, NEFT, RTGS)' })
  @ApiHeader({ name: 'Idempotency-Key', required: true, description: 'Unique idempotency UUID to prevent double charges' })
  async initiateTransfer(
    @Body() dto: InitiateTransferDto,
    @Headers('idempotency-key') idempotencyKey: string,
  ) {
    return this.transfersService.executeTransfer(dto, idempotencyKey);
  }
}
