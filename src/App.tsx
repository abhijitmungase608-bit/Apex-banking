import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { BankingProvider } from './context/BankingContext';

// Customer Layout & Pages
import { AppLayout } from './components/layout/AppLayout';
import { SplashScreen } from './pages/customer/SplashScreen';
import { WelcomePage } from './pages/customer/WelcomePage';
import { RegisterPage } from './pages/customer/RegisterPage';
import { LoginPage } from './pages/customer/LoginPage';
import { OtpVerificationPage } from './pages/customer/OtpVerificationPage';
import { ForgotPasswordPage } from './pages/customer/ForgotPasswordPage';
import { DashboardPage } from './pages/customer/DashboardPage';
import { AccountOverviewPage } from './pages/customer/AccountOverviewPage';
import { AccountDetailsPage } from './pages/customer/AccountDetailsPage';
import { MoneyTransferPage } from './pages/customer/MoneyTransferPage';
import { UpiPaymentPage } from './pages/customer/UpiPaymentPage';
import { ImpsNeftRtgsPage } from './pages/customer/ImpsNeftRtgsPage';
import { BeneficiaryManagementPage } from './pages/customer/BeneficiaryManagementPage';
import { TransactionHistoryPage } from './pages/customer/TransactionHistoryPage';
import { TransactionDetailsPage } from './pages/customer/TransactionDetailsPage';
import { DownloadStatementsPage } from './pages/customer/DownloadStatementsPage';
import { DebitCardManagementPage } from './pages/customer/DebitCardManagementPage';
import { LoanServicesPage } from './pages/customer/LoanServicesPage';
import { FixedDepositServicesPage } from './pages/customer/FixedDepositServicesPage';
import { NotificationsPage } from './pages/customer/NotificationsPage';
import { CustomerSupportPage } from './pages/customer/CustomerSupportPage';
import { UserProfilePage } from './pages/customer/UserProfilePage';
import { SecuritySettingsPage } from './pages/customer/SecuritySettingsPage';
import { DeviceManagementPage } from './pages/customer/DeviceManagementPage';
import { KycVerificationPage } from './pages/customer/KycVerificationPage';

// Admin Layout & Pages
import { AdminLayout } from './pages/admin/AdminLayout';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { CustomerManagementPage } from './pages/admin/CustomerManagementPage';
import { TransactionMonitoringPage } from './pages/admin/TransactionMonitoringPage';
import { ReconciliationPage } from './pages/admin/ReconciliationPage';
import { AuditLogsPage } from './pages/admin/AuditLogsPage';
import { FraudAlertsPage } from './pages/admin/FraudAlertsPage';
import { SupportRedressalPage } from './pages/admin/SupportRedressalPage';

// Simple Route Guard
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <BankingProvider>
          <Routes>
            {/* 1. Splash & Onboarding */}
            <Route path="/" element={<SplashScreen />} />
            <Route path="/splash" element={<SplashScreen />} />
            <Route path="/welcome" element={<WelcomePage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/otp-verification" element={<OtpVerificationPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />

            {/* Customer Authenticated Routes */}
            <Route
              element={
                <ProtectedRoute>
                  <AppLayout />
                </ProtectedRoute>
              }
            >
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/accounts" element={<AccountOverviewPage />} />
              <Route path="/accounts/details" element={<AccountDetailsPage />} />
              <Route path="/transfer" element={<MoneyTransferPage />} />
              <Route path="/upi" element={<UpiPaymentPage />} />
              <Route path="/imps-neft-rtgs" element={<ImpsNeftRtgsPage />} />
              <Route path="/beneficiaries" element={<BeneficiaryManagementPage />} />
              <Route path="/transactions" element={<TransactionHistoryPage />} />
              <Route path="/transactions/:id" element={<TransactionDetailsPage />} />
              <Route path="/statements" element={<DownloadStatementsPage />} />
              <Route path="/cards" element={<DebitCardManagementPage />} />
              <Route path="/loans" element={<LoanServicesPage />} />
              <Route path="/deposits" element={<FixedDepositServicesPage />} />
              <Route path="/notifications" element={<NotificationsPage />} />
              <Route path="/support" element={<CustomerSupportPage />} />
              <Route path="/profile" element={<UserProfilePage />} />
              <Route path="/security" element={<SecuritySettingsPage />} />
              <Route path="/devices" element={<DeviceManagementPage />} />
              <Route path="/kyc" element={<KycVerificationPage />} />
            </Route>

            {/* Admin Routes */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboardPage />} />
              <Route path="customers" element={<CustomerManagementPage />} />
              <Route path="transactions" element={<TransactionMonitoringPage />} />
              <Route path="fraud" element={<FraudAlertsPage />} />
              <Route path="support" element={<SupportRedressalPage />} />
              <Route path="reconciliation" element={<ReconciliationPage />} />
              <Route path="audit" element={<AuditLogsPage />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </BankingProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
