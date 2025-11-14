import { Component, input } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '../../interfaces/settings.interface';

@Component({
  selector: 'my-price-category-card',
  standalone: true,
  imports: [],
  templateUrl: './category-card.html',
  styleUrl: './category-card.scss',
})
export class CategoryCard {
  category = input.required<Store>();
  categoryKey = input<string>('');

  constructor(private router: Router) {}

  onCategoryClick(): void {
    const categoryKey = this.categoryKey();
    if (categoryKey) {
      this.router.navigate(['/search'], { queryParams: { category: categoryKey } });
    } else {
      this.router.navigate(['/search']);
    }
  }
}
