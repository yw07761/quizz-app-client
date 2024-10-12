import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-terms',
  standalone: true,
  template: `
    <a routerLink="/terms">terms</a>
  `, 
  imports: [RouterLink, RouterOutlet],
  templateUrl: './terms.component.html',
  styleUrl: './terms.component.scss'
})
export class TermsComponent {
    email: string = 'support@example.com';

}
