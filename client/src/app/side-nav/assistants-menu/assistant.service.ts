import { HttpClient } from '@angular/common/http';
import { inject, Injectable, resource } from '@angular/core';
import { lastValueFrom, map } from 'rxjs';
import { DeveloperSettingsService } from '../../settings/developer/developer-settings.service';

@Injectable({
  providedIn: 'root'
})
export class AssistantService {
  private http: HttpClient = inject(HttpClient);
  private developerSettingsService: DeveloperSettingsService = inject(DeveloperSettingsService);
  private _assistantResource = resource({
    loader: () => this.getAssistants()
  });

  get assistantResource() {
    return this._assistantResource.asReadonly()
  }

  constructor() { }

  getAssistants() {
    const apiBaseUrl = this.developerSettingsService.getDeveloperApiBaseUrl();
    const request = this.http.get(`${apiBaseUrl()}/assistant/list`)
      .pipe(map((response: any) => response.data));
    return lastValueFrom(request)
  }


}
