import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductItem } from '../components/product-item/product-item';
import { SettingsService } from '../services/settings.service';
import { SettingsResponse, Store } from '../interfaces/settings.interface';
import { ProductsService } from '../services/products.service';
import { Product } from '../interfaces/home-products.interface';

interface ProductWithStore {
  product: Product;
  store: Store | null;
}

@Component({
  selector: 'my-price-home',
  standalone: true,
  imports: [CommonModule, ProductItem],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home implements OnInit {
  private settingsService = inject(SettingsService);
  private productsService = inject(ProductsService);

  protected products = signal<ProductWithStore[]>([]);
  protected categories = signal<string[]>([]);
  protected loading = signal<boolean>(true);
  protected productsLoading = signal<boolean>(true);
  protected error = signal<string | null>(null);
  protected storeMap = signal<Map<number, Store>>(new Map());

  ngOnInit(): void {
    this.loadSettings();
    this.loadProducts();
  }

  protected loadSettings(): void {
    this.loading.set(true);
    this.error.set(null);

    this.settingsService.getSettings().subscribe({
      next: (settings: SettingsResponse) => {
        // Build store map from store number to Store object
        const storeMap = new Map<number, Store>();
        if (settings.storeSetting) {
          Object.entries(settings.storeSetting).forEach(([key, store]) => {
            const storeNumber = parseInt(key, 10);
            if (!isNaN(storeNumber)) {
              storeMap.set(storeNumber, store);
            }
          });
        }
        this.storeMap.set(storeMap);

        // Load category names
        const names = settings?.categories
          ? Object.values(settings.categories)
              .map((category) => category.title)
              .filter((title): title is string => Boolean(title?.trim()))
          : [];

        this.categories.set(names);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error loading settings:', err);
        this.error.set('კატეგორიების ჩატვირთვა ვერ მოხერხდა. სცადეთ ხელახლა მოგვიანებით.');
        this.loading.set(false);
      },
    });
  }

  protected loadProducts(): void {
    this.productsLoading.set(true);
    
    this.productsService.getAllProducts().subscribe({
      next: (products: Product[]) => {
        const storeMap = this.storeMap();
        const productsWithStore: ProductWithStore[] = products.map(product => ({
          product,
          store: storeMap.get(product.source) || null
        }));
        
        this.products.set(productsWithStore);
        this.productsLoading.set(false);

        console.log(this.products());
      },
      error: (error) => {
        console.error('Error receiving products stream:', error);
        this.productsLoading.set(false);
      },
      complete: () => {
        console.log('Products stream completed');
        this.productsLoading.set(false);
      }
    });
  }
}
