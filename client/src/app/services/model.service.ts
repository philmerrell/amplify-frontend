import { Injectable, signal, Signal, WritableSignal } from '@angular/core';
import { Model, ModelID, Models } from '../models/model.model';


@Injectable({
  providedIn: 'root'
})
export class ModelService {
  defaultModel = ModelID.CLAUDE_3_5_SONNET_v2
  selectedModel: WritableSignal<Model> = signal(Models[this.defaultModel]);
  selectedTemperature: WritableSignal<number> = signal(0.5);
  constructor() { }

  getModels(): Model[] {
    const models = Object.values(Models);
    return models.filter(model => model.visible);
  }

  getSelectedModel(): Signal<Model> {
    return this.selectedModel;
  }

  setSelectedModel(model: Model) {
    this.selectedModel.set(model)
  }

  getSelectedTemperature(): Signal<number> {
    return this.selectedTemperature;
  }

  setSelectedTemperature(temperature: number) {
    this.selectedTemperature.set(temperature);
  }
  
}
