import { Component, effect, input, OnInit, Signal, ViewChild, WritableSignal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonAccordionGroup, IonAccordion, IonItemDivider, IonLabel, IonItem, IonIcon, IonList, IonCard, IonButton, IonRouterLink, IonSkeletonText, IonText, IonMenu } from "@ionic/angular/standalone";
import { addIcons } from 'ionicons';
import { chatbubbleOutline, chatboxOutline, add, folder, chevronForwardOutline, trash } from 'ionicons/icons';
import { Conversation } from 'src/app/models/conversation.model';
import { ConversationService } from 'src/app/services/conversation.service';
import { Folder, FoldersService } from 'src/app/services/folders.service';
import { ConversationFilterPipe } from './conversation-filter.pipe';
import { ConversationRenameService } from 'src/app/services/conversation-rename.service';

@Component({
  selector: 'app-conversations-menu',
  templateUrl: './conversations-menu.component.html',
  styleUrls: ['./conversations-menu.component.scss'],
  imports: [IonText, IonSkeletonText,  ConversationFilterPipe, IonButton, IonCard, IonList, IonIcon, IonItem, IonAccordion, IonAccordionGroup, IonLabel, IonItemDivider, RouterLink, IonRouterLink ],
  standalone: true,
})
export class ConversationsMenuComponent  implements OnInit {
  @ViewChild('accordionGroup', {static: true}) accordionGroup!: IonAccordionGroup;
  readonly menu = input<IonMenu>();
  conversations: WritableSignal<Conversation[]> = this.conversationService.getConversations();
  currentConversation: Signal<Conversation> = this.conversationService.getCurrentConversation();
  conversationRename: Signal<{loading: boolean, name: string, conversationId: string }> = this.conversationRenameService.getConversationRename();
  folders: Signal<Folder[]> = this.foldersService.getFolders();

  constructor(
    private conversationService: ConversationService,
    private conversationRenameService: ConversationRenameService,
    private foldersService: FoldersService) {
      addIcons({add,folder,trash,chatboxOutline,chevronForwardOutline,chatbubbleOutline});
      effect(() => {
        this.openAccordion(this.currentConversation().folderId || '')
      });
  }

  ngOnInit() {
    this.foldersService.initFolders();
    this.conversationService.initConversations();
  }

  createNewConversation() {
    const currentConversation = this.conversationService.getCurrentConversation();
    if (currentConversation().messages.length !== 0) {
      const newConversation = this.conversationService.createConversation();
      this.setCurrentConversation(newConversation);
    }

  }

  setCurrentConversation(conversation: Conversation) {
    this.conversationService.setCurrentConversation(conversation);
    this.menu()?.close();
  }

  private openAccordion(folderId: string) {
    setTimeout(() => {
      if (folderId !== '') {
        this.accordionGroup.value = folderId;
      }
    }, 500)
  }

}
