import { Component, input, OnInit, Signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { IonRouterLink, IonList, IonItem, IonLabel, IonItemDivider, IonIcon, IonMenu, IonSelect, IonSelectOption } from "@ionic/angular/standalone";
import { addIcons } from 'ionicons';
import { documentsOutline, hammerOutline } from 'ionicons/icons';
import { ThemeService } from 'src/app/services/theme.service';

@Component({
  selector: 'app-settings-menu',
  templateUrl: './settings-menu.component.html',
  styleUrls: ['./settings-menu.component.scss'],
  imports: [IonIcon, IonItemDivider, IonList, IonItem, IonLabel, RouterLink, IonRouterLink, FormsModule, IonSelect, IonSelectOption],
  standalone: true,
})
export class SettingsMenuComponent  implements OnInit {
  readonly menu = input<IonMenu>();
  paletteToggle: boolean = false;
  theme: Signal<string> = this.themeService.getTheme();

  constructor(private themeService: ThemeService) {
    addIcons({documentsOutline,hammerOutline});
  }

  closeMenu() {
    this.menu()?.close();
  }

  ngOnInit() {

  }

  handleThemeChange(ev: any) {
    const value = ev.detail.value;
    this.themeService.setTheme(value);
  }

  

}
