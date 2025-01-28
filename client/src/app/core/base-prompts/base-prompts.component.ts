import { Component, OnInit } from '@angular/core';
import { BasePromptService } from 'src/app/services/base-prompt.service';
import { Folder } from 'src/app/services/folders.service';
import { IonItem, IonLabel, IonItemDivider, IonAccordionGroup, IonAccordion, IonIcon } from "@ionic/angular/standalone";
import { Prompt } from 'src/app/models/prompt.model';
import { PromptFilterPipe } from "./prompt-filter.pipe";
import { addIcons } from 'ionicons';
import { documentTextOutline } from 'ionicons/icons';

@Component({
  selector: 'app-base-prompts',
  templateUrl: './base-prompts.component.html',
  styleUrls: ['./base-prompts.component.scss'],
  standalone: true,
  imports: [IonIcon, IonAccordion, IonAccordionGroup, IonItemDivider, IonLabel, IonItem, PromptFilterPipe]
})
export class BasePromptsComponent  implements OnInit {
  folders: Folder[] = [];
  basePrompts: Prompt[] = [];

  constructor(private basePromptService: BasePromptService) {
    addIcons({documentTextOutline});
  }

  ngOnInit() {
    this.folders = this.basePromptService.getBasePromptFolders();
    this.basePrompts = this.basePromptService.getBasePrompts();
    console.log(this.basePrompts);
  }

}
