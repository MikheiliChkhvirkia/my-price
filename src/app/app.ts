import { Component, inject, OnInit, signal } from '@angular/core';
import { Header } from './components/header/header';
import { CategoryCard } from './components/category-card/category-card';
import { SettingsService } from './services/settings.service';
import { SettingsResponse, Store } from './interfaces/settings.interface';

@Component({
  selector: 'app-root',
  imports: [Header, CategoryCard],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  private settingsService = inject(SettingsService);
  categories = signal<Array<{ key: string; category: Store }>>([]);
  loading = signal<boolean>(true);
  error = signal<string | null>(null);
  
  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.loading.set(true);
    this.error.set(null);
    
    this.settingsService.getSettings().subscribe({
      next: (settings: SettingsResponse) => {
        const categoriesArray: Array<{ key: string; category: Store }> = [];
        
        if (settings.categories) {
          Object.keys(settings.categories).forEach(key => {
            categoriesArray.push({
              key,
              category: settings.categories[key]
            });
          });
        }
        
        this.categories.set(categoriesArray);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error loading categories:', err);
        this.error.set('Failed to load categories. Please try again later.');
        this.loading.set(false);
      }
    });
  }
}
