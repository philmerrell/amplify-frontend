import { Component, inject, OnInit, Resource, ResourceStatus } from '@angular/core';
import { AssistantService } from '../../assistant.service';
import { IonIcon, IonLabel, IonSkeletonText, IonItem, IonList, IonPopover, IonButton, IonSpinner } from "@ionic/angular/standalone";
import { AlertController, ToastController } from '@ionic/angular';
import { Assistant } from 'src/app/models/assistant.model';

@Component({
  selector: 'app-assistant-list',
  templateUrl: './assistant-list.component.html',
  styleUrls: ['./assistant-list.component.scss'],
  standalone: true,
  imports: [IonSpinner, IonButton, IonPopover, IonList, IonItem, IonSkeletonText, IonLabel, IonIcon]
})
export class AssistantListComponent  implements OnInit {
  private alertController: AlertController = inject(AlertController);
  private assistantService: AssistantService = inject(AssistantService);
  private toastController: ToastController = inject(ToastController);

  assistantResource: Resource<any[]> = this.assistantService.assistantResource;
  status = ResourceStatus;
  pendingAssistantDeleteId: string = '';
    
  constructor() { }

  ngOnInit() {}

  async presentDeleteAlert(assistantId: string, popover: IonPopover) {
    popover.dismiss();

    const alert = await this.alertController.create({
      header: 'Confirm Delete',
      message: 'Are you sure you want to delete this assistant?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Delete canceled');
          }
        }, {
          text: 'Delete',
          handler: () => {
            this.deleteAssistant(assistantId);
          }
        }
      ]
    });

    await alert.present();
  }

  private async deleteAssistant(assistantId: string) {
    this.pendingAssistantDeleteId = assistantId;
    const response = await this.assistantService.deleteAssistant(assistantId);
    this.pendingAssistantDeleteId = '';
    this.presentToast(response.message, response.success ? 'dark' : 'danger');
  }

  async presentToast(message: string, color: string = 'dark', duration: number = 3000) {
    const toast = await this.toastController.create({
      message,
      color,
      duration
    });

    await toast.present();
  }

}
