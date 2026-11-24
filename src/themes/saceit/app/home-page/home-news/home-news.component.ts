import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';
import { MarkdownViewerComponent } from 'src/app/shared/markdown-viewer/markdown-viewer.component';

import { HomeNewsComponent as BaseComponent } from '../../../../../app/home-page/home-news/home-news.component';

@Component({
  selector: 'ds-themed-home-news',
  styleUrls: ['./home-news.component.scss'],
  templateUrl: './home-news.component.html',
  imports: [
    AsyncPipe,
    MarkdownViewerComponent,
  ],
})

/**
 * SACEIT home news: the repository intro on the navy brand band. An admin can
 * replace it without a release: Edit site → "home news" (Markdown).
 */
export class HomeNewsComponent extends BaseComponent {}
