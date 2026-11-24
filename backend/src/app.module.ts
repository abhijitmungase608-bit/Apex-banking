import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { WebSocketModule } from './websocket/websocket.module';

// Core Banking Modules
import { AuthModule } from './modules/auth/auth.module';
import { AccountsModule } from './modules/accounts/accounts.module';
import { TransfersModule } from './modules/transfers/transfers.module';
import { LedgerModule } from './modules/ledger/ledger.module';
import { UpiModule } from './modules/upi/upi.module';
import { BeneficiariesModule } from './modules/beneficiaries/beneficiaries.module';
import { CardsModule } from './modules/cards/cards.module';
import { KycModule } from './modules/kyc/kyc.module';
import { DepositsModule } from './modules/deposits/deposits.module';
import { LoansModule } from './modules/loans/loans.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { WebhooksModule } from './modules/webhooks/webhooks.module';
import { ReconciliationModule } from './modules/reconciliation/reconciliation.module';
import { FraudMonitoringModule } from './modules/fraud-monitoring/fraud.module';
import { CustomerSupportModule } from './modules/customer-support/support.module';
import { AdministrationModule } from './modules/administration/administration.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    WebSocketModule,
    AuthModule,
    AccountsModule,
    TransfersModule,
    LedgerModule,
    UpiModule,
    BeneficiariesModule,
    CardsModule,
    KycModule,
    DepositsModule,
    LoansModule,
    NotificationsModule,
    WebhooksModule,
    ReconciliationModule,
    FraudMonitoringModule,
    CustomerSupportModule,
    AdministrationModule,
  ],
})
export class AppModule {}
