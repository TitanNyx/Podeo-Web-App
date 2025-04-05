import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../theme.service';

interface Podcast {
  id: number;
  userId: number;
  mp3Url: string;
  imageUrl: string;
  name: string
}

interface PodcastResponse {
  link: string;
}

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})

export class DashboardComponent {

  newPodcast = {mp3Url: '', imageUrl: '', name: ''};

  podcasts : Podcast[] = [];
  userId: number = -1;
  generatedLink: string = '';
  buttonClass: string = "btn btn-primary me-2";
  toastMessage: string = '';
  toastVisible: boolean = false;
  private apiUrl = 'http://localhost:3000/api/podcasts';

  constructor(private router: Router, private http: HttpClient,private themeService: ThemeService) {
    this.themeService.currentTheme$.subscribe(theme => {
      this.updateAppearance(theme);
    });
  }

  ngOnInit() {
    if (typeof localStorage !== 'undefined') {
      const token = localStorage.getItem("token");
    if(!token) {
      this.router.navigate(['/login']);
    }
    const usrId = localStorage.getItem("userId")
    if(usrId) {
      this.userId = parseFloat(usrId);
      this.fetchPodcasts(this.userId);
    }
    }
    
  }

  onGenerateLink(): void {
    const userId = localStorage.getItem('userId');
    // Prepare the payload for the API
    const payload = { userId: Number(userId), ...this.newPodcast };
    this.http.post<PodcastResponse>(this.apiUrl, payload).subscribe({
      next: (response) => {
        // Construct the shareable link using window.location.origin and the form values
        const baseUrl = window.location.origin;
        // The podcastId can be added as an extra parameter if needed
        this.generatedLink = `${baseUrl}?mp3Url=${this.newPodcast.mp3Url}&imageUrl=${this.newPodcast.imageUrl}&name=${this.newPodcast.name}`;
        // Refresh the list of podcasts
        this.fetchPodcasts(this.userId);
      },
      error: (err) => {
        console.error('Error generating podcast record:', err);
      }
    });
  }

  playPodcast(podcast: Podcast): void {
    const baseUrl = window.location.origin;
    const shareableLink = `${baseUrl}?mp3Url=${encodeURIComponent(podcast.mp3Url)}&imageUrl=${encodeURIComponent(podcast.imageUrl)}&name=${encodeURIComponent(podcast.name)}`;
    window.location.href = shareableLink;
  }

  copyLink(): void {
    if (this.generatedLink) {
      navigator.clipboard.writeText(this.generatedLink)
        .then(() => this.showToast('Link copied to clipboard!'))
        .catch(err => console.error('Failed to copy link:', err));
    }
  }

  deletePodcast(podcastId: number): void {
    this.http.delete<{ message: string }>(`${this.apiUrl}/${podcastId}`).subscribe({
      next: () => {
        this.podcasts = this.podcasts.filter(p => p.id !== podcastId);
        this.showToast('Podcast deleted successfully.');
      },
      error: (err) => {
        console.error('Error deleting podcast:', err);
        this.showToast('Failed to delete podcast.');
      }
    });
  }

  fetchPodcasts(userId: number): void {
    this.http.get<{ podcasts: Podcast[] }>(`${this.apiUrl}/${userId}`).subscribe({
      next: (response) => {
        this.podcasts = response.podcasts;
      },
      error: (err) => {
        console.error('Error fetching podcasts:', err);
      }
    });
  }

  private updateAppearance(theme: string): void {
    if (theme === 'theme-light') {
      this.buttonClass = "btn btn-dark me-2";
    } else if (theme === 'theme-dark') {
      this.buttonClass = "btn btn-primary me-2";
    } else if (theme === 'theme-christmas') {
      this.buttonClass = "btn btn-danger me-2";
    }
  }

  showToast(message: string, duration: number = 3000): void {
    this.toastMessage = message;
    this.toastVisible = true;
    setTimeout(() => {
      this.toastVisible = false;
    }, duration);
  }

  hideToast(): void {
    this.toastVisible = false;
  }

}

