import { Component, OnInit } from '@angular/core';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonFooter, IonButton, IonIcon, ModalController } from '@ionic/angular/standalone';
import { ChatInputComponent } from './components/chat-input/chat-input.component';
import { ModelSettingsComponent } from './components/model-settings/model-settings.component';
import { addIcons } from 'ionicons';
import { chevronForwardOutline } from 'ionicons/icons';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, IonFooter, IonButton, IonIcon, ChatInputComponent, ModelSettingsComponent]
})
export class HomePage implements OnInit {
  
  constructor(private modalController: ModalController) {
    addIcons({chevronForwardOutline});
  }

  ngOnInit() {
  }

  async openModelSettingsModal() {
    const modal = await this.modalController.create({
      component: ModelSettingsComponent,
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();

  }

  

}
