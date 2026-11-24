import { Module, Global } from '@nestjs/common';
import { BankingGateway } from './banking.gateway';

@Global()
@Module({
  providers: [BankingGateway],
  exports: [BankingGateway],
})
export class WebSocketModule {}
