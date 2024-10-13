import { Component } from '@angular/core';
import { Router, RouterLink, RouterOutlet, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-qrcode',
  standalone: true,
  template: `
    <a routerLink="/login">login</a>
  `, 
  imports: [RouterLink, RouterOutlet, RouterModule, FormsModule],
  templateUrl: './qrcode.component.html',
  styleUrl: './qrcode.component.scss'
})
export class QRcodeComponent {
  pincode: string ='';

  constructor(private router: Router) {}

  onSubmit(frm1: any) {
    if (!frm1.pincode) {
      alert('Please enter pincode!');
      return;
    }

    const pinCodeData = {
      pincode: frm1.pincode
    };

    console.log('Forgot Password Data:', pinCodeData);
    
    
    this.router.navigate(['/reset-password']);
  }
}
