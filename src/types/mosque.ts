// types/mosque.ts

export interface MosqueAddress {
  area?: string;
  city: string;
  district: string;
  postalCode?: string;
}

// types/mosque.ts
export interface MobileBankingAccount {
  _id?: string;
  provider: string;
  number?: string;        // <--- Matches your DB field JSON
  accountNumber?: string; // Fallback
}

export interface DonationAccounts {
  mobileBanking: MobileBankingAccount[];
  bankDetails: {
    bankName?: string;
    accountName?: string;
    accountNumber?: string;
    routing?: string;
    routingNumber?: string;
  };
}

export interface FinanceSettings {
  currency: string;
  fiscalYearStart: string;
  zakatNisabAutoFetch: boolean;
  donationAccounts: DonationAccounts;
}
export interface MosqueContact {
  phone?: string;
  email?: string | null;
  whatsapp?: string;
}

export interface PrayerSettings {
  calculationMethod: string;
  jummahTime: string;
  timezone: string;
}

 

export interface FinanceSettings {
  currency: string;
  fiscalYearStart: string;
  zakatNisabAutoFetch: boolean;
  donationAccounts: DonationAccounts;
}

export interface MosqueSubscription {
  planId: "free" | "basic" | "premium" | string;
}

export interface IMosque {
  _id: string;
  name: string;
  logoUrl?: string;      
  coverUrl?: string;
  slug: string;
  status: "ACTIVE" | "INACTIVE" | "SUSPENDED" | string;
  address: MosqueAddress;
  contact?: MosqueContact;
  imamName?: string;
  capacity?: number;
  prayerSettings?: PrayerSettings;
  financeSettings?: FinanceSettings;
  subscription?: MosqueSubscription;
  createdBy: string;
  createdAt: string | Date;
  updatedAt: string | Date;
  __v?: number;
}