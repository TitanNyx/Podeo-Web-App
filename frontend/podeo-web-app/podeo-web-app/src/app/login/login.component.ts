import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AuthService, LoginResponse } from '../auth.service';
import { ThemeService } from '../theme.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  errorMessage: string = '';
  loginButton: string = "btn btn-primary me-2";


  constructor(private authService: AuthService, private router: Router, private themeService: ThemeService,) {
    this.themeService.currentTheme$.subscribe(theme => {
      // You can update navClass and logoUrl here too if you wish.
      this.updateAppearance(theme);
    });
  }

  private updateAppearance(theme: string): void {
    if (theme === 'theme-light') {
      this.loginButton = "btn btn-dark me-2";
    } else if (theme === 'theme-dark') {
      this.loginButton = "btn btn-primary me-2";
    } else if (theme === 'theme-christmas') {
      this.loginButton = "btn btn-danger me-2";
    }
  }

  onSubmit(): void {
    this.errorMessage = '';
    this.authService.login(this.username, this.password).subscribe({
      next: (response: LoginResponse) => {
        // Save the token (for example, in local storage)
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem('token', response.token);
          localStorage.setItem('userId', response.userId);
        }
        // Update the login state in the AuthService
        this.authService.setLoggedIn(true);
        // Optionally navigate to the dashboard
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        console.error('Login error:', err);
        // Set the errorMessage property based on the API response or a generic message
        this.errorMessage = err.error?.error || 'Login failed. Please try again.';
      }
    });
  }
}
