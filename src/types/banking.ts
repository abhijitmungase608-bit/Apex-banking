// APEX BANKING - TYPE DEFINITIONS

export type Role = 'CUSTOMER' | 'ADMIN' | 'COMPLIANCE_OFFICER' | 'AUDITOR';

export type KycStatus = 
  | 'NOT_SUBMITTED' 
  | 'PENDING_VERIFICATION' 
  | 'APPROVED' 
  | 'REJECTED' 
  | 'DOCUMENTS_REQUIRED';

export type AccountType = 
  | 'SAVINGS' 
  | 'CURRENT' 
  | 'SALARY' 
  | 'FIXED_DEPOSIT' 
  | 'RECURRING_DEPOSIT';

export type AccountStatus = 'ACTIVE' | 'DORMANT' | 'FROZEN' | 'CLOSED';

export type TransferType = 
  | 'UPI' 
  | 'IMPS' 
  | 'NEFT' 
  | 'RTGS' 
  | 'INTERNAL_TRANSFER' 
  | 'LOAN_DISBURSEMENT' 
  | 'INTEREST_CREDIT';

export type TransactionStatus = 
  | 'CREATED' 
  | 'PENDING' 
  | 'PROCESSING' 
  | 'SUCCESS' 
  | 'FAILED' 
  | 'REVERSED';

export type LedgerType = 'DEBIT' | 'CREDIT';

export type CardType = 'VIRTUAL_DEBIT' | 'PHYSICAL_DEBIT' | 'PREMIUM_SIGNATURE';
export type CardStatus = 'ACTIVE' | 'BLOCKED' | 'EXPIRED' | 'INACTIVE';

export type TicketStatus = 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
export type TicketPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export interface User {
  id: string;
  email: string;
  phoneNumber: string;
  fullName: string;
  role: Role;
  isMfaEnabled: boolean;
  avatarUrl?: string;
  createdAt: string;
}

export interface CustomerProfile {
  id: string;
  userId: string;
  fullName: string;
  dateOfBirth?: string;
  panNumber?: string;
  aadhaarLastFour?: string;
  addressLine1?: string;
  city?: string;
  state?: string;
  pincode?: string;
  upiId?: string;
  avatarUrl?: string;
  kycStatus: KycStatus;
  kycRejectionReason?: string;
  createdAt: string;
}

export interface Account {
  id: string;
  profileId: string;
  accountNumber: string;
  ifscCode: string;
  branchName: string;
  accountType: AccountType;
  status: AccountStatus;
  currency: string;
  availableBalance: number;
  ledgerBalance: number;
  isPrimary: boolean;
  createdAt: string;
}

export interface Beneficiary {
  id: string;
  profileId: string;
  name: string;
  nickname?: string;
  accountNumber?: string;
  ifscCode?: string;
  bankName?: string;
  upiId?: string;
  transferType: 'UPI' | 'BANK';
  isVerified: boolean;
  verifiedAt?: string;
  dailyLimit: number;
  createdAt: string;
}

export interface Transaction {
  id: string;
  referenceNumber: string;
  idempotencyKey: string;
  sourceAccountId: string;
  sourceAccountNumber: string;
  destinationAccountId?: string;
  counterpartyName: string;
  counterpartyDetail: string; // Account/IFSC or UPI VPA
  transferType: TransferType;
  amount: number;
  fee: number;
  status: TransactionStatus;
  remarks?: string;
  bankRrn?: string;
  providerStatusMsg?: string;
  createdAt: string;
  completedAt?: string;
}

export interface LedgerEntry {
  id: string;
  accountId: string;
  transactionId: string;
  entryType: LedgerType;
  amount: number;
  balanceAfter: number;
  description: string;
  createdAt: string;
}

export interface CardReference {
  id: string;
  accountId: string;
  cardType: CardType;
  cardNetwork: 'RuPay' | 'Visa' | 'Mastercard';
  lastFourDigits: string;
  maskedCardNumber: string;
  expiryMonth: number;
  expiryYear: number;
  cardHolderName: string;
  status: CardStatus;
  dailyAtmLimit: number;
  dailyOnlineLimit: number;
  isDomesticActive: boolean;
  isInternationalActive: boolean;
  isContactlessActive: boolean;
  createdAt: string;
}

export interface FixedDeposit {
  id: string;
  accountId: string;
  fdNumber: string;
  depositAmount: number;
  interestRate: number; // e.g. 7.5%
  tenureMonths: number;
  maturityAmount: number;
  maturityDate: string;
  status: 'ACTIVE' | 'MATURED' | 'PREMATURE_CLOSED';
  createdAt: string;
}

export interface LoanRecord {
  id: string;
  accountId: string;
  loanNumber: string;
  loanType: 'PERSONAL' | 'HOME' | 'VEHICLE' | 'BUSINESS';
  principalAmount: number;
  interestRate: number;
  tenureMonths: number;
  emiAmount: number;
  outstandingAmount: number;
  status: 'ACTIVE' | 'PENDING' | 'CLOSED';
  disbursedAt?: string;
  createdAt: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  category: 'TRANSACTION' | 'SECURITY' | 'OFFER' | 'SYSTEM';
  isRead: boolean;
  createdAt: string;
}

export interface SupportTicket {
  id: string;
  userId: string;
  ticketNumber: string;
  subject: string;
  description: string;
  priority: TicketPriority;
  status: TicketStatus;
  category: 'PAYMENTS' | 'CARDS' | 'KYC' | 'ACCOUNTS' | 'SECURITY';
  adminResponse?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DeviceSession {
  id: string;
  deviceName: string;
  deviceType: 'Mobile' | 'Desktop' | 'Tablet';
  os: string;
  browser: string;
  ipAddress: string;
  isCurrent: boolean;
  isTrusted: boolean;
  lastActiveAt: string;
}

export interface AuditLogEntry {
  id: string;
  userId?: string;
  actorName: string;
  role: Role;
  action: string;
  resource: string;
  ipAddress: string;
  details: string;
  timestamp: string;
}

export interface ReconciliationReport {
  id: string;
  date: string;
  totalTransactions: number;
  matchedCount: number;
  discrepancyCount: number;
  totalVolume: number;
  status: 'RECONCILED' | 'DISCREPANCY_FLAGGED';
  notes: string;
}
