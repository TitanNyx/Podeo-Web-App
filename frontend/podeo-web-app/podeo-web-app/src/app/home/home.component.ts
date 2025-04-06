import { Component } from '@angular/core';
import { ThemeService } from '../theme.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  mp3Url: string = '';
  imageUrl: string = '';
  name: string = '';
  buttonClass: string = '';
  showAudioPlayer: boolean = false;

  constructor(private themeService:ThemeService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.themeService.currentTheme$.subscribe(theme => {
      this.themeService.currentTheme$.subscribe(theme => {
        this.updateAppearance(theme);
      });
    });

    this.route.queryParams.subscribe(params => {
      this.mp3Url = params['mp3Url'] || '';
      this.imageUrl = params['imageUrl'] || '';
      this.name = params['name'] || '';

      this.showAudioPlayer = !!this.mp3Url && !!this.imageUrl && !!this.name;
    })
  }

  surpriseMe(): void {
    const presetMp3Url = 'https://media.podeo.co/episodes/MjA0MDk/audio.mp3';
    const presetImage = 'https://media.podeo.co/podcasts/ODQwOQ/image.jpg?ivc=1699451666';
    const presetName = ' الأسلحة الرقمية - من هم مجموعة كيلنت';
    const baseUrl = window.location.origin;
    const queryParams = `?mp3Url=${encodeURIComponent(presetMp3Url)}&imageUrl=${encodeURIComponent(presetImage)}&name=${encodeURIComponent(presetName)}`;
    window.location.href = baseUrl + queryParams;
  }
  private updateAppearance(theme: string): void {
    if (theme === 'theme-light') {
      this.buttonClass = "btn btn-dark me-2";
    } else if (theme === 'theme-dark') {
      this.buttonClass = "btn btn-primary me-2";
    } else if (theme === 'theme-christmas') {
      this.buttonClass = "btn btn-danger me-2";
    }else if (theme === 'theme-easter') {
      this.buttonClass = "btn btn-info me-2";
    }
  }
}
