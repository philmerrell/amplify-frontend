import { Component, input, OnInit } from '@angular/core';
import { IonMenu } from '@ionic/angular';
import { IonButton, IonIcon, ModalController } from "@ionic/angular/standalone";
import { addIcons } from 'ionicons';
import { addOutline } from 'ionicons/icons';
import { CustomInstructionsComponent } from './components/custom-instructions/custom-instructions.component';
import { CreatePromptTemplateComponent } from './components/create-prompt-template/create-prompt-template.component';

@Component({
  selector: 'app-assistants-menu',
  templateUrl: './assistants-menu.component.html',
  styleUrls: ['./assistants-menu.component.scss'],
  standalone: true,
  imports: [IonButton, IonIcon, CustomInstructionsComponent]
})
export class AssistantsMenuComponent  implements OnInit {
  readonly menu = input<IonMenu>();
  
  constructor(private modalController: ModalController) {
    addIcons({addOutline});
  }

  ngOnInit() {}

  createNewAssistant() {
    
  }

  async presentCreatePromptTemplateModal() {
    const modal = await this.modalController.create({
      component: CreatePromptTemplateComponent
    })

    modal.present();
  }

}
