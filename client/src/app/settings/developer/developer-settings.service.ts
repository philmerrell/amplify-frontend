import { Injectable, Signal, signal, WritableSignal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DeveloperSettingsService {

  // intended for proof of concept only...
  jwt: WritableSignal<string> = signal('');
  chatEndpoint: WritableSignal<string> = signal('');
  apiBaseUrl: WritableSignal<string> = signal('');

  constructor() { }

  setDeveloperChatEndpoint(url: string) {
    localStorage.setItem('developerChatEndpoint', url);
    this.chatEndpoint.set(url);
  }

  getDeveloperChatEndpoint(): Signal<string> {
    if (this.chatEndpoint() === '') {
      const result = localStorage.getItem('developerChatEndpoint');
      if (result) {
        this.chatEndpoint.set(result);
      }
    }
    return this.chatEndpoint;
  }

  setDeveloperJwt(token: string) {
    localStorage.setItem('developerToken', token);
    this.jwt.set(token);
  }

  getDeveloperJwt(): Signal<string> {
    if (this.jwt() === '') {
      const result = localStorage.getItem('developerToken');
      if (result) {
        this.jwt.set(result);
      }
    }
    return this.jwt;
  }

  setDeveloperApiBaseUrl(url: string) {
    localStorage.setItem('apiBaseUrl', url);
    this.apiBaseUrl.set(url);
  }

  getDeveloperApiBaseUrl(): Signal<string> {
    if (this.apiBaseUrl() === '') {
      const result = localStorage.getItem('apiBaseUrl');
      if (result) {
        this.apiBaseUrl.set(result);
      }
    }
    return this.apiBaseUrl;
  }
}
