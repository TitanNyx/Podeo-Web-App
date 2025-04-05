import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { ThemeService } from './theme.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,HeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'podeo-web-app';
  backgroundImage: string = '';

  constructor(private themeService: ThemeService) {
    this.themeService.currentBackgroundImage$.subscribe(image => {
      this.backgroundImage = image;
    });
  }

}
