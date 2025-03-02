import { Component, inject, OnInit } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonContent, IonFooter, ModalController, IonBackButton } from "@ionic/angular/standalone";

@Component({
  selector: 'app-advanced-settings',
  templateUrl: './advanced-settings.component.html',
  styleUrls: ['./advanced-settings.component.scss'],
  standalone: true,
  imports: [IonBackButton, IonFooter, IonContent, IonButton, IonButtons, IonTitle, IonToolbar, IonHeader, ]
})
export class AdvancedSettingsComponent  implements OnInit {
  private modalController: ModalController = inject(ModalController);
  constructor() { }

  ngOnInit() {}

  dismiss() {
    this.modalController.dismiss();
  }

}
