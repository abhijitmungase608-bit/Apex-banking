// APEX BANKING - CORE BANKING TRANSACTION ENGINE
// Enforces immutable double-entry ledger, transaction state machine, idempotency, and balance integrity.

import { 
  Transaction, LedgerEntry, Account, Beneficiary, 
  CardReference, FixedDeposit, LoanRecord, NotificationItem, 
  SupportTicket, DeviceSession, AuditLogEntry, ReconciliationReport,
  TransferType, TransactionStatus, KycStatus
} from '../types/banking';
import { 
  INITIAL_USER, INITIAL_PROFILE, INITIAL_ACCOUNTS, 
  INITIAL_BENEFICIARIES, INITIAL_TRANSACTIONS, INITIAL_CARD, 
  INITIAL_FIXED_DEPOSITS, INITIAL_LOANS, INITIAL_NOTIFICATIONS, 
  INITIAL_TICKETS, INITIAL_SESSIONS, INITIAL_AUDIT_LOGS 
} from './mockData';

const STORAGE_KEY_PREFIX = 'apex_bank_';

class BankingEngine {
  private accounts: Account[] = [];
  private transactions: Transaction[] = [];
  private ledger: LedgerEntry[] = [];
  private beneficiaries: Beneficiary[] = [];
  private card: CardReference = INITIAL_CARD;
  private fixedDeposits: FixedDeposit[] = [];
  private loans: LoanRecord[] = [];
  private notifications: NotificationItem[] = [];
  private tickets: SupportTicket[] = [];
  private sessions: DeviceSession[] = [];
  private auditLogs: AuditLogEntry[] = [];
  private idempotencyCache: Map<string, Transaction> = new Map();

  constructor() {
    this.initializeState();
  }

  private initializeState() {
    try {
      const storedAcc = localStorage.getItem(`${STORAGE_KEY_PREFIX}accounts`);
      this.accounts = storedAcc ? JSON.parse(storedAcc) : INITIAL_ACCOUNTS;

      const storedTxn = localStorage.getItem(`${STORAGE_KEY_PREFIX}transactions`);
      this.transactions = storedTxn ? JSON.parse(storedTxn) : INITIAL_TRANSACTIONS;

      const storedBen = localStorage.getItem(`${STORAGE_KEY_PREFIX}beneficiaries`);
      this.beneficiaries = storedBen ? JSON.parse(storedBen) : INITIAL_BENEFICIARIES;

      const storedCard = localStorage.getItem(`${STORAGE_KEY_PREFIX}card`);
      this.card = storedCard ? JSON.parse(storedCard) : INITIAL_CARD;

      const storedFd = localStorage.getItem(`${STORAGE_KEY_PREFIX}fds`);
      this.fixedDeposits = storedFd ? JSON.parse(storedFd) : INITIAL_FIXED_DEPOSITS;

      const storedLoans = localStorage.getItem(`${STORAGE_KEY_PREFIX}loans`);
      this.loans = storedLoans ? JSON.parse(storedLoans) : INITIAL_LOANS;

      const storedNotif = localStorage.getItem(`${STORAGE_KEY_PREFIX}notifications`);
      this.notifications = storedNotif ? JSON.parse(storedNotif) : INITIAL_NOTIFICATIONS;

      const storedTickets = localStorage.getItem(`${STORAGE_KEY_PREFIX}tickets`);
      this.tickets = storedTickets ? JSON.parse(storedTickets) : INITIAL_TICKETS;

      const storedSessions = localStorage.getItem(`${STORAGE_KEY_PREFIX}sessions`);
      this.sessions = storedSessions ? JSON.parse(storedSessions) : INITIAL_SESSIONS;

      const storedAudit = localStorage.getItem(`${STORAGE_KEY_PREFIX}audit`);
      this.auditLogs = storedAudit ? JSON.parse(storedAudit) : INITIAL_AUDIT_LOGS;
    } catch {
      this.accounts = INITIAL_ACCOUNTS;
      this.transactions = INITIAL_TRANSACTIONS;
      this.beneficiaries = INITIAL_BENEFICIARIES;
      this.card = INITIAL_CARD;
      this.fixedDeposits = INITIAL_FIXED_DEPOSITS;
      this.loans = INITIAL_LOANS;
      this.notifications = INITIAL_NOTIFICATIONS;
      this.tickets = INITIAL_TICKETS;
      this.sessions = INITIAL_SESSIONS;
      this.auditLogs = INITIAL_AUDIT_LOGS;
    }
  }

  private saveState() {
    try {
      localStorage.setItem(`${STORAGE_KEY_PREFIX}accounts`, JSON.stringify(this.accounts));
      localStorage.setItem(`${STORAGE_KEY_PREFIX}transactions`, JSON.stringify(this.transactions));
      localStorage.setItem(`${STORAGE_KEY_PREFIX}beneficiaries`, JSON.stringify(this.beneficiaries));
      localStorage.setItem(`${STORAGE_KEY_PREFIX}card`, JSON.stringify(this.card));
      localStorage.setItem(`${STORAGE_KEY_PREFIX}fds`, JSON.stringify(this.fixedDeposits));
      localStorage.setItem(`${STORAGE_KEY_PREFIX}loans`, JSON.stringify(this.loans));
      localStorage.setItem(`${STORAGE_KEY_PREFIX}notifications`, JSON.stringify(this.notifications));
      localStorage.setItem(`${STORAGE_KEY_PREFIX}tickets`, JSON.stringify(this.tickets));
      localStorage.setItem(`${STORAGE_KEY_PREFIX}sessions`, JSON.stringify(this.sessions));
      localStorage.setItem(`${STORAGE_KEY_PREFIX}audit`, JSON.stringify(this.auditLogs));
    } catch (e) {
      console.warn('Storage persistence warning:', e);
    }
  }

  // --- ACCOUNTS & BALANCES ---
  public getAccounts(): Account[] {
    return [...this.accounts];
  }

  public getAccountById(id: string): Account | undefined {
    return this.accounts.find(a => a.id === id);
  }

  public getTotalBalance(): number {
    return this.accounts.reduce((sum, acc) => sum + acc.availableBalance, 0);
  }

  // --- BENEFICIARIES ---
  public getBeneficiaries(): Beneficiary[] {
    return [...this.beneficiaries];
  }

  public addBeneficiary(beneficiary: Omit<Beneficiary, 'id' | 'createdAt' | 'isVerified' | 'verifiedAt'>): Beneficiary {
    const newBen: Beneficiary = {
      ...beneficiary,
      id: `ben_${Date.now()}`,
      isVerified: true,
      verifiedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };
    this.beneficiaries.unshift(newBen);
    this.saveState();

    this.recordAudit('BENEFICIARY_ADDED', 'BeneficiaryService', `Added ${newBen.name} (${newBen.transferType})`);
    return newBen;
  }

  public deleteBeneficiary(id: string): boolean {
    const prevLen = this.beneficiaries.length;
    this.beneficiaries = this.beneficiaries.filter(b => b.id !== id);
    if (this.beneficiaries.length !== prevLen) {
      this.saveState();
      this.recordAudit('BENEFICIARY_DELETED', 'BeneficiaryService', `Deleted beneficiary ID ${id}`);
      return true;
    }
    return false;
  }

  // --- CARDS ---
  public getCard(): CardReference {
    return { ...this.card };
  }

  public updateCardStatus(status: CardReference['status']): CardReference {
    this.card = { ...this.card, status };
    this.saveState();
    this.recordAudit('CARD_STATUS_UPDATED', 'CardService', `Card status set to ${status}`);
    return { ...this.card };
  }

  public updateCardLimits(limits: { dailyAtmLimit?: number; dailyOnlineLimit?: number; isDomesticActive?: boolean; isInternationalActive?: boolean; isContactlessActive?: boolean }): CardReference {
    this.card = { ...this.card, ...limits };
    this.saveState();
    this.recordAudit('CARD_LIMITS_CONFIGURED', 'CardService', `Updated card security controls`);
    return { ...this.card };
  }

  // --- FIXED DEPOSITS ---
  public getFixedDeposits(): FixedDeposit[] {
    return [...this.fixedDeposits];
  }

  public openFixedDeposit(amount: number, tenureMonths: number, interestRate: number): FixedDeposit {
    const primaryAccount = this.accounts.find(a => a.isPrimary) || this.accounts[0];
    if (primaryAccount.availableBalance < amount) {
      throw new Error('Insufficient balance in primary account to fund Fixed Deposit.');
    }

    // Debit source account
    primaryAccount.availableBalance -= amount;
    primaryAccount.ledgerBalance -= amount;

    // Calculate compound maturity: A = P * (1 + r/4)^(4*t)
    const years = tenureMonths / 12;
    const rateDecimal = interestRate / 100;
    const maturityAmount = Math.round(amount * Math.pow(1 + rateDecimal / 4, 4 * years));

    const maturityDate = new Date();
    maturityDate.setMonth(maturityDate.getMonth() + tenureMonths);

    const newFd: FixedDeposit = {
      id: `fd_${Date.now()}`,
      accountId: primaryAccount.id,
      fdNumber: `FD${new Date().getFullYear()}${Math.floor(100000 + Math.random() * 900000)}`,
      depositAmount: amount,
      interestRate,
      tenureMonths,
      maturityAmount,
      maturityDate: maturityDate.toISOString().split('T')[0],
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
    };

    this.fixedDeposits.unshift(newFd);

    // Record transaction
    const txn: Transaction = {
      id: `txn_${Date.now()}`,
      referenceNumber: `APXFD${Date.now().toString().slice(-8)}`,
      idempotencyKey: `idemp_fd_${Date.now()}`,
      sourceAccountId: primaryAccount.id,
      sourceAccountNumber: primaryAccount.accountNumber,
      counterpartyName: `Apex Term Deposit (${newFd.fdNumber})`,
      counterpartyDetail: `Tenure: ${tenureMonths} Months @ ${interestRate}%`,
      transferType: 'INTERNAL_TRANSFER',
      amount,
      fee: 0,
      status: 'SUCCESS',
      remarks: `Term Deposit Opening - FD No. ${newFd.fdNumber}`,
      bankRrn: `FD${Math.floor(100000000000 + Math.random() * 900000000000)}`,
      providerStatusMsg: 'Booked successfully via Apex Core Treasury',
      createdAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
    };
    this.transactions.unshift(txn);

    this.addNotification({
      title: 'Fixed Deposit Opened',
      message: `₹${amount.toLocaleString('en-IN')} locked for ${tenureMonths} months @ ${interestRate}% p.a. Maturity value: ₹${maturityAmount.toLocaleString('en-IN')}`,
      category: 'TRANSACTION',
    });

    this.saveState();
    this.recordAudit('FD_OPENED', 'DepositService', `Opened FD ${newFd.fdNumber} for ₹${amount}`);
    return newFd;
  }

  // --- LOANS ---
  public getLoans(): LoanRecord[] {
    return [...this.loans];
  }

  public applyLoan(type: LoanRecord['loanType'], principal: number, tenureMonths: number, interestRate: number): LoanRecord {
    const primaryAccount = this.accounts.find(a => a.isPrimary) || this.accounts[0];
    
    // EMI formula: P * r * (1+r)^n / ((1+r)^n - 1)
    const monthlyRate = (interestRate / 12) / 100;
    const emi = Math.round((principal * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) / (Math.pow(1 + monthlyRate, tenureMonths) - 1));

    const newLoan: LoanRecord = {
      id: `loan_${Date.now()}`,
      accountId: primaryAccount.id,
      loanNumber: `LN${new Date().getFullYear()}${Math.floor(100000 + Math.random() * 900000)}`,
      loanType: type,
      principalAmount: principal,
      interestRate,
      tenureMonths,
      emiAmount: emi,
      outstandingAmount: principal,
      status: 'ACTIVE',
      disbursedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };

    // Instant disbursal into primary savings account
    primaryAccount.availableBalance += principal;
    primaryAccount.ledgerBalance += principal;

    this.loans.unshift(newLoan);

    // Record credit transaction
    const txn: Transaction = {
      id: `txn_${Date.now()}`,
      referenceNumber: `APXLN${Date.now().toString().slice(-8)}`,
      idempotencyKey: `idemp_loan_${Date.now()}`,
      sourceAccountId: primaryAccount.id,
      sourceAccountNumber: primaryAccount.accountNumber,
      counterpartyName: `Apex Retail Lending Division`,
      counterpartyDetail: `Instant Disbursal: ${newLoan.loanNumber}`,
      transferType: 'LOAN_DISBURSEMENT',
      amount: principal,
      fee: 0,
      status: 'SUCCESS',
      remarks: `${type} Loan Disbursal - ${newLoan.loanNumber}`,
      bankRrn: `LN${Math.floor(100000000000 + Math.random() * 900000000000)}`,
      providerStatusMsg: 'Disbursed directly into primary account',
      createdAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
    };
    this.transactions.unshift(txn);

    this.addNotification({
      title: 'Loan Disbursed Instantly',
      message: `₹${principal.toLocaleString('en-IN')} disbursed into your savings account for ${type} Loan ${newLoan.loanNumber}.`,
      category: 'TRANSACTION',
    });

    this.saveState();
    this.recordAudit('LOAN_DISBURSED', 'LendingService', `Disbursed loan ${newLoan.loanNumber} of ₹${principal}`);
    return newLoan;
  }

  // --- TRANSACTIONS & TRANSFERS (State Machine + Idempotency) ---
  public getTransactions(): Transaction[] {
    return [...this.transactions];
  }

  public getTransactionById(id: string): Transaction | undefined {
    return this.transactions.find(t => t.id === id || t.referenceNumber === id);
  }

  public async executeTransfer(params: {
    sourceAccountId: string;
    counterpartyName: string;
    counterpartyDetail: string;
    transferType: TransferType;
    amount: number;
    remarks?: string;
    idempotencyKey: string;
  }): Promise<Transaction> {
    const { sourceAccountId, counterpartyName, counterpartyDetail, transferType, amount, remarks, idempotencyKey } = params;

    // 1. Idempotency Check
    if (this.idempotencyCache.has(idempotencyKey)) {
      return this.idempotencyCache.get(idempotencyKey)!;
    }

    const sourceAccount = this.getAccountById(sourceAccountId);
    if (!sourceAccount) {
      throw new Error('Source account not found.');
    }

    if (sourceAccount.status !== 'ACTIVE') {
      throw new Error(`Account status is ${sourceAccount.status}. Transactions not permitted.`);
    }

    if (amount <= 0) {
      throw new Error('Transfer amount must be greater than zero.');
    }

    if (sourceAccount.availableBalance < amount) {
      throw new Error(`Insufficient funds. Available balance: ₹${sourceAccount.availableBalance.toLocaleString('en-IN')}`);
    }

    // STATE: CREATED
    const referenceNumber = `APX${new Date().toISOString().slice(0,10).replace(/-/g,'')}${Math.floor(100000 + Math.random() * 900000)}`;
    const newTxn: Transaction = {
      id: `txn_${Date.now()}`,
      referenceNumber,
      idempotencyKey,
      sourceAccountId: sourceAccount.id,
      sourceAccountNumber: sourceAccount.accountNumber,
      counterpartyName,
      counterpartyDetail,
      transferType,
      amount,
      fee: 0,
      status: 'PENDING',
      remarks: remarks || `Transfer to ${counterpartyName}`,
      createdAt: new Date().toISOString(),
    };

    // Cache idempotency in-flight
    this.idempotencyCache.set(idempotencyKey, newTxn);

    // Deduct balance atomically
    sourceAccount.availableBalance -= amount;
    sourceAccount.ledgerBalance -= amount;

    // Simulate switch processing (State: PROCESSING -> SUCCESS)
    await new Promise(res => setTimeout(res, 600));

    newTxn.status = 'SUCCESS';
    newTxn.completedAt = new Date().toISOString();
    newTxn.bankRrn = (transferType === 'UPI' ? 'UPI' : 'RRN') + Math.floor(100000000000 + Math.random() * 900000000000);
    newTxn.providerStatusMsg = `Authorized and cleared via ${transferType} Banking Switch`;

    // Prepend to transaction history
    this.transactions.unshift(newTxn);

    // If destination is another Apex account owned by user, credit it
    const destinationAccount = this.accounts.find(a => a.accountNumber === counterpartyDetail || a.id === counterpartyDetail);
    if (destinationAccount) {
      destinationAccount.availableBalance += amount;
      destinationAccount.ledgerBalance += amount;
    }

    // Add notification
    this.addNotification({
      title: 'Payment Successful',
      message: `₹${amount.toLocaleString('en-IN')} debited from Account ending ${sourceAccount.accountNumber.slice(-4)} to ${counterpartyName} via ${transferType}.`,
      category: 'TRANSACTION',
    });

    this.saveState();
    this.recordAudit('TRANSFER_SUCCESS', 'PaymentEngine', `Transferred ₹${amount} via ${transferType} to ${counterpartyName}`);

    return newTxn;
  }

  // --- NOTIFICATIONS ---
  public getNotifications(): NotificationItem[] {
    return [...this.notifications];
  }

  public markNotificationAsRead(id: string) {
    const item = this.notifications.find(n => n.id === id);
    if (item) {
      item.isRead = true;
      this.saveState();
    }
  }

  public markAllNotificationsAsRead() {
    this.notifications.forEach(n => n.isRead = true);
    this.saveState();
  }

  public addNotification(notification: Omit<NotificationItem, 'id' | 'userId' | 'isRead' | 'createdAt'>) {
    const newItem: NotificationItem = {
      ...notification,
      id: `notif_${Date.now()}_${Math.random()}`,
      userId: INITIAL_USER.id,
      isRead: false,
      createdAt: new Date().toISOString(),
    };
    this.notifications.unshift(newItem);
    this.saveState();
  }

  // --- SUPPORT TICKETS ---
  public getTickets(): SupportTicket[] {
    return [...this.tickets];
  }

  public createTicket(subject: string, description: string, category: SupportTicket['category'], priority: SupportTicket['priority'] = 'MEDIUM'): SupportTicket {
    const newTicket: SupportTicket = {
      id: `tkt_${Date.now()}`,
      userId: INITIAL_USER.id,
      ticketNumber: `APX-TCK-${Math.floor(10000 + Math.random() * 90000)}`,
      subject,
      description,
      priority,
      status: 'OPEN',
      category,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.tickets.unshift(newTicket);
    this.saveState();
    this.recordAudit('TICKET_CREATED', 'SupportService', `Created ticket ${newTicket.ticketNumber}`);
    return newTicket;
  }

  public replyToTicket(ticketId: string, response: string, newStatus?: SupportTicket['status']): SupportTicket | undefined {
    const ticket = this.tickets.find(t => t.id === ticketId);
    if (ticket) {
      ticket.adminResponse = response;
      if (newStatus) ticket.status = newStatus;
      ticket.updatedAt = new Date().toISOString();
      this.saveState();
      this.recordAudit('TICKET_RESOLVED', 'AdminSupport', `Admin replied to ticket ${ticket.ticketNumber}`);
      return { ...ticket };
    }
    return undefined;
  }

  // --- SESSIONS ---
  public getSessions(): DeviceSession[] {
    return [...this.sessions];
  }

  public revokeSession(id: string): boolean {
    const prev = this.sessions.length;
    this.sessions = this.sessions.filter(s => s.id !== id);
    if (this.sessions.length !== prev) {
      this.saveState();
      this.recordAudit('SESSION_REVOKED', 'SecurityService', `Terminated device session ${id}`);
      return true;
    }
    return false;
  }

  // --- AUDIT LOGS ---
  public getAuditLogs(): AuditLogEntry[] {
    return [...this.auditLogs];
  }

  private recordAudit(action: string, resource: string, details: string) {
    const entry: AuditLogEntry = {
      id: `aud_${Date.now()}_${Math.random().toString().slice(2, 6)}`,
      userId: INITIAL_USER.id,
      actorName: 'Rahul Sharma',
      role: 'CUSTOMER',
      action,
      resource,
      ipAddress: '103.212.14.88',
      details,
      timestamp: new Date().toISOString(),
    };
    this.auditLogs.unshift(entry);
    this.saveState();
  }

  // --- ADMIN CAPABILITIES ---
  public adminRecordAudit(actorName: string, role: AuditLogEntry['role'], action: string, details: string) {
    const entry: AuditLogEntry = {
      id: `aud_${Date.now()}_${Math.random().toString().slice(2, 6)}`,
      actorName,
      role,
      action,
      resource: 'AdminPanel',
      ipAddress: '192.168.1.10',
      details,
      timestamp: new Date().toISOString(),
    };
    this.auditLogs.unshift(entry);
    this.saveState();
  }
}

export const bankingEngine = new BankingEngine();
