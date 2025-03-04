import { Component, OnInit } from '@angular/core';
import { IonList, IonCardContent, IonCardHeader, IonCardSubtitle, IonItem, IonLabel, IonButton } from "@ionic/angular/standalone";

@Component({
  selector: 'app-help-card',
  templateUrl: './help-card.component.html',
  styleUrls: ['./help-card.component.scss'],
  standalone: true,
  imports: [IonButton, IonLabel, IonItem, IonCardSubtitle, IonCardHeader, IonCardContent, IonList]
})
export class HelpCardComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}
