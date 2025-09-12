import { Routes } from '@angular/router';
import { PagesComponent } from './pages/pages';

export const routes: Routes = [
  {
    path:'pages', component: PagesComponent, title:'Interface'
  },
  {
        path:'**', redirectTo: 'pages'

  }
];
