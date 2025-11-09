import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoryCard } from '../components/category-card/category-card';
import { SettingsService } from '../services/settings.service';
import { SettingsResponse, Store } from '../interfaces/settings.interface';

@Component({
  selector: 'my-price-categories',
  standalone: true,
  imports: [CommonModule, CategoryCard],
  templateUrl: './categories.html',
  styleUrl: './categories.scss',
})
export class Categories implements OnInit {
  private settingsService = inject(SettingsService);
  protected categories = signal<Array<{ key: string; category: Store }>>([]);
  protected loading = signal<boolean>(true);
  protected error = signal<string | null>(null);

  ngOnInit(): void {
    this.loadCategories();
  }

  protected loadCategories(): void {
    this.loading.set(true);
    this.error.set(null);

    this.settingsService.getSettings().subscribe({
      next: (settings: SettingsResponse) => {
        const categoriesArray: Array<{ key: string; category: Store }> = [];

        if (settings.categories) {
          Object.keys(settings.categories).forEach((key) => {
            categoriesArray.push({
              key,
              category: settings.categories[key],
            });
          });
        }

        this.categories.set(categoriesArray);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error loading categories:', err);
        this.error.set('კატეგორიების ჩატვირთვა ვერ მოხერხდა. სცადეთ ხელახლა მოგვიანებით.');
        this.loading.set(false);
      },
    });
  }
}
