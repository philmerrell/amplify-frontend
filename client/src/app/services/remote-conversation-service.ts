// https://dev-chat.dev.boisestate.edu/api/remoteconversation

import { HttpBackend, HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { firstValueFrom, map, switchMap } from 'rxjs';
import { DeveloperSettingsService } from '../settings/developer/developer-settings.service';
import { Conversation } from '../models/conversation.model';

interface RemoteConversationPresignedUrlResponse {
  body: string;
}

@Injectable({providedIn: 'root'})
export class RemoteConversationService {
  developerSettings = inject(DeveloperSettingsService);
  httpClient: HttpClient = inject(HttpClient);
  s3Client: HttpClient;
  
  constructor(private handler: HttpBackend) { 
    this.s3Client = new HttpClient(handler);
  }

  async getRemoteConversations(): Promise<any> {
    const url = this.developerSettings.getDeveloperApiBaseUrl();
    return firstValueFrom(
      this.httpClient.get<RemoteConversationPresignedUrlResponse>(`${url()}/state/conversation/get_all`).pipe(
        switchMap((response: any) => {
          const parsed = JSON.parse(response.body);
          return this.fetchFromS3(parsed.presignedUrl)
        })
    ));
  }

  async uploadConversation(conversation: Conversation): Promise<any> {

  }

  private async fetchFromS3(url: string): Promise<any> {
    return firstValueFrom(this.s3Client.get(url));
  }

}