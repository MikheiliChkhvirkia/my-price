import { Component, input } from '@angular/core';
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

  onCategoryClick(): void {
    const categoryValue = this.category();
    if (categoryValue && categoryValue.link) {
      window.open(categoryValue.link, '_blank');
    }
  }
}
