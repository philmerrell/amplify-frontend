import { Component, OnInit, Signal } from '@angular/core';
import { CustomInstructionService } from 'src/app/services/custom-instruction.service';
import { Folder } from 'src/app/services/folders.service';
import { IonItem, IonLabel, IonItemDivider, IonAccordionGroup, IonAccordion, IonIcon } from "@ionic/angular/standalone";
import { Prompt } from 'src/app/models/prompt.model';
import { PromptFilterPipe } from "./prompt-filter.pipe";
import { addIcons } from 'ionicons';
import { documentTextOutline } from 'ionicons/icons';

@Component({
  selector: 'app-custom-instructions',
  templateUrl: './custom-instructions.component.html',
  styleUrls: ['./custom-instructions.component.scss'],
  standalone: true,
  imports: [IonIcon, IonAccordion, IonAccordionGroup, IonItemDivider, IonLabel, IonItem, PromptFilterPipe]
})
export class CustomInstructionsComponent  implements OnInit {
  folders: Folder[] = [];
  customInstructions: Signal<Prompt[]> = this.customInstructionService.getCustomInstructions();;

  constructor(private customInstructionService: CustomInstructionService) {
    addIcons({documentTextOutline});
  }

  ngOnInit() {
    this.folders = this.customInstructionService.getBasePromptFolders();
    console.log(this.customInstructions());
  }

  selectPromptTemplate(template: Prompt) {
    console.log(template);
  }

}
