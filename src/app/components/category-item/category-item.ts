import { Component, input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface CategoryItemData {
  key: string;
  title: string;
  imageUrl?: string;
  storeCount?: number;
}

@Component({
  selector: 'my-price-category-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './category-item.html',
  styleUrl: './category-item.scss',
})
export class CategoryItem {
  data = input.required<CategoryItemData>();
  selected = input<boolean>(false);
  @Output() select = new EventEmitter<string>();

  onClick(): void {
    this.select.emit(this.data().key);
  }
}


