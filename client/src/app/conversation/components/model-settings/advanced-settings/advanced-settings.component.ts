import { Component, OnInit, Signal } from '@angular/core';
import { IonItem, IonSelect, IonSelectOption, IonLabel, IonRange, ModalController, IonGrid, IonRow, IonCol, IonItemDivider, IonToolbar, IonTitle, IonHeader, IonContent, IonBackButton, IonButtons, IonButton } from '@ionic/angular/standalone';
import { Model } from 'src/app/models/model.model';
import { ModelService } from 'src/app/services/model.service';
import { CustomInstructionService } from 'src/app/services/custom-instruction.service';
import { Prompt } from 'src/app/models/prompt.model';
import { SelectCustomInstructionsComponent } from '../select-custom-instructions/select-custom-instructions.component';

@Component({
  selector: 'app-advanced-settings',
  templateUrl: './advanced-settings.component.html',
  styleUrls: ['./advanced-settings.component.scss'],
  standalone: true,
  imports: [IonButton, IonButtons, IonBackButton, IonContent, IonHeader, IonTitle, IonToolbar, IonItemDivider, IonCol, IonRow, IonGrid, IonItem, IonSelect, IonSelectOption, IonLabel, IonRange]
})
export class AdvancedSettingsComponent  implements OnInit {
  modelPopoverOptions = {
    header: 'Models',
    subHeader: 'Select a model',
  };
  customInstructionsPopoverOptions = {
    header: 'Custom Instructions',
    subHeader: 'Select instructions',
  };
  models: Model[] = [];
  selectedModel: Signal<Model> = this.modelService.getSelectedModel();
  selectedTemperature: Signal<number> = this.modelService.getSelectedTemperature();
  selectedCustomInstructions: Signal<Prompt> = this.customInstructionService.getSelectedCustomInstruction();
  customInstructions: Signal<Prompt[]> = this.customInstructionService.getCustomInstructions();

  constructor(
    private customInstructionService: CustomInstructionService,
    private modalController: ModalController,
    private modelService: ModelService) { }

  ngOnInit() {
    this.getModels();
  }

  dismiss() {
    this.modalController.dismiss();
  }

  async presentCustomInstructionsModal() {
    const modal = await this.modalController.create({
      component: SelectCustomInstructionsComponent,
      componentProps: {
        customInstructions: this.customInstructions
      }
    });
    modal.present();
  }

  getModels() {
    this.models = this.modelService.getModels();
  }

  getCustomInstructions() {
    this.customInstructions = this.customInstructionService.getCustomInstructions();
  }

  handleModelChange(event: any) {
    const model = event.detail.value;
    this.modelService.setSelectedModel(model);
  }

  handleTempChange(event: any) {
    const temperature = event.detail.value;
    this.modelService.setSelectedTemperature(temperature);
  }

  temperatureFormatter(value: number) {
    return value;
  }

}
