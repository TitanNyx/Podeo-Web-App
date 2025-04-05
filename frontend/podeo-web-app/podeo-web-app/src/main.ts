/// <reference types="@angular/localize" />

import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { routes } from './app/app.routes';


bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideHttpClient()
  ]
}).catch(err => console.error(err));

  const bgImg = document.getElementById('bgImage') as HTMLImageElement | null;
    if(bgImg){
        bgImg.src = '/images/waves-dark.svg';
      }

    document.body.classList.add('theme-dark');
