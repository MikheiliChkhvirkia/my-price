export interface Store {
  title: string;
  color: string;
  imageUrl: string;
  link: string;
}

export interface Category {
  [storeKey: string]: Store;
}

export interface SettingsResponse {
  storeCount: number;
  storeSetting: {
    [key: string]: Store;
  };
  categorizedStores: {
    [categoryKey: string]: {
      [storeKey: string]: Store;
    };
  };
  categories: {
    [key: string]: Store;
  };
}