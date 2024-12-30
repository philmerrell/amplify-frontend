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
  constructor() {}
  ngOnInit(): void {
  }

}
