import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  // Use a BehaviorSubject to store the current theme; default to 'theme-dark'
  private themeSubject = new BehaviorSubject<string>('theme-dark');
  currentTheme$ = this.themeSubject.asObservable();

  private backgroundImageSubject = new BehaviorSubject<string>('/images/waves-dark.svg');
  currentBackgroundImage$ = this.backgroundImageSubject.asObservable();

  setTheme(theme: string): void {
    this.themeSubject.next(theme);

    const bgImg = document.getElementById('bgImage') as HTMLImageElement | null;
    if(bgImg){
      if (theme === 'theme-light') {
        bgImg.src='/images/waves-light.svg';
      } else if (theme === 'theme-dark') {
        bgImg.src = '/images/waves-dark.svg';
      } else if (theme === 'theme-christmas') {
        bgImg.src = '/images/waves-christmas.svg';
      }else if (theme === 'theme-easter') {
        bgImg.src = '/images/waves-easter.svg';
      }
    }

    document.body.className = '';
    document.body.classList.add(theme);
  }
}
