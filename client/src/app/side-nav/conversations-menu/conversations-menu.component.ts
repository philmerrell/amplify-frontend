import { Component, effect, ElementRef, input, OnInit, ResourceStatus, signal, Signal, ViewChild, WritableSignal, viewChildren, AfterViewInit, Input, Renderer2 } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonAccordionGroup, IonAccordion, IonItemDivider, IonLabel, IonItem, IonIcon, IonList, IonCard, IonButton, IonRouterLink, IonSkeletonText, IonText, IonMenu, IonItemGroup, IonSpinner, IonPopover, IonContent, IonInput, IonItemOption, IonItemOptions, IonItemSliding } from "@ionic/angular/standalone";
import { addIcons } from 'ionicons';
import { chatbubbleOutline, chatboxOutline, add, folder, chevronForwardOutline, trash, pencilOutline, ellipsisHorizontalOutline, ellipsisHorizontal, trashOutline } from 'ionicons/icons';
import { Conversation } from 'src/app/models/conversation.model';
import { ConversationService } from 'src/app/services/conversation.service';
import { Folder, FoldersService } from 'src/app/services/folders.service';
import { ConversationFilterPipe } from './conversation-filter.pipe';
import { ConversationRenameService } from 'src/app/conversation/services/conversation-rename.service';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-conversations-menu',
  templateUrl: './conversations-menu.component.html',
  styleUrls: ['./conversations-menu.component.scss'],
  imports: [IonText, IonButton, IonList, IonIcon, IonItem, IonLabel, IonItemDivider, RouterLink, IonRouterLink, IonItemGroup, JsonPipe, IonSpinner, IonPopover, IonContent, IonInput, IonItemOption, IonItemOptions, IonItemSliding,],
  standalone: true,
})
export class ConversationsMenuComponent  implements OnInit {
  @ViewChild('accordionGroup', {static: true}) accordionGroup!: IonAccordionGroup;
  status = ResourceStatus;
  readonly menu = input<IonMenu>();
  conversations: WritableSignal<Conversation[]> = this.conversationService.getConversations();
  currentConversation: Signal<Conversation> = this.conversationService.getCurrentConversation();
  conversationRename: Signal<{loading: boolean, name: string, conversationId: string }> = this.conversationRenameService.getConversationRename();
  folders: Signal<Folder[]> = this.foldersService.getFolders();
  folderConversations = this.conversationService.conversationsResource;
  editingFolder = signal<string | null>(null); // Track folder being edited
  activeFolder = this.foldersService.getActiveFolder();
  draggedConversation: Conversation | null = null;

  readonly folderNameInputs = viewChildren(IonInput, {read: ElementRef});
  
  constructor(
    private conversationService: ConversationService,
    private conversationRenameService: ConversationRenameService,
    private foldersService: FoldersService,
    private renderer: Renderer2,
  ) {
      addIcons({add,folder,trash,chatboxOutline,chevronForwardOutline,chatbubbleOutline,pencilOutline, ellipsisHorizontal, trashOutline});
      effect(() => {
        this.openAccordion(this.currentConversation().folderId || '')
      });
    }
  async ngOnInit() {
  }

  createNewConversation() {
    const currentFolder = this.activeFolder() ?? '';
    const newConversation = this.conversationService.createConversation(currentFolder);
    this.setCurrentConversation(newConversation);
    this.conversationService.addConversationToFolder(newConversation, currentFolder);
  }

  deleteFolder(folder: Folder) {
    // TODO: just loop through all the convos in the folder and delete 1 by 1, that's how the api does it now
  }

  onDragStart($event: DragEvent, conversation: Conversation) {
    $event.dataTransfer!.effectAllowed = "move";
    this.draggedConversation = conversation;
    const conversationEl = $event.target as HTMLElement;
    if (conversationEl) {
      conversationEl.classList.add("conversation-dragging");
      // Create a div-based clone for the preview instead of cloning `ion-item`
    const dragPreview = this.renderer.createElement("div");
    this.renderer.setProperty(dragPreview, "innerHTML", conversationEl.innerHTML);

    // Apply styles to make it visually identical but smaller
    this.renderer.setStyle(dragPreview, "position", "absolute");
    this.renderer.setStyle(dragPreview, "top", "0");
    this.renderer.setStyle(dragPreview, "left", "0");
    this.renderer.setStyle(dragPreview, "transform", "scale(0.7)"); // Shrink effect
    this.renderer.setStyle(dragPreview, "opacity", "0.9");
    this.renderer.setStyle(dragPreview, "pointerEvents", "none");
    this.renderer.setStyle(dragPreview, "background", "white");
    this.renderer.setStyle(dragPreview, "padding", "8px");
    this.renderer.setStyle(dragPreview, "borderRadius", "8px");
    this.renderer.setStyle(dragPreview, "boxShadow", "0 2px 8px rgba(0, 0, 0, 0.2)");

    this.renderer.appendChild(document.body, dragPreview);

    $event.dataTransfer!.setDragImage(dragPreview, 0, 0);

      setTimeout(() => this.renderer.removeChild(document.body, dragPreview), 0);
    }
  }

  onDragEnd($event: DragEvent) {
    const conversationEl = $event.target as HTMLElement;
    if (conversationEl) {
      conversationEl.classList.remove("conversation-dragging");
    }
  }

  onDragLeave($event: Event) {
    const folderElement = $event.currentTarget as HTMLElement;
    if(folderElement) {
      folderElement.classList.remove("folder-drop-target-hover");
    }
  }

  onDrop($event: DragEvent, targetFolder: Folder) {
    $event.preventDefault();
    const folderEl = $event.currentTarget as HTMLElement;

    if (!this.draggedConversation) return;

    if(this.draggedConversation.folderId) {
      this.conversationService.removeConversationFromFolder(this.draggedConversation, this.draggedConversation.folderId);
      this.conversationService.addConversationToFolder(this.draggedConversation, targetFolder.id)
    }

    if (folderEl) {
      folderEl.classList.remove("folder-drop-target-hover");
      folderEl.classList.add("folder-drop-success");

      setTimeout(() => {
        folderEl.classList.remove("folder-drop-success");
      }, 200); // Remove bounce effect after animation
    }

    // Reset state
    this.draggedConversation.folderId = targetFolder.id;
    this.conversationService.saveConversation(this.draggedConversation, true);
    this.draggedConversation = null;
  }

  onDragOver($event: DragEvent) {
    $event.preventDefault();
    const folderElement = $event.currentTarget as HTMLElement;
    folderElement.classList.add("folder-drop-target-hover");
  }

  deleteConversation(conversation: Conversation) {
    this.conversationService.deleteConversation(conversation);
  }

  renameFolder(folder: Folder, index: number) {
    if (this.editingFolder() === folder.id) {
      this.editingFolder.set(null); // Exit edit mode
    } else {
      this.editingFolder.set(folder.id); // Enter edit mode for this folder
      const input = this.folderNameInputs().find((input, i) => i === index);
      // TODO: figure out how to set the focus correctly on edit
    }
  }

  saveFolderName(folder: any, event: Event) {
    const input = event.target as HTMLInputElement;
    folder.name = input.value;
    this.editingFolder.set(null); // Exit edit mode after saving
    // TODO: actually save the folder name
  }

  setActiveFolder(folderId: string) {
    this.foldersService.setActiveFolder(folderId);
  }

  async setCurrentConversation(conversation: Conversation) {
    if(conversation.id === this.currentConversation().id) {
      return;
    }
    let convoToSet = conversation;
    if(!conversation.isLocal) {
      convoToSet = await this.conversationService.getConversationById(conversation.id);
    }
    this.conversationService.setCurrentConversation(convoToSet);
    this.menu()?.close();
  }

  createFolder() {
    const newFolder = this.foldersService.createNewFolder();
    this.conversationService.addFolderToConversations(newFolder);
  }

  private openAccordion(folderId: string) {
    setTimeout(() => {
      if (folderId !== '') {
        // this.accordionGroup.value = folderId;
      }
    }, 500)
  }

}
