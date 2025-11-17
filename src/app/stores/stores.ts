import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreCard } from '../components/store-card/store-card';
import { SettingsService } from '../services/settings.service';
import { SettingsResponse, Store } from '../interfaces/settings.interface';

@Component({
  selector: 'my-price-stores',
  standalone: true,
  imports: [CommonModule, StoreCard],
  templateUrl: './stores.html',
  styleUrl: './stores.scss',
})
export class Stores implements OnInit {
  private settingsService = inject(SettingsService);
  protected stores = signal<Array<{ key: string; store: Store }>>([]);
  protected loading = signal<boolean>(true);
  protected error = signal<string | null>(null);

  ngOnInit(): void {
    this.loadStores();
  }

  protected loadStores(): void {
    this.loading.set(true);
    this.error.set(null);

    this.settingsService.getSettings().subscribe({
      next: (settings: SettingsResponse) => {
        const storesArray: Array<{ key: string; store: Store }> = [];

        if (settings.storeSetting) {
          Object.keys(settings.storeSetting).forEach((key) => {
            storesArray.push({
              key,
              store: settings.storeSetting[key],
            });
          });
        }

        this.stores.set(storesArray);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('მაღაზიების ჩატვირთვა ვერ მოხერხდა. სცადეთ ხელახლა მოგვიანებით.');
        this.loading.set(false);
      },
    });
  }
}

