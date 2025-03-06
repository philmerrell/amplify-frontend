import { Component, EventEmitter, inject, Input, Output, Renderer2, viewChild } from '@angular/core';
import { IonButton, IonIcon, IonInput, IonItem, IonList, IonPopover, IonSpinner, IonLabel } from '@ionic/angular/standalone';
import { Folder } from 'src/app/services/folders.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-folder-item',
  templateUrl: './folder-item.component.html',
  styleUrls: ['./folder-item.component.scss'],
  imports: [CommonModule, IonItem, IonIcon, IonInput, IonButton, IonPopover, IonList, IonSpinner, IonLabel]
})
export class FolderItemComponent {
  @Input() folder!: Folder;
  @Input() isEditing = false;
  @Input() isDeleting = false;
  
  readonly folderNameInput = viewChild.required<IonInput>('folderNameInput');
  
  // Simplified outputs
  @Output() folderClick = new EventEmitter<string>();
  @Output() folderUpdate = new EventEmitter<Folder>();
  @Output() folderDelete = new EventEmitter<Folder>();
  @Output() editingStateChange = new EventEmitter<{folderId: string, isEditing: boolean}>();
  @Output() drop = new EventEmitter<{event: DragEvent, folder: Folder}>();

  renderer = inject(Renderer2);
  
  // Drag and drop handling
  onDragLeave(event: Event): void {
    const folderElement = event.currentTarget as HTMLElement;
    if(folderElement) {
      folderElement.classList.remove("folder-drop-target-hover");
    }
  }
  
  onDragOver(event: Event): void {
    event.preventDefault();
    const folderElement = event.currentTarget as HTMLElement;
    folderElement.classList.add("folder-drop-target-hover");
  }
  
  onDrop(event: DragEvent): void {
    event.preventDefault();
    const folderEl = event.currentTarget as HTMLElement;
    
    if (folderEl) {
      folderEl.classList.remove("folder-drop-target-hover");
      folderEl.classList.add("folder-drop-success");

      setTimeout(() => {
        folderEl.classList.remove("folder-drop-success");
      }, 200);
    }
    
    this.drop.emit({event, folder: this.folder});
  }
  
  onFolderClick(): void {
    this.folderClick.emit(this.folder.id);
  }
  
  onRename(): void {
    if (!this.isEditing) {
      this.editingStateChange.emit({folderId: this.folder.id, isEditing: true});
      setTimeout(async () => {
        const input = await this.folderNameInput().getInputElement();
        input.focus();
        input.select();
      }, 100);
    }
  }
  
  onDelete(): void {
    this.folderDelete.emit(this.folder);
  }
  
  onSaveName(event: Event): void {
    console.log('onSaveName', event);
    event.stopPropagation();
    const input = event.target as HTMLInputElement;
    const newName = input.value.trim();
    
    if (newName && newName !== this.folder.name) {
      const updatedFolder = {...this.folder, name: newName};
      this.folderUpdate.emit(updatedFolder);
    }
    
    this.editingStateChange.emit({folderId: this.folder.id, isEditing: false});
  }
  
  onInputBlur(event: Event): void {
    // console.log('onInputBlur', event);
    // const input = event.target as HTMLInputElement;
    // if(input.value === this.folder.name) {
    //   return;
    // }
    // const newName = input.value.trim();
    
    // if (newName && newName !== this.folder.name) {
    //   const updatedFolder = {...this.folder, name: newName};
    //   this.folderUpdate.emit(updatedFolder);
    // }
    
    // this.editingStateChange.emit({folderId: this.folder.id, isEditing: false});
  }
} 