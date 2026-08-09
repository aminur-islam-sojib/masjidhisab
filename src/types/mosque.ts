// types/mosque.ts

export interface MosqueAddress {
  area?: string;
  city: string;
  district: string;
  postalCode?: string;
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

export interface DonationAccounts {
  mobileBanking: Array<{
    provider?: string;
    accountNumber?: string;
    accountType?: string;
  }>;
  bankDetails: {
    bankName?: string;
    accountName?: string;
    accountNumber?: string;
    branchName?: string;
    routingNumber?: string;
  };
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