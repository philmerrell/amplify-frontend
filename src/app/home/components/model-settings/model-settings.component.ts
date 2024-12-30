import { Component, OnInit, Signal } from '@angular/core';
import { IonButton, IonTitle, IonHeader, IonToolbar, IonContent, IonItem, IonSelect, IonSelectOption, IonLabel, IonRange, IonCard, ModalController } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { Model } from 'src/app/models/model.model';
import { ModelService } from 'src/app/services/model.service';

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
  models: Model[] = [];
  selectedModel: Signal<Model> = this.modelService.getSelectedModel();
  selectedTemperature: Signal<number> = this.modelService.getSelectedTemperature();

  constructor(private modalController: ModalController, private modelService: ModelService) { }

  ngOnInit() {
    this.getModels();
  }

  dismiss() {
    this.modalController.dismiss();
  }

  getModels() {
    this.models = this.modelService.getModels();
    console.log(this.models);
  }

  handleModelChange(event: any) {
    const model = event.detail.value;
    this.modelService.setSelectedModel(model);
  }

  handleTempChange(event: any) {
    const temperature = event.detail.value;
    console.log(temperature);
    this.modelService.setSelectedTemperature(temperature);
  }

  pinFormatter(value: number) {
    return `${value}`;
  }

}
