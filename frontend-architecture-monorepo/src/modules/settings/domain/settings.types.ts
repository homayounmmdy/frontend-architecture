export interface AccountProfile {
  storeName: string;
  supportEmail: string;
  currency: string;
  timezone: string;
}

export interface Account {
  id: string;
  name: string;
  slug: string;
  profile: AccountProfile;
}

export interface SettingsData {
  shipping: {
    defaultCarrier: string;
    standardRate: number;
    expressRate: number;
  };
  taxes: {
    pricesIncludeTax: boolean;
    nexusRegion: string;
    defaultRate: number;
  };
  notifications: {
    lowStock: boolean;
    orderAlerts: boolean;
    weeklyDigest: boolean;
  };
}
