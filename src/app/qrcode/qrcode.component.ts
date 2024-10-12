import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-qrcode',
  standalone: true,
  template: `
    <a routerLink="/login">login</a>
  `, 
  imports: [RouterLink, RouterOutlet],
  templateUrl: './qrcode.component.html',
  styleUrl: './qrcode.component.scss'
})
export class QRcodeComponent {

}
