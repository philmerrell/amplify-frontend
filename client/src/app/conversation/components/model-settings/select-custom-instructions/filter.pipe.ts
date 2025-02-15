import { Pipe, PipeTransform } from '@angular/core';
import { Prompt } from 'src/app/models/prompt.model';

@Pipe({
  name: 'filterInstructions',
  standalone: true
})
export class FilterInstructionsPipe implements PipeTransform {

  transform(prompts: Prompt[], type: string): Prompt[] {
    const filteredPrompts = prompts.filter(p => p.type === type);
    return filteredPrompts;
  }

}
