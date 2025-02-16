import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AssistantService {

  constructor(private http: HttpClient) { }

  getAssistants() {
    const request = this.http.get(`https://dev-api.boisestate.ai/assistant/list`)
    return lastValueFrom(request);
  }


}
