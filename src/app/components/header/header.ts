import { Component, effect, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { ProductsService } from '../../services/products.service';

@Component({
  selector: 'my-price-header',
  standalone: true,
  imports: [FormsModule, RouterLink, RouterLinkActive],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  private router = inject(Router);
  private productsService = inject(ProductsService);

  searchQuery: string = '';

  constructor() {
    effect(() => {
      if (this.productsService.categoryChanged()) {
        this.searchQuery = '';
      }
    });
  }

  onSearch(): void {
    if (this.searchQuery.trim()) {
      const query = this.searchQuery.trim();
      this.router.navigate(['/search'], { queryParams: { query }, queryParamsHandling: 'merge' });
    }
  }
}
