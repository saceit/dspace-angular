import {
  AsyncPipe,
  DatePipe,
} from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { FooterComponent as BaseComponent } from '../../../../app/footer/footer.component';

/**
 * SACEIT footer: navy band with the college seal, links to the college site
 * and the repository; below it DSpace's own line (credit, cookies, privacy …).
 */
@Component({
  selector: 'ds-themed-footer',
  styleUrls: ['../../../../app/footer/footer.component.scss', './footer.component.scss'],
  templateUrl: './footer.component.html',
  imports: [
    AsyncPipe,
    DatePipe,
    RouterLink,
    TranslateModule,
  ],
})
export class FooterComponent extends BaseComponent {
}
