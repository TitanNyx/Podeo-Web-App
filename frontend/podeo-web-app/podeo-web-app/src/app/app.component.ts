import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { ThemeService } from './theme.service';
import { Router, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet,HeaderComponent,CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'podeo-web-app';
  backgroundImage: string = '';
  loading: boolean = true;
  private navStartTime: number = 0;
  private minSplashDuration: number = 2000;
  constructor(private themeService: ThemeService, private router: Router) {
    this.themeService.currentBackgroundImage$.subscribe(image => {
      this.backgroundImage = image;
    });
  }

  ngOnInit(): void {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.loading = true;
        this.navStartTime = Date.now();
      } else if (
        event instanceof NavigationEnd ||
        event instanceof NavigationCancel ||
        event instanceof NavigationError
      ) {
        const elapsed = Date.now() - this.navStartTime;
        const remainingTime = this.minSplashDuration - elapsed;
        if (remainingTime > 0) {
          setTimeout(() => {
            this.loading = false;
          }, remainingTime);
        } else {
          this.loading = false;
        }
      }
    });
  }

}
