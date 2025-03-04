import { Component, effect, OnInit, signal, Signal, WritableSignal } from '@angular/core';
import { CommonModule, JsonPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonBackButton, IonList, IonItem, IonButton, IonLabel, IonText, IonAlert, IonBadge } from '@ionic/angular/standalone';
import { DeveloperSettingsService } from './developer-settings.service';
import { AuthTokenService } from 'src/app/auth/auth-token.service';

@Component({
  selector: 'app-developer',
  templateUrl: './developer.page.html',
  styleUrls: ['./developer.page.scss'],
  standalone: true,
  imports: [IonBadge, IonAlert, IonText, IonLabel, IonButton, IonItem, IonList, IonBackButton, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, JsonPipe]
})
export class DeveloperPage implements OnInit {
  jwt: Signal<string> = this.developerSettingsService.getDeveloperJwt();
  chatEndpoint: Signal<string> = this.developerSettingsService.getDeveloperChatEndpoint();
  apiBaseUrl: Signal<string> = this.developerSettingsService.getDeveloperApiBaseUrl();
  isJwtExpired: boolean = true;
  decodedJwt: any;
  
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

  public alertApiBaseUrlButtons = ['OK'];
  public alertApiBaseUrlInput = [
    {
      placeholder: 'https://',
      type: 'url'
    }
  ];
  
  constructor(
    private developerSettingsService: DeveloperSettingsService,
    private authTokenService: AuthTokenService 
  ) {
    effect(() => {
      const token = this.jwt();
      this.getJwtValidity(token);
      this.decodeToken(token)
    })
  }

  async ngOnInit() {
    
    this.getJwtValidity(this.jwt());
    this.decodeToken(this.jwt())
  }

  setResult(ev: any) {
    const jwt  = ev.detail.data.values[0];
    this.developerSettingsService.setDeveloperJwt(jwt);
  }

  setChatEndpoint(ev: any) {
    const url  = ev.detail.data.values[0];
    this.developerSettingsService.setDeveloperChatEndpoint(url);
  }

  setApiBaseUrl(ev: any) {
    const url = ev.detail.data.values[0];
    this.developerSettingsService.setDeveloperApiBaseUrl(url);
  }

  private async getJwtValidity(jwt: string) {
    this.isJwtExpired = await this.authTokenService.isAccessTokenExpired(jwt);
  }

  private async decodeToken(jwt: string) {
    this.decodedJwt = await this.authTokenService.decodeIdToken(jwt);
  }

}
