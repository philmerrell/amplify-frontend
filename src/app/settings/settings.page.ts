import { Component, OnInit, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonList, IonItem, IonButton, IonButtons, IonBackButton, IonLabel, IonBadge } from '@ionic/angular/standalone';
import { Conversation } from '../models/conversation.model';
import { ConversationService } from '../services/conversation.service';
import { Folder, FoldersService } from '../services/folders.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
  standalone: true,
  imports: [IonBadge, IonLabel, IonBackButton, IonButtons, IonButton, IonItem, IonList, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class SettingsPage implements OnInit {
  conversations: Signal<Conversation[]> = this.conversationService.getConversations();
  folders: Signal<Folder[]> = this.foldersService.getFolders();

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
  }

  clearLocalStorage() {
    localStorage.clear();
    localStorage.setItem('conversationHistory', JSON.stringify([]));
    this.conversationService.setConversations([]);
    this.foldersService.setFolders([]);
  }

}
