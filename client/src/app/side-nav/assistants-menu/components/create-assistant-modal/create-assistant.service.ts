import { HttpClient } from '@angular/common/http';
import { effect, inject, Injectable, Signal, signal, WritableSignal } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { FileWrapper } from 'src/app/conversation/services/file-upload.service';
import { DataSource } from 'src/app/models/chat-request.model';
import { DeveloperSettingsService } from 'src/app/settings/developer/developer-settings.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CreateAssistantService {
    private files: WritableSignal<FileWrapper[]> = signal([]);
    private dataSources: WritableSignal<DataSource[]> = signal([]);
    private http: HttpClient = inject(HttpClient);
    private developerSettingsService: DeveloperSettingsService = inject(DeveloperSettingsService);
  
  constructor() {}

  /**
     * Add a file to the internal file list. 
     * This function updates the signal to include the new file.
     */
    addFile(fw: FileWrapper) {
      this.files.update(files => {
        return [
          ...files,
          fw
        ]
      });
    }
  
    /**
     * Remove a file from the internal file list by matching its ID. 
     * This function updates the signal to exclude the removed file.
     */
    removeFile(fileToBeRemoved: FileWrapper) {
      this.files.update(files => files.filter(file => file.id !== fileToBeRemoved.id))
    }
  
    /**
     * Returns the current list of file attachments as a read-only Signal. 
     * Useful for binding in templates or read-only operations.
     */
    getFiles(): Signal<FileWrapper[]> {
      return this.files;
    }

    createDataSource(s3MetadataResult: any, fw: FileWrapper): DataSource {
      return {
        id: `s3://${fw.presignedUrlResponse!.key}`,
        metadata: {
          ...s3MetadataResult
        },
        name: s3MetadataResult.name,
        type: fw.file!.type
      };
    }

    addDataSource(dataSource: DataSource) {
      this.dataSources.update(dataSources => {
        return [
          ...dataSources,
          dataSource
        ]
      });
    }

    removeDataSource(dataSource: DataSource) {
      this.dataSources.update(dataSources => dataSources.filter(ds => ds.id !== dataSource.id))
    }

    createAssistant(assistantFormValue: any) {
      const assistant = {
        ...assistantFormValue,
        dataSources: this.dataSources()
      }
      const apiBaseUrl = this.developerSettingsService.getDeveloperApiBaseUrl();
      const request = this.http.post(`${apiBaseUrl()}/assistant/create`, { data: {...assistant}});
      lastValueFrom(request);
    }
}
