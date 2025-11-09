import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'my-price-header',
  standalone: true,
  imports: [FormsModule, RouterLink, RouterLinkActive],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  searchQuery: string = '';

  onSearch(): void {
    if (this.searchQuery.trim()) {
      console.log('Searching for:', this.searchQuery);
      // TODO: Implement search functionality
    }
  }
}
