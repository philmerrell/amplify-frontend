import { Component, OnInit, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonBackButton, IonList, IonItem, IonButton, IonLabel, IonText, IonAlert } from '@ionic/angular/standalone';
import { DeveloperSettingsService } from './developer-settings.service';

@Component({
  selector: 'app-developer',
  templateUrl: './developer.page.html',
  styleUrls: ['./developer.page.scss'],
  standalone: true,
  imports: [IonAlert, IonText, IonLabel, IonButton, IonItem, IonList, IonBackButton, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class DeveloperPage implements OnInit {
  jwt: Signal<string> = this.developerSettingsService.getDeveloperJwt();
  chatEndpoint: Signal<string> = this.developerSettingsService.getDeveloperChatEndpoint();
  
  public alertJwtButtons = ['OK'];
  public alertJwtInput = [
    {
      type: 'textarea',
      placeholder: 'Paste a valid JWT',
    },
  ];

  public alertChatEndpointButtons = ['OK'];
  public alertChatEndpointInput = [
    {
      placeholder: 'https://',
      type: 'url'
    }
  ];
  
  constructor(private developerSettingsService: DeveloperSettingsService) { }

  ngOnInit() {
  }

  setResult(ev: any) {
    const jwt  = ev.detail.data.values[0];
    this.developerSettingsService.setDeveloperJwt(jwt);
  }

  setChatEndpoint(ev: any) {
    const url  = ev.detail.data.values[0];
    this.developerSettingsService.setDeveloperChatEndpoint(url);
  }

}
