import { Component, EventEmitter, Input, Output, Renderer2 } from '@angular/core';
import { IonButton, IonIcon, IonItem, IonLabel, IonList, IonPopover, IonSpinner } from '@ionic/angular/standalone';
import { Conversation } from 'src/app/models/conversation.model';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-conversation-item',
  templateUrl: './conversation-item.component.html',
  styleUrls: ['./conversation-item.component.scss'],
  standalone: true,
  imports: [CommonModule, IonItem, IonIcon, IonLabel, IonButton, IonPopover, IonList, IonSpinner, RouterLink]
})
export class ConversationItemComponent {
  @Input() conversation!: Conversation;
  @Input() isActive = false;
  @Input() isRenaming = false;
  @Input() isDeleting = false;
  @Input() renamingData: {loading: boolean, name: string} = {loading: false, name: ''};
  
  @Output() conversationClick = new EventEmitter<Conversation>();
  @Output() conversationDelete = new EventEmitter<Conversation>();
  @Output() conversationDragToFolder = new EventEmitter<{conversation: Conversation, targetFolderId: string}>();
  
  draggedConversation: Conversation | null = null;
  
  constructor(private renderer: Renderer2) {}
  
  onConversationClick(): void {
    this.conversationClick.emit(this.conversation);
  }
  
  onDelete(): void {
    this.conversationDelete.emit(this.conversation);
  }
  
  onDragStart(event: DragEvent): void {
    event.dataTransfer!.effectAllowed = "move";
    this.draggedConversation = this.conversation;
    
    const conversationEl = event.target as HTMLElement;
    if (conversationEl) {
      // The goal here is to let the user see the conversation item as it's being dragged
      conversationEl.classList.add("conversation-dragging");
      
      // Create a div-based clone for the preview
      const dragPreview = this.renderer.createElement("div");
      this.renderer.setProperty(dragPreview, "innerHTML", conversationEl.innerHTML);

      // Apply styles to make it visually identical but smaller
      this.renderer.setStyle(dragPreview, "position", "absolute");
      this.renderer.setStyle(dragPreview, "top", "0");
      this.renderer.setStyle(dragPreview, "left", "0");
      this.renderer.setStyle(dragPreview, "transform", "scale(0.7)");
      this.renderer.setStyle(dragPreview, "opacity", "0.9");
      this.renderer.setStyle(dragPreview, "pointerEvents", "none");
      this.renderer.setStyle(dragPreview, "background", "white");
      this.renderer.setStyle(dragPreview, "padding", "8px");
      this.renderer.setStyle(dragPreview, "borderRadius", "8px");
      this.renderer.setStyle(dragPreview, "boxShadow", "0 2px 8px rgba(0, 0, 0, 0.2)");

      this.renderer.appendChild(document.body, dragPreview);
      event.dataTransfer!.setDragImage(dragPreview, 0, 0);
      
      // Store conversation data in dataTransfer
      // This is used to identify the conversation and its source folder when it's dropped
      event.dataTransfer!.setData('text/plain', JSON.stringify({
        conversationId: this.conversation.id,
        sourceFolderId: this.conversation.folderId
      }));

      setTimeout(() => this.renderer.removeChild(document.body, dragPreview), 0);
    }
  }
  
  onDragEnd(event: DragEvent): void {
    const conversationEl = event.target as HTMLElement;
    if (conversationEl) {
      conversationEl.classList.remove("conversation-dragging");
    }
    this.draggedConversation = null;
  }
} 