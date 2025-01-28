import { Pipe, PipeTransform } from '@angular/core';
import { Prompt } from 'src/app/models/prompt.model';

@Pipe({
  name: 'promptFilter',
  standalone: true
})
export class PromptFilterPipe implements PipeTransform {

  transform(prompts: Prompt[], folderId: string): Prompt[] {
    const filteredPrompts = prompts.filter(p => p.folderId === folderId);
    return filteredPrompts;
  }

}
