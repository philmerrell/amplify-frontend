import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AssistantService {

  constructor(private http: HttpClient) { }

  getAssistants() {
    const request = this.http.get(`https://z61j9s98a0.execute-api.us-east-1.amazonaws.com/dev/assistant/list`)
    // const request = this.http.get(`http://localhost:3015/dev/assistant/list`)
    // return lastValueFrom(request);
    return lastValueFrom(of({}))
  }


}
