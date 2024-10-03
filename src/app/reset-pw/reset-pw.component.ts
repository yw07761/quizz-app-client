import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-reset-pw',
  standalone: true,
  template: `
    <a routerLink="/login">login</a>
  `, 
  imports: [RouterLink, RouterOutlet],
  templateUrl: './reset-pw.component.html',
  styleUrl: './reset-pw.component.scss'
})
export class ResetPWComponent {

}
