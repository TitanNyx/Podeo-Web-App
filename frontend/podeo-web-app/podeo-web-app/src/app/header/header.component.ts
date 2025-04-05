import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { ThemeService } from '../theme.service';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, NgbCollapseModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  isCollapsed = true;
  isLoggedIn = false;
  // Default classes and logo
  navClass: string = "navbar navbar-expand-lg navbar-dark bg-dark";
  logoUrl: string = "/images/podeo-logo.svg";
  loginButton: string = "btn btn-primary me-2";

  constructor(
    private themeService: ThemeService, 
    private router: Router, 
    private authService: AuthService
  ) {
    // Subscribe to theme changes
    this.themeService.currentTheme$.subscribe(theme => {
      this.updateAppearance(theme);
    });
    
    // Subscribe to authentication status
    this.authService.isLoggedIn$.subscribe(status => {
      console.log('function called');
      this.isLoggedIn = status;
    });
  }
  
  navigateHome(): void {
    console.log('go to home');
    this.router.navigate(['/']);
  }

  toggleCollapse(): void {
    this.isCollapsed = !this.isCollapsed;
  }

  login(): void {
    this.router.navigate(['/login']);
  }

  logout(): void {
    if (typeof localStorage !== 'undefined'){
      localStorage.removeItem("token");
    }
    this.isLoggedIn = false;
    this.router.navigate(['/login']);
  }

  switchTheme(theme: string): void {
    // Call the service to update the theme
    this.themeService.setTheme(theme);
    // Also update the header's appearance immediately
    this.updateAppearance(theme);
  }

  private updateAppearance(theme: string): void {
    if (theme === 'theme-light') {
      this.navClass = "navbar navbar-expand-lg navbar-light bg-light";
      this.logoUrl = "/images/podeo-logo-light.svg"; 
      this.loginButton = "btn btn-dark me-2";
    } else if (theme === 'theme-dark') {
      this.navClass = "navbar navbar-expand-lg navbar-dark bg-dark";
      this.logoUrl = "/images/podeo-logo.svg"; 
      this.loginButton = "btn btn-primary me-2";
    } else if (theme === 'theme-christmas') {
      this.navClass = "navbar navbar-expand-lg navbar-dark bg-dark";
      this.logoUrl = "/images/podeo-logo-christmas.svg"; 
      this.loginButton = "btn btn-danger me-2";
    }
  }
}
