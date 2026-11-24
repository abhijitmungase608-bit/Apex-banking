import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { InitiateTransferDto } from './transfers.dto';
import { LedgerService } from '../ledger/ledger.service';
import { BankingGateway } from '../../websocket/banking.gateway';

@Injectable()
export class TransfersService {
  private readonly logger = new Logger(TransfersService.name);

  constructor(
    private readonly ledgerService: LedgerService,
    private readonly wsGateway: BankingGateway,
  ) {}

  async executeTransfer(dto: InitiateTransferDto, idempotencyKey: string) {
    this.logger.log(`Initiating financial transfer: ₹${dto.amount} via ${dto.transferType} to ${dto.counterpartyName}`);

    // State 1: CREATED
    const referenceNumber = `APX${Date.now().toString().slice(-10)}`;
    
    // Broadcast CREATED
    this.wsGateway.broadcastTransactionEvent({
      referenceNumber,
      status: 'PROCESSING',
      amount: dto.amount,
      channel: dto.transferType,
      counterparty: dto.counterpartyName,
    });

    // Post double-entry ledger mutation atomically
    await this.ledgerService.postTransferEntries({
      sourceAccountId: dto.sourceAccountId,
      amount: dto.amount,
      referenceNumber,
      description: dto.remarks || `Transfer to ${dto.counterpartyName}`,
    });

    // State 2: SUCCESS
    const result = {
      referenceNumber,
      idempotencyKey,
      status: 'SUCCESS',
      transferType: dto.transferType,
      amount: dto.amount,
      counterpartyName: dto.counterpartyName,
      counterpartyDetail: dto.counterpartyDetail,
      bankRrn: 'RRN' + Math.floor(100000000000 + Math.random() * 900000000000),
      providerStatusMsg: `Authorized and settled via ${dto.transferType} Banking Switch`,
      fee: 0,
      timestamp: new Date().toISOString(),
    };

    this.wsGateway.broadcastTransactionEvent({
      referenceNumber,
      status: 'SUCCESS',
      amount: dto.amount,
      channel: dto.transferType,
      counterparty: dto.counterpartyName,
    });

    return result;
  }
}
