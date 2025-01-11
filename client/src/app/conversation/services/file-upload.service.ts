import { HttpBackend, HttpClient, HttpErrorResponse, HttpEventType } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, delay, filter, firstValueFrom, map, mergeMap, Observable, of, retry, retryWhen, switchMap, tap, throwError, timer } from 'rxjs';
import { DeveloperSettingsService } from 'src/app/settings/developer/developer-settings.service';
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
  presignedUrlResponse: PresignedUrlResponse;
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

  constructor(
    private http: HttpClient,
    private handler: HttpBackend,
    private developerSettingsService: DeveloperSettingsService
  ) {
    // Create new instance so Bearer tokens are not automattically attached
    this.fileUploadClient = new HttpClient(this.handler);
  }
  
  getPresignedUrl(file: File): Promise<PresignedUrlResponse> {
    // environment.apiBaseUrl
    const url = this.developerSettingsService.getDeveloperApiBaseUrl();
    const response = this.http.post<PresignedUrlResponse>(`${url()}/files/upload`, {
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

  uploadAndGetMetadata(file: File): Observable<any> {

    return this.uploadFileToS3(file.presignedUrlResponse.uploadUrl, file).pipe(
      mergeMap(event => {
        if (event.status === 'complete') {
          // When the upload is complete, switch to fetching metadata
          return this.getS3Metadata(file.presignedUrlResponse.metadataUrl).pipe(
            map(metadata => ({
              type: 'metadata',
              data: metadata
            }))
          );
        }
        // For other upload events, pass them along
        return of({
          type: 'upload',
          data: event
        });
      }),
      catchError(error => {
        console.error('Error in upload and metadata chain:', error);
        return throwError(() => error);
      })
    );
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
          return { status: 'complete', body: event.body };
        }
        
        return event;
      }),
      catchError(error => {
        console.error('Error uploading file:', error);
        return throwError(() => error);
      })
    );
  }

  getS3Metadata(url: string): Observable<any> {
    return this.fileUploadClient.get(url).pipe(
      retry({ count: 10, delay: this.shouldRetry})
    )
  }

  private shouldRetry = (error: HttpErrorResponse) => {
    if (error.status === 403 || error.status === 404) {
      return timer(1000); // Adding a timer from RxJS to return observable to delay param.
    }
    throw error;
  }
  
}
