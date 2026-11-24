import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Account, Transaction, Beneficiary, CardReference, 
  FixedDeposit, LoanRecord, NotificationItem, SupportTicket, 
  DeviceSession, AuditLogEntry, TransferType 
} from '../types/banking';
import { bankingEngine } from '../services/bankingEngine';

interface BankingContextType {
  accounts: Account[];
  primaryAccount: Account | undefined;
  totalBalance: number;
  isBalanceHidden: boolean;
  toggleBalanceVisibility: () => void;
  transactions: Transaction[];
  beneficiaries: Beneficiary[];
  card: CardReference;
  fixedDeposits: FixedDeposit[];
  loans: LoanRecord[];
  notifications: NotificationItem[];
  unreadNotifCount: number;
  tickets: SupportTicket[];
  sessions: DeviceSession[];
  auditLogs: AuditLogEntry[];
  
  // Actions
  refreshData: () => void;
  executeTransfer: (params: {
    sourceAccountId: string;
    counterpartyName: string;
    counterpartyDetail: string;
    transferType: TransferType;
    amount: number;
    remarks?: string;
  }) => Promise<Transaction>;
  addBeneficiary: (ben: Omit<Beneficiary, 'id' | 'createdAt' | 'isVerified' | 'verifiedAt'>) => Beneficiary;
  deleteBeneficiary: (id: string) => boolean;
  updateCardStatus: (status: CardReference['status']) => void;
  updateCardLimits: (limits: Parameters<typeof bankingEngine.updateCardLimits>[0]) => void;
  openFixedDeposit: (amount: number, tenureMonths: number, interestRate: number) => FixedDeposit;
  applyLoan: (type: LoanRecord['loanType'], principal: number, tenureMonths: number, interestRate: number) => LoanRecord;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  createSupportTicket: (subject: string, desc: string, category: SupportTicket['category'], priority?: SupportTicket['priority']) => SupportTicket;
  replySupportTicket: (id: string, response: string, newStatus?: SupportTicket['status']) => void;
  revokeSession: (id: string) => boolean;
}

const BankingContext = createContext<BankingContextType | undefined>(undefined);

export const BankingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [accounts, setAccounts] = useState<Account[]>(() => bankingEngine.getAccounts());
  const [transactions, setTransactions] = useState<Transaction[]>(() => bankingEngine.getTransactions());
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>(() => bankingEngine.getBeneficiaries());
  const [card, setCard] = useState<CardReference>(() => bankingEngine.getCard());
  const [fixedDeposits, setFixedDeposits] = useState<FixedDeposit[]>(() => bankingEngine.getFixedDeposits());
  const [loans, setLoans] = useState<LoanRecord[]>(() => bankingEngine.getLoans());
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => bankingEngine.getNotifications());
  const [tickets, setTickets] = useState<SupportTicket[]>(() => bankingEngine.getTickets());
  const [sessions, setSessions] = useState<DeviceSession[]>(() => bankingEngine.getSessions());
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(() => bankingEngine.getAuditLogs());
  
  const [isBalanceHidden, setIsBalanceHidden] = useState<boolean>(() => {
    return localStorage.getItem('apex_balance_hidden') === 'true';
  });

  const toggleBalanceVisibility = () => {
    setIsBalanceHidden(prev => {
      const next = !prev;
      localStorage.setItem('apex_balance_hidden', String(next));
      return next;
    });
  };

  const refreshData = () => {
    setAccounts(bankingEngine.getAccounts());
    setTransactions(bankingEngine.getTransactions());
    setBeneficiaries(bankingEngine.getBeneficiaries());
    setCard(bankingEngine.getCard());
    setFixedDeposits(bankingEngine.getFixedDeposits());
    setLoans(bankingEngine.getLoans());
    setNotifications(bankingEngine.getNotifications());
    setTickets(bankingEngine.getTickets());
    setSessions(bankingEngine.getSessions());
    setAuditLogs(bankingEngine.getAuditLogs());
  };

  const primaryAccount = accounts.find(a => a.isPrimary) || accounts[0];
  const totalBalance = bankingEngine.getTotalBalance();
  const unreadNotifCount = notifications.filter(n => !n.isRead).length;

  const executeTransfer = async (params: {
    sourceAccountId: string;
    counterpartyName: string;
    counterpartyDetail: string;
    transferType: TransferType;
    amount: number;
    remarks?: string;
  }) => {
    const idempotencyKey = `idemp_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const result = await bankingEngine.executeTransfer({
      ...params,
      idempotencyKey,
    });
    refreshData();
    return result;
  };

  const addBeneficiary = (ben: Omit<Beneficiary, 'id' | 'createdAt' | 'isVerified' | 'verifiedAt'>) => {
    const result = bankingEngine.addBeneficiary(ben);
    refreshData();
    return result;
  };

  const deleteBeneficiary = (id: string) => {
    const res = bankingEngine.deleteBeneficiary(id);
    refreshData();
    return res;
  };

  const updateCardStatus = (status: CardReference['status']) => {
    bankingEngine.updateCardStatus(status);
    refreshData();
  };

  const updateCardLimits = (limits: Parameters<typeof bankingEngine.updateCardLimits>[0]) => {
    bankingEngine.updateCardLimits(limits);
    refreshData();
  };

  const openFixedDeposit = (amount: number, tenureMonths: number, interestRate: number) => {
    const res = bankingEngine.openFixedDeposit(amount, tenureMonths, interestRate);
    refreshData();
    return res;
  };

  const applyLoan = (type: LoanRecord['loanType'], principal: number, tenureMonths: number, interestRate: number) => {
    const res = bankingEngine.applyLoan(type, principal, tenureMonths, interestRate);
    refreshData();
    return res;
  };

  const markNotificationRead = (id: string) => {
    bankingEngine.markNotificationAsRead(id);
    refreshData();
  };

  const markAllNotificationsRead = () => {
    bankingEngine.markAllNotificationsAsRead();
    refreshData();
  };

  const createSupportTicket = (subject: string, desc: string, category: SupportTicket['category'], priority?: SupportTicket['priority']) => {
    const res = bankingEngine.createTicket(subject, desc, category, priority);
    refreshData();
    return res;
  };

  const replySupportTicket = (id: string, response: string, newStatus?: SupportTicket['status']) => {
    bankingEngine.replyToTicket(id, response, newStatus);
    refreshData();
  };

  const revokeSession = (id: string) => {
    const res = bankingEngine.revokeSession(id);
    refreshData();
    return res;
  };

  return (
    <BankingContext.Provider
      value={{
        accounts,
        primaryAccount,
        totalBalance,
        isBalanceHidden,
        toggleBalanceVisibility,
        transactions,
        beneficiaries,
        card,
        fixedDeposits,
        loans,
        notifications,
        unreadNotifCount,
        tickets,
        sessions,
        auditLogs,
        refreshData,
        executeTransfer,
        addBeneficiary,
        deleteBeneficiary,
        updateCardStatus,
        updateCardLimits,
        openFixedDeposit,
        applyLoan,
        markNotificationRead,
        markAllNotificationsRead,
        createSupportTicket,
        replySupportTicket,
        revokeSession,
      }}
    >
      {children}
    </BankingContext.Provider>
  );
};

export const useBanking = () => {
  const context = useContext(BankingContext);
  if (!context) {
    throw new Error('useBanking must be used within a BankingProvider');
  }
  return context;
};
