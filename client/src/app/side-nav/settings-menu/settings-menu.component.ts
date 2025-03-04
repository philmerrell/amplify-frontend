import { AsyncPipe } from '@angular/common';
import { Component, Input, inject, OnInit, Signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { IonPopover } from '@ionic/angular/common';
import { IonRouterLink, IonList, IonItem, IonLabel, IonIcon, IonSelect, IonSelectOption } from "@ionic/angular/standalone";
import { addIcons } from 'ionicons';
import { documentsOutline, hammerOutline, logOutOutline } from 'ionicons/icons';
import { Observable } from 'rxjs';
import { ColorMode, ThemeService } from 'src/app/services/theme.service';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-settings-menu',
  templateUrl: './settings-menu.component.html',
  styleUrls: ['./settings-menu.component.scss'],
  imports: [AsyncPipe, IonIcon, IonList, IonItem, IonLabel, RouterLink, IonRouterLink, FormsModule, IonSelect, IonSelectOption],
  standalone: true,
})
export class SettingsMenuComponent  implements OnInit {
  @Input() popover!: IonPopover;
  private authService = inject(AuthService);
  paletteToggle: boolean = false;
  theme$: Observable<ColorMode>;

  constructor(private themeService: ThemeService) {
    addIcons({documentsOutline,hammerOutline,logOutOutline});
    this.theme$ = this.themeService.theme$;
  }

  dismiss() {
    this.popover.dismiss();
  }

  logout() {
    this.authService.logout();
    this.dismiss();
  }

  ngOnInit() {  }

  handleThemeChange(ev: any) {
    const value = ev.detail.value;
    this.themeService.changeTheme(value);
  }
}
