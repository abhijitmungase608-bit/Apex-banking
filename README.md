# APEX BANKING (apexbank.in)
> **Banking Beyond Limits.**  
> Real Digital Banking Web Application & Installable PWA for India.

---

## 🌟 Executive Overview

**APEX BANKING** is an enterprise-grade digital banking web application and PWA engineered specifically for Indian retail and SME banking customers. Designed with a premium light theme palette (Royal Blue `#246BFD`, Dark Blue `#102A56`, White `#FFFFFF`, and Crisp Slate `#F5F8FD`), it provides an institutional-grade financial experience adhering to Reserve Bank of India (RBI) and National Payments Corporation of India (NPCI) standards.

---

## 🚀 Key Features & Modules

### 1. Customer Application (24 Full Modules)
1. **Splash Screen**: Animated institutional brand loading with 256-bit SSL verification badge.
2. **Welcome Page**: Modern Apple-style fintech onboarding highlighting UPI 2.0, zero-fee IMPS, virtual RuPay debit, and high-yield FDs.
3. **Registration**: Paperless account onboarding with Aadhaar/PAN regulatory consent.
4. **Login**: Secure credentials login with quick one-click sandbox test account fill.
5. **Two-Factor Authentication (OTP)**: 6-digit challenge verification with sandbox pre-filled code `123456`.
6. **Forgot Password**: Self-service recovery with email/SMS token dispatch.
7. **Customer Dashboard**:
   - Total & available balance with balance visibility toggle (`Show/Hide Balances`).
   - Personalized welcome banner with KYC approval badge.
   - Quick action ribbon: Send Money, UPI Pay, Receive (QR Code modal), Download Statement.
   - RuPay Signature debit card preview.
   - Monthly spending analytics via Recharts area graph.
   - Linked accounts quick switcher.
   - Real-time double-entry transaction feed.
8. **Account Overview**: Comprehensive portfolio breakdown across Savings, Current, and Term Deposits.
9. **Account Details**: Official bank coordinates (Account number, IFSC `APEX0001088`, UPI VPA, Pune Home Branch, registered nominee, DICGC insurance coverage up to ₹5,00,000).
10. **Money Transfer**: Domestic funds transfer with unified channel selector, real balance deduction, and payment receipt.
11. **Instant UPI Payment**: NPCI UPI 2.0 module with live VPA format and handle verification (`user@okhdfcbank`, `merchant@icici`, `swiggy@icici`).
12. **IMPS / NEFT / RTGS**: High-value interbank clearing with instant **₹1.00 Penny-Drop recipient account verification**.
13. **Beneficiary Management**: Save, verify, tag, and manage daily transfer limits for bank accounts and UPI VPAs.
14. **Transaction History**: Searchable, filterable ledger history with export capabilities.
15. **Transaction Details**: Detailed payment receipt showing deterministic state machine progression (`CREATED -> PENDING -> PROCESSING -> SUCCESS`).
16. **Download Statements**: Digitally signed e-statements in PDF, Excel (.xlsx), and CSV formats.
17. **Debit Card Management**: Interactive 3D RuPay Signature card with flip toggle for CVV, daily ATM & online spending limit sliders, domestic/international toggles, contactless NFC toggle, and ATM PIN reset.
18. **Loan Services**: Interactive EMI calculator (Principal, interest rate, tenure) and pre-approved instant disbursal directly into the primary account.
19. **Fixed Deposit Services**: Term deposit calculator with quarterly compound returns up to 8.10% p.a. and instant booking.
20. **Notifications**: Categorized alert center (Transactions, Security, Special Offers, System Updates).
21. **Customer Support 24x7**: Built-in intelligent AI Banking Assistant bot, support ticket creation, toll-free contact (`1800 209 8899`), and RBI Grievance Redressal details.
22. **User Profile**: Full KYC level, PAN, masked Aadhaar, residential address manager.
23. **Security Settings**: MFA toggle, Touch ID / Face ID biometric toggle, password update, and RBI compliance safeguards.
24. **Device Management**: Real-time active device sessions, IP tracking, and remote session revocation.

---

### 2. Admin & Regulatory Compliance Portal (`/admin`)
- **Admin Dashboard**: System telemetry, 24-hour settlement flow charts, switch latency (142ms), fraud risk indices.
- **Customer & KYC Queue**: Video-KYC application reviews with NSDL PAN matching and one-click Approve/Reject with regulatory audit notes.
- **Transaction Monitoring**: Live clearing switch feed with bank RRNs and provider response codes.
- **Fraud & Risk Analytics**: AI-driven heuristic anomaly detection and risk scoring.
- **Support Redressal Desk**: Formal customer dispute resolution and admin response composition.
- **Daily Settlement Reconciliation**: Automated 3-way matching between Core Banking, NPCI UPI, and RBI NEFT.
- **Compliance Audit Trail**: Cryptographic log of all logins, approvals, and financial transactions.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, TypeScript, Vite, Tailwind CSS, Lucide React, Framer Motion, Recharts, Canvas Confetti |
| **PWA** | Web App Manifest (`manifest.json`), Offline Service Worker (`sw.js`), Apple Touch Icon |
| **Data Layer** | Double-Entry Immutable Core Ledger, Local Storage Persistence, State Machine Engine |
| **Database Schema** | PostgreSQL Enterprise Schema defined with Prisma ORM (`prisma/schema.prisma`) |
| **API Specification** | Comprehensive REST API Specification (`docs/API_SPECIFICATION.md`) |
| **Architecture** | System Architecture Blueprint (`docs/ARCHITECTURE.md`) |

---

## 🔑 Demo Sandbox Credentials

### Retail Customer
- **Identifier**: `rahul.sharma@apexbank.in`
- **Password**: `Password@123`
- **MFA Sandbox OTP**: `123456`

### Compliance Admin
- **Identifier**: `admin.aditi@apexbank.in`
- **Password**: `AdminSecurity#2026`
- **Direct Portal**: Navigate to `/admin` or click "Open Admin Portal" in the user dropdown.

---

## 🏃 Running the Application

```bash
# Install dependencies
npm install

# Start Vite development server
npm run dev

# Build production bundle
npm run build

# Preview production build
npm run preview
```
