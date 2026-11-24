# APEX BANKING - SYSTEM ARCHITECTURE DOCUMENTATION
**Tagline:** Banking Beyond Limits  
**Version:** 1.0.0 (Production Blueprint with Sandbox Environment)  
**Target Market:** India (RBI Compliance, NPCI UPI, IMPS/NEFT/RTGS Standards)

---

## 1. Executive Summary & Design Principles

APEX BANKING is an enterprise-grade digital banking web application and PWA engineered for Indian retail and SME banking customers. The system is designed following strict core banking architecture standards:

1. **Dual-Entry Immutable Ledger**: Balances are calculated by summing unalterable ledger entries; balances are never directly manipulated by arbitrary database updates.
2. **Deterministic Transaction State Machine**: All payment flows follow:
   `CREATED -> PENDING -> PROCESSING -> SUCCESS / FAILED / REVERSED`
3. **Strict Idempotency**: All transfer requests require an `Idempotency-Key` header with TTL and status caching to prevent duplicate payments under network retries.
4. **Zero Simulated Balance Pretence**: Real banking integration requires authorized banking partners (e.g. Yes Bank, ICICI, RazorpayX, Decentro). In the absence of live production credentials, all transactions run via authenticated, high-fidelity Sandbox Adapters with prominent visual badges (`SANDBOX MODE`).
5. **Security & Data Minimization**:
   - Zero storage of UPI PINs, ATM PINs, CVVs, or unencrypted passwords.
   - Device binding, MFA (TOTP / SMS OTP), session revocation, signed webhooks with HMAC SHA-256.

---

## 2. System Architecture Diagram

```
+---------------------------------------------------------------------------------+
|                         CLIENT LAYER (PWA / Mobile / Desktop)                   |
|  - React 18 + Vite + TypeScript + Tailwind CSS                                  |
|  - Offline-ready Service Worker + Local Storage State Sync                      |
|  - Responsive Glassmorphic Light UI (#246BFD / #102A56 / #F5F8FD)               |
+---------------------------------------------------------------------------------+
                                       |
                              HTTPS / REST / WSS
                                       |
+---------------------------------------------------------------------------------+
|                         API GATEWAY & SECURITY LAYER                            |
|  - Rate Limiting (Token Bucket)                                                 |
|  - CSRF & Secure Cookie Authentication (JWT + Refresh Tokens)                   |
|  - Idempotency Interceptor & Request Validation                                 |
|  - Role-Based Access Control (Customer vs Admin vs Auditor)                     |
+---------------------------------------------------------------------------------+
                                       |
+---------------------------------------------------------------------------------+
|                       MODULAR CORE BANKING BACKEND                              |
|  +-----------------------+ +-----------------------+ +-----------------------+  |
|  | Authentication Module | | Customer & KYC Module | | Account & Cards Module|  |
|  +-----------------------+ +-----------------------+ +-----------------------+  |
|  +-----------------------+ +-----------------------+ +-----------------------+  |
|  | Payment Engine        | | Immutable Ledger      | | Beneficiary Service   |  |
|  | - UPI 2.0 Handler     | | - Double-Entry Engine | | - Bank Account / VPA  |  |
|  | - IMPS/NEFT/RTGS      | | - Real-time Balance   | | - Penny Drop Check    |  |
|  +-----------------------+ +-----------------------+ +-----------------------+  |
|  +-----------------------+ +-----------------------+ +-----------------------+  |
|  | Fraud Monitoring Svc  | | Reconciliation Svc    | | Audit & Compliance Log|  |
|  +-----------------------+ +-----------------------+ +-----------------------+  |
+---------------------------------------------------------------------------------+
                                       |
+---------------------------------------------------------------------------------+
|                   PROVIDER ADAPTER LAYER (Sandbox / Live Switch)                |
|  - Banking Partner Switch (Core Banking Host, NPCI Switch, IMPS/NEFT Engine)    |
|  - UPI Switch Adapter (VPA verification, collect, push, QR generation)          |
|  - KYC & Identity Adapter (Aadhaar e-KYC, PAN Verification via NSDL)            |
|  - Card Issuing Partner (RuPay / Visa tokenized controls)                       |
|  - Notification Switch (SMS Gateway via DLT, Email via SES)                     |
+---------------------------------------------------------------------------------+
                                       |
+---------------------------------------------------------------------------------+
|                        PERSISTENCE & RECONCILIATION                             |
|  - PostgreSQL Database (with Prisma ORM)                                        |
|  - Redis Cache & Distributed Lock (Idempotency, Session management)             |
|  - Immutable Audit Event Stream & Signed Webhook Storage                        |
+---------------------------------------------------------------------------------+
```

---

## 3. Transaction State Machine & Life Cycle

Every financial transfer strictly transitions through:

1. **CREATED**: The customer initiates transfer. An idempotency key is generated (`IDEMP_{UUID}`). Input validation occurs (Account number, IFSC checksum, VPA regex).
2. **PENDING**: Balance sufficiency pre-authorization check passes. Source account balance holds the transfer amount + statutory charges.
3. **PROCESSING**: Request is dispatched to the banking switch adapter (NPCI UPI / RBI IMPS / NEFT). Idempotency key locks execution.
4. **FINAL STATES**:
   - **SUCCESS**: Positive webhook / synchronous ACK received. Ledger entry posted (Debit source, Credit settlement/destination). Beneficiary credited.
   - **FAILED**: Bank switch rejected (Insufficient funds, invalid beneficiary, switch timeout). Hold released. Zero balance mutation.
   - **REVERSED**: Delayed rejection / chargeback received post-success. New reversal ledger entry created. Original records remain immutable.

---

## 4. Sandbox vs Live Strategy

To adhere strictly to regulatory compliance:
- Production mode connects solely to RBI-regulated Schedule Commercial Bank APIs via secure mutual TLS (mTLS) with dedicated HSM signing.
- In Sandbox mode, mock adapters emulate network latencies (400ms - 1500ms), simulated edge-case failures (insufficient funds, invalid IFSC, timeout, webhook delays), and penny-drop beneficiary validation.
- Visual banner "SANDBOX ENVIRONMENT - FOR VERIFIED TESTING ONLY" is persistent in test mode.
