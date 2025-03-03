import { HttpClient } from '@angular/common/http';
import { inject, Injectable, resource } from '@angular/core';
import { lastValueFrom, map } from 'rxjs';
import { DeveloperSettingsService } from '../../settings/developer/developer-settings.service';
import { AssistantResponseItem } from 'src/app/models/assistant.model';

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

  getAssistants(): Promise<AssistantResponseItem[]> {
    const apiBaseUrl = this.developerSettingsService.getDeveloperApiBaseUrl();
    const request = this.http.get(`${apiBaseUrl()}/assistant/list`)
      .pipe(map((response: any) => response.data));
    return lastValueFrom(request)
  }

  async deleteAssistant(assistantId: string): Promise<{message: string, success: boolean}> {
    const apiBaseUrl = this.developerSettingsService.getDeveloperApiBaseUrl();
    const request = this.http.post<{message: string, success: boolean}>(`${apiBaseUrl()}/assistant/delete`, { data: {assistantId} });
    const result = await lastValueFrom(request);
    if(result.success) {
      this.removeAssistantFromResource(assistantId);
    }

    return result;
  }

  private removeAssistantFromResource(assistantId: string) {
    this._assistantResource.update(assistants => {
      const assistantIndex = assistants!.findIndex((assistant: any) => assistant.assistantId === assistantId);
      assistants!.splice(assistantIndex, 1);
      return [...assistants!];
    });
  }


}
