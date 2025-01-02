import { Component, OnInit } from '@angular/core';
import { IonIcon, IonCard, IonItem, IonButton, IonLabel, IonItemDivider, IonList } from "@ionic/angular/standalone";

@Component({
  selector: 'app-share-menu',
  templateUrl: './share-menu.component.html',
  styleUrls: ['./share-menu.component.scss'],
  imports: [IonList, IonItemDivider, IonLabel, IonButton, IonCard, IonItem, IonIcon],
  standalone: true,
})
export class ShareMenuComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}
