import { Component, input } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '../../interfaces/settings.interface';

@Component({
  selector: 'my-price-store-card',
  standalone: true,
  imports: [],
  templateUrl: './store-card.html',
  styleUrl: './store-card.scss',
})
export class StoreCard {
  store = input.required<Store>();
  storeKey = input<string>('');

  constructor(private router: Router) {}

  onStoreClick(): void {
    const storeKey = this.storeKey();
    if (storeKey) {
      this.router.navigate(['/search'], { queryParams: { store: storeKey } });
    } else {
      this.router.navigate(['/search']);
    }
  }
}

