export interface FamilyMember {
  name: string;
  relation: string;
  phone?: string;
  ageOrDob?: string;
  gender?: "Male" | "Female";
}

export interface Member {
  id: string;
  name: string;
  email: string;
  role: string;
  phone: string;
  family: FamilyMember[];
  familyCount?: number;
  createdAt: string;
}
