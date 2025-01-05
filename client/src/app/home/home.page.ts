import { Component, OnInit, Signal } from '@angular/core';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonFooter, IonButton, IonButtons, ModalController, IonMenuButton } from '@ionic/angular/standalone';
import { ChatInputComponent } from './components/chat-input/chat-input.component';
import { ModelSettingsComponent } from './components/model-settings/model-settings.component';
import { addIcons } from 'ionicons';
import { chevronForwardOutline } from 'ionicons/icons';
import { ConversationService } from '../services/conversation.service';
import { Conversation } from '../models/conversation.model';
import { JsonPipe } from '@angular/common';
import { ChatRequestService } from './services/chat-request.service';
import { ModelService } from '../services/model.service';
import { Model } from '../models/model.model';
import { ConversationComponent } from './components/conversation/conversation.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [
    ConversationComponent,
    ModelSettingsComponent,
    IonContent, IonHeader, IonButtons, IonTitle, IonToolbar, IonFooter, IonButton, ChatInputComponent, IonMenuButton ]
})
export class HomePage implements OnInit {
  currentConversation: Signal<Conversation> = this.conversationService.getCurrentConversation();
  chatLoading: Signal<boolean> = this.chatRequestService.getChatLoading();
  selectedModel: Signal<Model> = this.modelService.getSelectedModel();

  constructor(
    private chatRequestService: ChatRequestService,
    private conversationService: ConversationService,
    private modalController: ModalController,
    private modelService: ModelService) {
    addIcons({chevronForwardOutline});
  }

  ngOnInit() {}

  async openModelSettingsModal() {
    const modal = await this.modalController.create({
      component: ModelSettingsComponent,
    });
    modal.present();
  }

  

}
