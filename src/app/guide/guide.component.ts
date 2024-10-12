import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-guide',
  standalone: true,
  template: `
    <a routerLink="/guide">guide</a>
  `, 
  imports: [RouterLink, RouterOutlet],
  templateUrl: './guide.component.html',
  styleUrl: './guide.component.scss'
})
export class GuideComponent {

}
