export interface ProductEntry {
  id: string;
  productName: string;
  category: string;
  costPrice: number;
  sellingPrice: number;
  quantity: number;
  gstPercentage: number;
  totalSale: number;
  totalCost: number;
  gstAmount: number;
  profit: number;
  date: string;
}

export interface UserProfile {
  name: string;
  email: string;
}

export interface AdminSettings {
  upiId: string;
  premiumPrice: number;
}

export interface AppState {
  entries: ProductEntry[];
  isPremium: boolean;
  isAdmin: boolean;
  userProfile: UserProfile;
  adminSettings: AdminSettings;
}
