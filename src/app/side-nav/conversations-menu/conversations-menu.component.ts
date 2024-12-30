import { Component, OnInit, Signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonAccordionGroup, IonAccordion, IonItemDivider, IonLabel, IonItem, IonIcon, IonList, IonCard, IonButton, IonRouterLink } from "@ionic/angular/standalone";
import { addIcons } from 'ionicons';
import { chatbubbleOutline, chatboxOutline } from 'ionicons/icons';
import { Conversation } from 'src/app/models/conversation.model';
import { ConversationService } from 'src/app/services/conversation.service';
import { Folder, FoldersService } from 'src/app/services/folders.service';

@Component({
  selector: 'app-conversations-menu',
  templateUrl: './conversations-menu.component.html',
  styleUrls: ['./conversations-menu.component.scss'],
  imports: [IonButton, IonCard, IonList, IonIcon, IonItem, IonAccordion, IonAccordionGroup, IonLabel, IonItemDivider, RouterLink, IonRouterLink ],
  standalone: true,
})
export class ConversationsMenuComponent  implements OnInit {
  folders: Signal<Folder[]> = this.foldersService.getFolders();
  map = new Map<string, Conversation[]>();


  constructor(private conversationService: ConversationService, private foldersService: FoldersService) {
    addIcons({chatboxOutline,chatbubbleOutline});
  }

  ngOnInit() {
    this.conversationService.initConversations();
    this.foldersService.initFolders();
  }

  setCurrentConversation(conversation: Conversation) {
    this.conversationService.setCurrentConversation(conversation);
  }

  handleFolderChange(event: any) {
    const folderId = event.detail.value;
    if (!this.map.has(folderId)) {
      const conversations = this.conversationService.getConversationsByFolderId(folderId);
      this.map.set(folderId, conversations)
    }
  }

}
