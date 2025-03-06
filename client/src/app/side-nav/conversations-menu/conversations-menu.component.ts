import { Component, input, ResourceStatus, signal, Signal, WritableSignal } from '@angular/core';
import { IonItemDivider, IonLabel, IonItem, IonIcon, IonList, IonButton, IonText, IonMenu, IonItemGroup, IonSpinner } from "@ionic/angular/standalone";
import { chatbubbleOutline, chatboxOutline, add, folder, chevronForwardOutline, trash, pencilOutline, ellipsisHorizontal, trashOutline, ellipsisVertical } from 'ionicons/icons';
import { Conversation } from 'src/app/models/conversation.model';
import { ConversationService } from 'src/app/services/conversation.service';
import { Folder, FoldersService } from 'src/app/services/folders.service';
import { ConversationRenameService } from 'src/app/conversation/services/conversation-rename.service';
import { NewFolderModalComponent } from './components/new-folder-modal/new-folder-modal.component';
import { addIcons } from 'ionicons';
import { CommonModule } from '@angular/common';
import { FolderItemComponent } from './components/folder-item/folder-item.component';
import { ConversationItemComponent } from './components/conversation-item/conversation-item.component';
import { ModalController } from '@ionic/angular/standalone';

@Component({
  selector: 'app-conversations-menu',
  templateUrl: './conversations-menu.component.html',
  styleUrls: ['./conversations-menu.component.scss'],
  imports: [
    IonText, IonButton, IonList, IonIcon, IonItem, IonLabel, IonItemDivider, IonItemGroup, IonSpinner, CommonModule,
    FolderItemComponent,
    ConversationItemComponent
  ],
})
export class ConversationsMenuComponent {
  status = ResourceStatus;
  readonly menu = input<IonMenu>();
  conversations: WritableSignal<Conversation[]> = this.conversationService.getConversations();
  currentConversation: Signal<Conversation> = this.conversationService.getCurrentConversation();
  conversationRename: Signal<{loading: boolean, name: string, conversationId: string }> = this.conversationRenameService.getConversationRename();
  folderConversations = this.conversationService.conversationsResource;
  editingFolder = signal<string | null>(null);
  deletingFolder = this.conversationService.getDeletingFolder();
  deletingConversation = this.conversationService.getDeletingConversation();
  
  constructor(
    private conversationService: ConversationService,
    private conversationRenameService: ConversationRenameService,
    private foldersService: FoldersService,
    private modalController: ModalController
  ) {
    addIcons({
      add, folder, trash, chatboxOutline, chevronForwardOutline, 
      chatbubbleOutline, pencilOutline, ellipsisHorizontal, 
      trashOutline, ellipsisVertical
    });
  }

  // Folder operations
  setActiveFolder(folderId: string) {
    this.foldersService.setActiveFolder(folderId);
  }
  
  updateFolderEditingState(data: {folderId: string, isEditing: boolean}) {
    const currentEditingFolder = this.editingFolder();
    
    // Case 1: Trying to set a folder to editing mode
    if (data.isEditing) {
      // If we're already editing this folder, do nothing
      if (currentEditingFolder === data.folderId) {
        console.log('Already editing this folder, ignoring duplicate event');
        return;
      }
      
      // If we're editing a different folder, switch to the new one
      console.log('Switching editing to folder:', data.folderId);
      this.editingFolder.set(data.folderId);
      return;
    }
    
    // Case 2: Trying to exit editing mode
    if (!data.isEditing) {
      // Only clear if we're exiting editing for the currently edited folder
      if (currentEditingFolder === data.folderId) {
        console.log('Exiting edit mode for folder:', data.folderId);
        this.editingFolder.set(null);
      } else {
        console.log('Ignoring exit edit for non-active folder');
      }
    }
  }
  
  updateFolder(folder: Folder) {
    this.conversationService.saveFolder(folder);
  }
  
  deleteFolder(folder: Folder) {
    this.conversationService.deleteFolder(folder);
  }

  // Conversation operations
  setCurrentConversation(conversation: Conversation) {
    if(conversation.id === this.currentConversation().id) {
      return;
    }

    this.conversationService.getConversationById(conversation.id)
      .then(convo => {
        this.conversationService.setCurrentConversation(convo || conversation);
        this.menu()?.close();
      });
  }
  
  deleteConversation(conversation: Conversation) {
    this.conversationService.deleteConversation(conversation);
  }
  
  handleDrop(data: {event: DragEvent, folder: Folder}) {
    const dataTransfer = data.event.dataTransfer;
    if (!dataTransfer) return;
    
    try {
      const dragData = JSON.parse(dataTransfer.getData('text/plain'));
      const conversationId = dragData.conversationId;
      const sourceFolderId = dragData.sourceFolderId;
      
      if (conversationId && sourceFolderId) {
        const conversation = this.folderConversations.value()?.conversations?.[sourceFolderId]
          ?.find(c => c.id === conversationId);
          
        if (conversation) {
          // Remove from source folder
          this.conversationService.removeConversationFromFolder(conversation, sourceFolderId);
          
          // Add to target folder
          this.conversationService.addConversationToFolder(conversation, data.folder.id);
          
          // Update conversation
          conversation.folderId = data.folder.id;
          this.conversationService.saveConversation(conversation, true);
        }
      }
    } catch (e) {
      console.error('Error processing drag data:', e);
    }
  }

  async createFolder() {
    const modal = await this.modalController.create({
      component: NewFolderModalComponent,
      cssClass: 'folder-modal'
    });
    
    await modal.present();
    
    const { data, role } = await modal.onWillDismiss();
    
    if (role === 'confirm' && data) {
      const newFolder = this.foldersService.createNewFolder();
      newFolder.name = data;
      this.conversationService.addFolderToConversations(newFolder);
    }
  }
}
