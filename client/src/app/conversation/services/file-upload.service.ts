import { HttpBackend, HttpClient, HttpEventType } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, firstValueFrom, map, Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface File {
  progress: number;
  uploaded: boolean;
  lastModified: number;
  lasModifiedDate: Date;
  name: string;
  size: number;
  type: string;
  webkitRelativePath: string;
}

export interface PresignedUrlResponse {
  contentUrl: string;
  key: string;
  metadataUrl: string;
  statusUrl: string;
  success: boolean;
  uploadUrl: string;
}

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {
  fileUploadClient: HttpClient;

  constructor(private http: HttpClient, private handler: HttpBackend) {
    // Create new instance so Bearer tokens are not automattically attached
    this.fileUploadClient = new HttpClient(this.handler);
  }
  
  getPresignedUrl(file: File): Promise<PresignedUrlResponse> {
    const response = this.http.post<PresignedUrlResponse>(`${environment.apiBaseUrl}/files/upload`, {
      data: { 
        knowledgeBase: "default",
        name: file.name,
        tags: [],
        type: file.type,
        data: {}
      }
    });
    return firstValueFrom(response);
  }

  uploadFileToS3(presignedUrl: string, file: File): Observable<any> {
    return this.fileUploadClient.put(presignedUrl, file, {
      headers: {
        'Content-Type': file.type,
      },
      reportProgress: true,
      observe: 'events'
    }).pipe(
      map(event => {
        if (event.type === HttpEventType.UploadProgress) {
          return {
            progress: event.total
              ? Math.round((100 * event.loaded) / event.total)
              : 0,
            status: 'uploading'
          }
        } else if (event.type === HttpEventType.Response) {
          console.log(event);
          return { status: 'complete', body: event.body };
        }
        
        return null;
      }),
      catchError(error => {
        console.error('Error uploading file:', error);
        return throwError(() => error);
      })
    );
  }
}
