import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-privacy',
  standalone: true,
  template: `
    <a routerLink="/privacy">privacy</a>
  `, 
  imports: [RouterLink, RouterOutlet],
  templateUrl: './privacy.component.html',
  styleUrl: './privacy.component.scss'
})
export class PrivacyComponent {
  email: string = 'support@example.com';

}
