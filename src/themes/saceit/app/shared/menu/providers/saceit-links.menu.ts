/**
 * SACEIT: our own links in the admin sidebar, configured at runtime in config.prod.yml
 * (saceit-cluster-deploy, services/dspace/config), so a new or moved target needs only a
 * config change and a UI restart, not a new image:
 *
 *   saceit:
 *     adminMenuLinks:
 *       - text: "Пакетний імпорт: інструкції"
 *         link: /handle/123456789/40
 *         icon: book            # Font Awesome name, optional
 *
 * Shown to site administrators and collection administrators (the repository's fillers are
 * collection admins); the target's own READ policy still decides who can open it. Texts are
 * shown as written: a string that is not a translation key is printed as is.
 * No links configured → nothing is added.
 *
 * Registered in src/app/app.menus.ts (MenuID.ADMIN) — the only upstream file this needs.
 */
import {
  Inject,
  Injectable,
} from '@angular/core';
import {
  APP_CONFIG,
  AppConfig,
} from '@dspace/config/app-config.interface';
import { AuthorizationDataService } from '@dspace/core/data/feature-authorization/authorization-data.service';
import { FeatureID } from '@dspace/core/data/feature-authorization/feature-id';
import {
  combineLatest,
  map,
  Observable,
} from 'rxjs';

import { MenuItemType } from '../../../../../../app/shared/menu/menu-item-type.model';
import {
  AbstractMenuProvider,
  PartialMenuSection,
} from '../../../../../../app/shared/menu/menu-provider.model';

export interface SaceitMenuLink {
  text: string;
  link: string;
  icon?: string;
}

@Injectable()
export class SaceitLinksMenuProvider extends AbstractMenuProvider {
  constructor(
    protected authorizationService: AuthorizationDataService,
    @Inject(APP_CONFIG) protected appConfig: AppConfig,
  ) {
    super();
  }

  public getSections(): Observable<PartialMenuSection[]> {
    const configured: SaceitMenuLink[] = (this.appConfig as any)?.saceit?.adminMenuLinks ?? [];
    const links = configured.filter((l) => l?.text && l?.link);
    return combineLatest([
      this.authorizationService.isAuthorized(FeatureID.AdministratorOf),
      this.authorizationService.isAuthorized(FeatureID.IsCollectionAdmin),
    ]).pipe(
      map(([isSiteAdmin, isCollectionAdmin]: [boolean, boolean]) => links.map((l) => ({
        visible: isSiteAdmin || isCollectionAdmin,
        model: {
          type: MenuItemType.LINK,
          text: l.text,
          link: l.link,
        },
        icon: l.icon || 'book',
      }) as PartialMenuSection)),
    );
  }
}
