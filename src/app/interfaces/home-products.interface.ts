export interface StoreEvent {
    event: 'store';
    data: StoreData;
  }
  
  export interface StoreData {
    store: number;
    products: Product[];
  }
  
  export interface Product {
    name: string;
    price: number;
    salePrice: number;
    url: string;
    imageUrl: string;
    source: number;
    productKey: string;
    relevanceScore: number;
  }
  