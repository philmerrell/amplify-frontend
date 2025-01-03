import { Component, input, OnInit } from '@angular/core';
import { IonIcon, IonCard, IonItem, IonButton, IonLabel, IonItemDivider, IonList, IonText, IonMenu } from "@ionic/angular/standalone";

@Component({
  selector: 'app-share-menu',
  templateUrl: './share-menu.component.html',
  styleUrls: ['./share-menu.component.scss'],
  imports: [IonText, IonList, IonItemDivider, IonLabel, IonButton, IonCard, IonItem, IonIcon, IonText],
  standalone: true,
})
export class ShareMenuComponent  implements OnInit {
  readonly menu = input<IonMenu>();

  constructor() { }

  ngOnInit() {}

  closeMenu() {
    this.menu()?.close();
  }

}
