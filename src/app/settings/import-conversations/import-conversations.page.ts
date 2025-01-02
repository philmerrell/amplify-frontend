import { Component, OnInit, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonList, IonItem, IonButton, IonLabel, IonBadge, IonBackButton, IonToast, IonAlert } from '@ionic/angular/standalone';
import { Conversation } from 'src/app/models/conversation.model';
import { ConversationService } from 'src/app/services/conversation.service';
import { Folder, FoldersService } from 'src/app/services/folders.service';

@Component({
  selector: 'app-import-conversations',
  templateUrl: './import-conversations.page.html',
  styleUrls: ['./import-conversations.page.scss'],
  standalone: true,
  imports: [IonAlert, IonToast, IonBackButton, IonBadge, IonLabel, IonButton, IonItem, IonList, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class ImportConversationsPage implements OnInit {
  conversations: Signal<Conversation[]> = this.conversationService.getConversations();
  folders: Signal<Folder[]> = this.foldersService.getFolders();
  isToastOpen: boolean = false;
  isAlertOpen: boolean = false;
  alertButtons = [
    {
      text: 'Cancel',
      role: 'cancel',
      handler: () => {
        console.log('Alert canceled');
      },
    },
    {
      text: 'OK',
      role: 'confirm',
      handler: () => {
        this.clearConversations();
      },
    },
  ];

  constructor(
    private conversationService: ConversationService,
    private foldersService: FoldersService
  ) { }

  ngOnInit() {}

  // Triggered when a file is selected
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const reader = new FileReader();

      reader.onload = () => {
        try {
          // Parse the JSON file content
          const data = JSON.parse(reader.result as string);
          this.storeJson(data);
          input.value = '';
          // console.log('File successfully read:', this.jsonData);
        } catch (error) {
          console.error('Invalid JSON file:', error);
        }
      };

      reader.onerror = () => {
        console.error('Error reading file');
      };

      reader.readAsText(file); // Read the file as text
    }
  }

  // Store JSON data in localStorage
  storeJson(data: any): void {
    if (data) {
      if(data.history) {
        localStorage.setItem('conversationHistory', JSON.stringify(data.history));
        this.conversationService.initConversations();
      }
      if(data.folders) {
        localStorage.setItem('folders', JSON.stringify(data.folders));
        this.foldersService.initFolders();
      }
      if(data.prompts) {
        localStorage.setItem('prompts', JSON.stringify(data.prompts));
      }
    }
    this.isToastOpen = true;
  }

  clearConversations() {
    localStorage.removeItem('conversationHistory');
    localStorage.removeItem('folders');
    localStorage.removeItem('prompts');
    this.conversationService.setConversations([]);
    this.foldersService.setFolders([]);
  }

  setToastOpen(isOpen: boolean) {
    this.isToastOpen = isOpen;
  }

  setAlertOpen(isOpen: boolean) {
    this.isAlertOpen = isOpen;
  }

}
