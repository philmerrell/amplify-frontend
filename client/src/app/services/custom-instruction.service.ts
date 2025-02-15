import { Injectable, Signal, signal, WritableSignal } from '@angular/core';
import { basePrompt } from './basePrompts';
import { Prompt } from '../models/prompt.model';

@Injectable({
  providedIn: 'root'
})
export class CustomInstructionService {
  private customInstructions: WritableSignal<Prompt[]> = signal(basePrompt.prompts as Prompt[]); //
  private selectedCustomInstruction: WritableSignal<Prompt> = signal(basePrompt.prompts[0] as Prompt); //
  
  constructor() {}

  getCustomInstructions(): Signal<Prompt[]> {
    return this.customInstructions;
  }

  setCustomInstructions() {

  }

  getSelectedCustomInstruction(): Signal<Prompt> {
    return this.selectedCustomInstruction;
  }

  setSelectedCustomInstruction(instruction: Prompt) {
    this.selectedCustomInstruction.set(instruction);
  }

  getBasePromptFolders() {
    return basePrompt.folders;
  }

}
