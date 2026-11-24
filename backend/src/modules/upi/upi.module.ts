import { Module } from '@nestjs/common';
import { UpiController } from './upi.controller';

@Module({
  controllers: [UpiController],
})
export class UpiModule {}
