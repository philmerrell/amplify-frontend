import { Component, OnInit } from '@angular/core';
import { IonCard, IonButton, IonIcon, IonList, IonItemDivider, IonItem, IonLabel, IonText } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { briefcaseOutline, shareSocialOutline, saveOutline, rocketOutline } from 'ionicons/icons';

@Component({
  selector: 'app-workspaces-menu',
  templateUrl: './workspaces-menu.component.html',
  styleUrls: ['./workspaces-menu.component.scss'],
  imports: [IonText, IonLabel, IonItem, IonItemDivider, IonList, IonIcon, IonButton, IonCard, IonText],
  standalone: true,
})
export class WorkspacesMenuComponent  implements OnInit {

  constructor() {
    addIcons({saveOutline,rocketOutline,briefcaseOutline,shareSocialOutline});
  }

  ngOnInit() {}

}
