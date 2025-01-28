import { Injectable } from '@angular/core';
import { basePrompt } from './basePrompts';
import { Prompt } from '../models/prompt.model';

@Injectable({
  providedIn: 'root'
})
export class BasePromptService {

  constructor() {}

  getBasePrompts(): Prompt[] {
    return basePrompt.prompts;
  }

  getBasePromptFolders() {
    return basePrompt.folders;
  }

}
