import { Component, input, OnInit } from '@angular/core';
import { IonMenu } from '@ionic/angular';
import { IonIcon, ModalController, IonItem, IonLabel } from "@ionic/angular/standalone";
import { addIcons } from 'ionicons';
import { addOutline } from 'ionicons/icons';
import { CustomInstructionsComponent } from './components/custom-instructions/custom-instructions.component';
import { AssistantService } from 'src/app/services/assistant.service';
import { CreateCustomInstructionsComponent } from './components/create-custom-instructions/create-custom-instructions.component';
import { CreateAssistantModalComponent } from './components/create-assistant-modal/create-assistant-modal.component';

@Component({
  selector: 'app-assistants-menu',
  templateUrl: './assistants-menu.component.html',
  styleUrls: ['./assistants-menu.component.scss'],
  standalone: true,
  imports: [IonLabel, IonItem, IonIcon, CustomInstructionsComponent]
})
export class AssistantsMenuComponent  implements OnInit {
  readonly menu = input<IonMenu>();
  
  constructor(private assistantService: AssistantService, private modalController: ModalController) {
    addIcons({addOutline});
  }

  ngOnInit() {
    this.getAssistants();
  }

  async presentCreateNewAssistantModal() {
    const modal = await this.modalController.create({
      component: CreateAssistantModalComponent
    });

    await modal.present();
  }

  async getAssistants() {
    const assistants = await this.assistantService.getAssistants();
    console.log(assistants);
  }

  async presentCreateCustomInstructionsModal() {
    const modal = await this.modalController.create({
      component: CreateCustomInstructionsComponent
    })

    modal.present();
  }

}
