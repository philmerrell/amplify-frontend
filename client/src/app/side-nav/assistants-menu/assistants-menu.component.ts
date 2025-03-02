import { Component, inject, input, OnInit, ResourceStatus } from '@angular/core';
import { IonMenu } from '@ionic/angular';
import { IonIcon, ModalController, IonItem, IonLabel, IonBadge, IonButtons, IonButton, IonList, IonPopover, IonSkeletonText } from "@ionic/angular/standalone";
import { addIcons } from 'ionicons';
import { addOutline, documentOutline, ellipsisVertical, ellipsisHorizontal, trashOutline, createOutline } from 'ionicons/icons';
import { CustomInstructionsComponent } from './components/custom-instructions/custom-instructions.component';
import { AssistantService } from 'src/app/side-nav/assistants-menu/assistant.service';
import { CreateCustomInstructionsComponent } from './components/create-custom-instructions/create-custom-instructions.component';
import { CreateAssistantModalComponent } from './components/create-assistant-modal/create-assistant-modal.component';
import { AssistantListComponent } from './components/assistant-list/assistant-list.component';

@Component({
  selector: 'app-assistants-menu',
  templateUrl: './assistants-menu.component.html',
  styleUrls: ['./assistants-menu.component.scss'],
  standalone: true,
  imports: [AssistantListComponent, IonLabel, IonItem, IonIcon, CustomInstructionsComponent]
})
export class AssistantsMenuComponent  implements OnInit {
  readonly menu = input<IonMenu>();
  private modalController: ModalController = inject(ModalController);
  
  constructor() {
    addIcons({addOutline});
  }

  ngOnInit() {}

  async presentCreateNewAssistantModal() {
    const modal = await this.modalController.create({
      component: CreateAssistantModalComponent
    });
    await modal.present();
  }

  async presentCreateCustomInstructionsModal() {
    const modal = await this.modalController.create({
      component: CreateCustomInstructionsComponent
    })

    modal.present();
  }

}
