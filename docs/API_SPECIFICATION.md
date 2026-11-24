# APEX BANKING - REST API SPECIFICATION
**Version:** 1.0.0  
**Base URL:** `/api/v1`

---

## 1. Authentication & Security Headers

| Header | Description |
|---|---|
| `Authorization` | `Bearer <JWT_ACCESS_TOKEN>` |
| `Idempotency-Key` | Required for all state-mutating payment and transfer operations (`UUIDv4`) |
| `X-Device-Fingerprint` | Client hardware/browser fingerprint hash |
| `X-Apex-Sandbox` | `true` indicates execution in sandbox environment |

---

## 2. API Endpoints Catalog

### Auth & Security
- `POST /auth/register` - Create new customer credentials
- `POST /auth/login` - Initiate password login, triggers OTP if MFA is active
- `POST /auth/verify-otp` - Verify 6-digit OTP and issue JWT session
- `POST /auth/refresh-token` - Renew expired access tokens
- `POST /auth/forgot-password` - Request password reset token
- `POST /auth/reset-password` - Update password with reset verification token
- `GET /auth/sessions` - List all active device sessions
- `DELETE /auth/sessions/:sessionId` - Revoke remote session

### Customer & KYC
- `GET /customer/profile` - Fetch authenticated customer profile
- `PUT /customer/profile` - Update non-sensitive profile information
- `GET /kyc/status` - Inquire KYC document status
- `POST /kyc/submit` - Submit Aadhaar/PAN documents for verification

### Accounts & Statements
- `GET /accounts` - List all linked accounts (Savings, Current, FDs)
- `GET /accounts/:id` - Detailed account balance, IFSC, branch information
- `GET /accounts/:id/statement` - Fetch filtered statement or export PDF/CSV

### Payments & Money Transfers
- `POST /transfers/initiate` - Create transaction with idempotency key
  - Body: `{ sourceAccountId, counterpartyType: 'UPI'|'NEFT'|'IMPS'|'RTGS', recipientIdentifier, amount, remarks }`
- `GET /transfers/:id/status` - Poll or verify deterministic payment state
- `POST /transfers/verify-vpa` - Verify recipient UPI VPA before payment
- `POST /transfers/penny-drop` - Validate recipient bank account & IFSC

### Beneficiaries
- `GET /beneficiaries` - Retrieve saved beneficiaries
- `POST /beneficiaries` - Save new beneficiary with verification
- `DELETE /beneficiaries/:id` - Remove beneficiary

### Cards Management
- `GET /cards` - List user virtual/physical debit cards (masked credentials)
- `PATCH /cards/:id/status` - Block / Unblock / Freeze card
- `PUT /cards/:id/limits` - Update ATM, POS, and Online e-commerce limits

### Deposits & Loans
- `GET /deposits/fd/rates` - Get current FD interest rate slab
- `POST /deposits/fd/open` - Open instant Fixed Deposit
- `GET /loans/eligibility` - Check loan eligibility & calculate EMI
- `POST /loans/apply` - Submit loan application

### Admin & Compliance
- `GET /admin/dashboard-stats` - Core banking health, transaction volume, liquidity
- `GET /admin/kyc/pending` - Pending KYC applications queue
- `POST /admin/kyc/:id/review` - Approve or reject KYC with reason
- `GET /admin/transactions/monitor` - Live transaction feed & fraud alerts
- `GET /admin/audit-logs` - Immutable compliance audit trail
- `GET /admin/reconciliation` - Daily settlement reconciliation reports
