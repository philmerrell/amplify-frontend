import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom, map } from 'rxjs';
import { DataSource } from 'src/app/models/chat-request.model';
import { environment } from 'src/environments/environment';

export interface UploadedFile {
  createdAt: string;
  createdBy: string;
  data: Object;
  dochash?: string;
  id: string;
  knowledgeBase: string;
  name: string;
  selected?: boolean;
  tags: string[];
  totalItems: number;
  totalTokens?: number;
  type: string;
  updatedAt: string;
  updatedBy: string;
}

interface GetUploadedFilesResponse {
  data: {
    items: UploadedFile[];
    pageKey: {
      createdAt: string;
      createdBy: string;
      id: string;
    }
  };
  success: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class SelectUploadedFileService {

  constructor(private http: HttpClient) { }

  getUploadedFilesList(): Promise<UploadedFile[]> {
    const requestObj = {
      data: {
        forwardScan: false,
        pageSize: 100,
        sortIndex: "createdAt"
      }
    };
    const request = this.http.post<GetUploadedFilesResponse>(`${environment.apiBaseUrl}/files/query`, requestObj)
      .pipe(map(response => response.data.items));
    return firstValueFrom(request);
  }

  createDataSourceFromUplodedFile(uploadedFile: UploadedFile): DataSource {
    return {
      id: `s3://${uploadedFile.id}`,
      metadata: {
        createdAt: uploadedFile.createdAt,
        tags: uploadedFile.tags,
        totalTokens: uploadedFile.totalTokens
      },
      name: uploadedFile.name,
      type: uploadedFile.type
    }
  }

}
