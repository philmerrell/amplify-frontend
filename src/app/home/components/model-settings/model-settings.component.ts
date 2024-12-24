import { Component, OnInit } from '@angular/core';
import { IonButton, IonTitle, IonHeader, IonToolbar, IonContent, IonItem, IonSelect, IonSelectOption, IonLabel, IonRange, IonCard, ModalController } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';

@Component({
  selector: 'app-model-settings',
  templateUrl: './model-settings.component.html',
  styleUrls: ['./model-settings.component.scss'],
  standalone: true,
  imports: [IonButton, IonTitle, IonHeader, IonToolbar, IonContent, IonCard, IonItem, IonSelect, IonSelectOption, IonLabel, IonRange]
})
export class ModelSettingsComponent  implements OnInit {
  customPopoverOptions = {
    header: 'Models',
    subHeader: 'Select a model',
  };
  constructor(private modalController: ModalController) { }

  ngOnInit() {}

  dismiss() {
    this.modalController.dismiss();
  }

}
