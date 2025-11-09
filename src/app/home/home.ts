import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'my-price-home',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home { }
