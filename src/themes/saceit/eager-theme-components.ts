import { FooterComponent } from './app/footer/footer.component';
import { HeaderComponent } from './app/header/header.component';
import { HomeNewsComponent } from './app/home-page/home-news/home-news.component';

/**
 * SACEIT theme: components shown on every page (loaded eagerly). Everything
 * not overridden here comes from the `dspace` theme (config: `extends: dspace`).
 */
/* eslint-disable dspace-angular-ts/themed-component-usages */
export const COMPONENTS = [
  HeaderComponent,
  FooterComponent,
  HomeNewsComponent,
];
