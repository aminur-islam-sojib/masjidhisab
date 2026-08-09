import mongoose, { Document, Schema, Model, Types } from "mongoose";

// ==========================================
// 1. TypeScript Interface
// ==========================================
export interface IMosque extends Document {
  name: string;
  slug: string;
  status: "ACTIVE" | "SUSPENDED" | "PENDING";

  address: {
    area?: string;
    city: string;
    district: string;
    postalCode?: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };

  contact: {
    phone?: string;
    email?: string;
    whatsapp?: string;
  };

  socialLinks: {
    facebook?: string;
    website?: string;
  };

  establishedYear?: number;
  imamName?: string;
  capacity?: number;
  logoUrl?: string;
  coverUrl?: string; // <-- Added

  prayerSettings: {
    calculationMethod: string;
    jummahTime?: string;
    timezone: string;
  };

  financeSettings: {
    currency: string;
    fiscalYearStart: string;
    zakatNisabAutoFetch: boolean;
    receiptCounter: number;
    donationAccounts: {
      mobileBanking: Array<{ provider: string; number: string }>;
      bankDetails?: {
        bankName: string;
        accountName: string;
        accountNumber: string;
        routing?: string;
      };
    };
  };

  subscription: {
    planId: string;
    stripeCustomerId?: string;
    expiresAt?: Date;
  };

  createdBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

// ==========================================
// 2. Mongoose Schema
// ==========================================
const MosqueSchema: Schema<IMosque> = new Schema(
  {
    name: { type: String, required: true, trim: true },

    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    status: {
      type: String,
      enum: ["ACTIVE", "SUSPENDED", "PENDING"],
      default: "ACTIVE",
    },

    address: {
      area: { type: String, trim: true },
      city: { type: String, required: true, trim: true },
      district: { type: String, required: true, trim: true },
      postalCode: { type: String, trim: true },
      coordinates: {
        lat: { type: Number },
        lng: { type: Number },
      },
    },

    contact: {
      phone: { type: String, trim: true },
      email: { type: String, trim: true, lowercase: true },
      whatsapp: { type: String, trim: true },
    },

    socialLinks: {
      facebook: { type: String, trim: true },
      website: { type: String, trim: true },
    },

    establishedYear: { type: Number },
    imamName: { type: String, trim: true },
    capacity: { type: Number },
    logoUrl: { type: String, trim: true },
    coverUrl: { type: String, trim: true }, // <-- Added

    prayerSettings: {
      calculationMethod: {
        type: String,
        default: "UniversityOfIslamicSciencesKarachi",
      },
      jummahTime: { type: String, trim: true },
      timezone: { type: String, default: "Asia/Dhaka" },
    },

    financeSettings: {
      currency: { type: String, default: "BDT" },
      fiscalYearStart: { type: String, default: "July" },
      zakatNisabAutoFetch: { type: Boolean, default: false },
      receiptCounter: { type: Number, default: 1000 },
      donationAccounts: {
        mobileBanking: [
          {
            provider: { type: String, trim: true },
            number: { type: String, trim: true },
          },
        ],
        bankDetails: {
          bankName: { type: String, trim: true },
          accountName: { type: String, trim: true },
          accountNumber: { type: String, trim: true },
          routing: { type: String, trim: true },
        },
      },
    },

    subscription: {
      planId: { type: String, default: "free" },
      stripeCustomerId: { type: String, trim: true },
      expiresAt: { type: Date },
    },

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// ==========================================
// 3. Model Export
// ==========================================
export const Mosque: Model<IMosque> =
  mongoose.models.Mosque || mongoose.model<IMosque>("Mosque", MosqueSchema);