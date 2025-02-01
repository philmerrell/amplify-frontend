import { Injectable, signal, Signal, WritableSignal } from '@angular/core';

export interface ResponseMetadata {
  id: string;
  inProgress: boolean;
  message: string;
  summary: string;
  type: string;
  sticky: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ResponseMetadataService {
  responseMetadata: WritableSignal<ResponseMetadata[]> = signal([] as ResponseMetadata[]);
  
  constructor() { }

  setResponseMetaData(metadata: ResponseMetadata) {
    this.responseMetadata.update(r => [...r, metadata])
  }

  getResponseMetaData(): Signal<ResponseMetadata[]> {
    return this.responseMetadata;
  }

  resetResponseMetaData() {
    this.responseMetadata.set([]);
  }


}
