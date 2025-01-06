import { Component, OnInit, Signal } from '@angular/core';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonFooter, IonButtons, ModalController, IonMenuButton, IonModal, IonButton } from '@ionic/angular/standalone';
import { ChatInputComponent } from './components/chat-input/chat-input.component';
import { ModelSettingsComponent } from './components/model-settings/model-settings.component';
import { addIcons } from 'ionicons';
import { chevronForwardOutline } from 'ionicons/icons';
import { ConversationService } from '../services/conversation.service';
import { Conversation } from '../models/conversation.model';
import { ChatRequestService } from './services/chat-request.service';
import { ModelService } from '../services/model.service';
import { Model } from '../models/model.model';
import { ConversationComponent } from './components/conversation/conversation.component';
import { DeveloperSettingsService } from '../settings/developer/developer-settings.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [IonButton, IonModal, 
    ConversationComponent,
    ModelSettingsComponent,
    IonContent, IonHeader, IonButtons, IonTitle, IonToolbar, IonFooter, ChatInputComponent, IonMenuButton ]
})
export class HomePage implements OnInit {
  currentConversation: Signal<Conversation> = this.conversationService.getCurrentConversation();
  chatLoading: Signal<boolean> = this.chatRequestService.getChatLoading();
  selectedModel: Signal<Model> = this.modelService.getSelectedModel();
  isModalOpen = false;

  constructor(
    private chatRequestService: ChatRequestService,
    private conversationService: ConversationService,
    private developerSettings: DeveloperSettingsService,
    private modalController: ModalController,
    private modelService: ModelService,
    private router: Router) {
    addIcons({chevronForwardOutline});
  }

  ngOnInit() {
    const chatEndpoint = this.developerSettings.getDeveloperChatEndpoint();
    const jwt = this.developerSettings.getDeveloperJwt();

    if(chatEndpoint() === '' || jwt() === '') {
      this.isModalOpen = true;
    }
  }

  navigateToDeveloperSettings() {
    this.modalController.dismiss();
    this.router.navigateByUrl('/settings/developer')
  }

  setOpen(isOpen: boolean) {
    this.isModalOpen = isOpen;
  }

  async openModelSettingsModal() {
    const modal = await this.modalController.create({
      component: ModelSettingsComponent,
    });
    modal.present();
  }

  

}
