import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-documentation',
  standalone: true,
  imports: [],
  templateUrl: './documentation.html',
  styleUrl: './documentation.scss'
})
export class Documentation {
  private router = inject(Router);

  goBack() {
    this.router.navigate(['/workflows']);
  }
}
