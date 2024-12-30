import { Component, OnInit, Signal } from '@angular/core';
import { IonSpinner, IonGrid, IonRow, IonCol, IonContent, IonHeader, IonTitle, IonToolbar, IonFooter, IonButton, IonButtons, IonIcon, ModalController, IonRouterLink } from '@ionic/angular/standalone';
import { ChatInputComponent } from './components/chat-input/chat-input.component';
import { ModelSettingsComponent } from './components/model-settings/model-settings.component';
import { addIcons } from 'ionicons';
import { chevronForwardOutline } from 'ionicons/icons';
import { ConversationService } from '../services/conversation.service';
import { Conversation } from '../models/conversation.model';
import { JsonPipe } from '@angular/common';
import { ChatService } from './services/chat.service';
import { MarkdownComponent } from 'ngx-markdown';
import { ModelService } from '../services/model.service';
import { Model } from '../models/model.model';
import { ConversationComponent } from './components/conversation/conversation.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [
    ConversationComponent,
    IonGrid,
    IonSpinner,
    IonRow,
    IonCol,
    IonContent, IonHeader, IonButtons, IonTitle, IonToolbar, IonFooter, IonButton, IonIcon, ChatInputComponent, JsonPipe, MarkdownComponent]
})
export class HomePage implements OnInit {
  currentConversation: Signal<Conversation> = this.conversationService.getCurrentConversation();
  chatResponse: Signal<string> = this.chatService.getChatResponse();
  chatLoading: Signal<boolean> = this.chatService.getChatLoading();
  userInput: Signal<string> = this.chatService.getUserInput();
  selectedModel: Signal<Model> = this.modelService.getSelectedModel();

  constructor(
    private chatService: ChatService,
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
