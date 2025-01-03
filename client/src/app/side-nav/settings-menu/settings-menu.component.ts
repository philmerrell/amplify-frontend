import { Component, input, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonRouterLink, IonList, IonItem, IonLabel, IonItemDivider, IonIcon, IonMenu } from "@ionic/angular/standalone";
import { addIcons } from 'ionicons';
import { documentsOutline, hammerOutline } from 'ionicons/icons';

@Component({
  selector: 'app-settings-menu',
  templateUrl: './settings-menu.component.html',
  styleUrls: ['./settings-menu.component.scss'],
  imports: [IonIcon, IonItemDivider, IonList, IonItem, IonLabel, RouterLink, IonRouterLink],
  standalone: true,
})
export class SettingsMenuComponent  implements OnInit {
  readonly menu = input<IonMenu>();

  constructor() {
    addIcons({documentsOutline,hammerOutline});
  }

  ngOnInit() {}

  closeMenu() {
    this.menu()?.close();
  }

}
