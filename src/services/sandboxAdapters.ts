// APEX BANKING - REALISTIC SANDBOX PROVIDER ADAPTERS
// Provides high-fidelity emulation of RBI, NPCI, and Banking Partner Switches
// Features real validation, realistic delays, penny-drop validation, and deterministic responses.

export interface AdapterResult<T> {
  success: boolean;
  code: string;
  message: string;
  data?: T;
  timestamp: string;
  providerRrn?: string;
}

export class SandboxAdapters {
  // 1. UPI Provider Switch (NPCI Emulation)
  static async verifyVpa(vpa: string): Promise<AdapterResult<{ name: string; vpa: string; bank: string }>> {
    await this.delay(400);

    const vpaRegex = /^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/;
    if (!vpaRegex.test(vpa)) {
      return {
        success: false,
        code: 'UPI_INVALID_FORMAT',
        message: 'Invalid Virtual Payment Address (VPA) format. Must be user@handle.',
        timestamp: new Date().toISOString(),
      };
    }

    // Mock known lookup
    const handles: Record<string, string> = {
      'okhdfcbank': 'HDFC Bank Ltd',
      'icici': 'ICICI Bank Ltd',
      'paytm': 'Paytm Payments Bank',
      'apex': 'APEX Digital Banking Switch',
      'ybl': 'Yes Bank Ltd',
      'sbi': 'State Bank of India',
      'axisbank': 'Axis Bank Ltd'
    };

    const parts = vpa.split('@');
    const handle = parts[1]?.toLowerCase() || 'bank';
    const bankName = handles[handle] || 'Authorized NPCI Partner Bank';
    
    // Capitalize username nicely
    const rawName = parts[0].replace(/[._-]/g, ' ');
    const formattedName = rawName.charAt(0).toUpperCase() + rawName.slice(1);

    return {
      success: true,
      code: '00_SUCCESS',
      message: 'VPA validated successfully via NPCI Directory',
      data: {
        name: formattedName + (formattedName.toLowerCase().includes('sharma') ? '' : ' (Verified Payee)'),
        vpa: vpa.toLowerCase(),
        bank: bankName,
      },
      timestamp: new Date().toISOString(),
      providerRrn: 'NPCI' + Math.floor(100000000000 + Math.random() * 900000000000),
    };
  }

  // 2. Bank Account & IFSC Validation + Penny Drop Service
  static async pennyDropVerification(accountNumber: string, ifscCode: string): Promise<AdapterResult<{ accountHolderName: string; bankName: string; branch: string }>> {
    await this.delay(650);

    const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
    if (!ifscRegex.test(ifscCode.toUpperCase())) {
      return {
        success: false,
        code: 'IFSC_INVALID',
        message: 'Invalid 11-digit IFSC code format according to RBI guidelines.',
        timestamp: new Date().toISOString(),
      };
    }

    if (accountNumber.length < 9 || accountNumber.length > 18) {
      return {
        success: false,
        code: 'ACCOUNT_INVALID_LENGTH',
        message: 'Indian bank account numbers must be between 9 and 18 digits.',
        timestamp: new Date().toISOString(),
      };
    }

    // Extract bank prefix from IFSC
    const prefix = ifscCode.substring(0, 4).toUpperCase();
    const bankMap: Record<string, string> = {
      'APEX': 'Apex Banking Corporation',
      'HDFC': 'HDFC Bank Ltd',
      'SBIN': 'State Bank of India',
      'ICIC': 'ICICI Bank Ltd',
      'UTIB': 'Axis Bank Ltd',
      'KKBK': 'Kotak Mahindra Bank',
      'PUNB': 'Punjab National Bank',
    };

    const bankName = bankMap[prefix] || `${prefix} Schedule Commercial Bank`;

    return {
      success: true,
      code: 'PENNY_DROP_MATCH_100',
      message: '₹1.00 Penny Drop verified recipient account successfully.',
      data: {
        accountHolderName: 'VERIFIED RECIPIENT (' + prefix + ' ACC)',
        bankName,
        branch: 'Central Clearing Hub',
      },
      timestamp: new Date().toISOString(),
      providerRrn: 'PD' + Math.floor(1000000000 + Math.random() * 9000000000),
    };
  }

  // 3. PAN and Aadhaar Verification
  static async verifyPan(panNumber: string): Promise<AdapterResult<{ name: string; panNumber: string; category: string }>> {
    await this.delay(500);
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    if (!panRegex.test(panNumber.toUpperCase())) {
      return {
        success: false,
        code: 'PAN_FORMAT_INVALID',
        message: 'Invalid Permanent Account Number (PAN). Must match 5 letters, 4 digits, 1 letter.',
        timestamp: new Date().toISOString(),
      };
    }

    return {
      success: true,
      code: 'NSDL_PAN_VALID',
      message: 'PAN status ACTIVE and verified against Income Tax Department records.',
      data: {
        name: 'RAHUL SHARMA',
        panNumber: panNumber.toUpperCase(),
        category: 'Individual',
      },
      timestamp: new Date().toISOString(),
    };
  }

  // 4. Send SMS / Email OTP Simulator
  static async sendOtp(target: string, type: 'SMS' | 'EMAIL'): Promise<AdapterResult<{ maskedTarget: string; validitySeconds: number }>> {
    await this.delay(350);
    const masked = type === 'SMS' 
      ? target.substring(0, 4) + '••••' + target.substring(target.length - 2)
      : target.substring(0, 2) + '••••@' + target.split('@')[1];

    return {
      success: true,
      code: 'OTP_DISPATCHED',
      message: `A secure 6-digit verification code has been dispatched to ${masked}. (Sandbox Demo Code: 123456)`,
      data: {
        maskedTarget: masked,
        validitySeconds: 300,
      },
      timestamp: new Date().toISOString(),
    };
  }

  private static delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
