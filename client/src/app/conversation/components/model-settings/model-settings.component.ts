import { Component, OnInit, Signal } from '@angular/core';
import { IonButton, IonTitle, IonHeader, IonToolbar, IonContent, IonItem, IonSelect, IonSelectOption, IonLabel, IonRange, IonCard, ModalController, IonGrid, IonRow, IonCol, IonAccordionGroup, IonAccordion } from '@ionic/angular/standalone';
import { Model } from 'src/app/models/model.model';
import { ModelService } from 'src/app/services/model.service';
import { SelectCustomInstructionsComponent } from './select-custom-instructions/select-custom-instructions.component';
import { CustomInstructionService } from 'src/app/services/custom-instruction.service';
import { Prompt } from 'src/app/models/prompt.model';

@Component({
  selector: 'app-model-settings',
  templateUrl: './model-settings.component.html',
  styleUrls: ['./model-settings.component.scss'],
  standalone: true,
  imports: [IonAccordion, IonAccordionGroup, IonCol, IonRow, IonGrid, IonCard, IonItem, IonSelect, IonSelectOption, IonLabel, IonRange]
})
export class ModelSettingsComponent  implements OnInit {
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
