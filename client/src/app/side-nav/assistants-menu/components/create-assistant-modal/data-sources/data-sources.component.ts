import { Component, inject, OnInit } from '@angular/core';
import { IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, IonContent, IonFooter, IonButton, IonIcon, IonList, IonItem, IonLabel, IonSkeletonText, IonText, IonBadge, IonSegment, IonSegmentButton, IonSegmentView, IonSegmentContent } from "@ionic/angular/standalone";
import { addIcons } from 'ionicons';
import { chevronForwardOutline, checkmarkOutline, documentOutline, cloudUploadOutline } from 'ionicons/icons';
import { SelectUploadedFileService, UploadedFile } from 'src/app/conversation/components/select-uploaded-file/select-uploaded-file.service';
import { FileWrapper } from 'src/app/conversation/services/file-upload.service';
import { FileTypeIconPipe } from "../../../../../conversation/components/select-uploaded-file/pipes/file-type-icon.pipe";
import { DatePipe } from '@angular/common';
import { FileTypePipe } from "../../../../../conversation/components/select-uploaded-file/pipes/file-type.pipe";
import { FileDropZoneDirective } from 'src/app/conversation/components/chat-input/file-drop-zone.directive';

@Component({
  selector: 'app-data-sources',
  templateUrl: './data-sources.component.html',
  styleUrls: ['./data-sources.component.scss'],
  standalone: true,
  imports: [FileDropZoneDirective, IonSegmentButton, IonSegment, IonBadge, IonText, IonSkeletonText, IonLabel, IonItem, IonList, IonIcon, IonButton, IonFooter, IonContent, IonTitle, IonBackButton, IonButtons, IonToolbar, IonHeader, FileTypeIconPipe, DatePipe, FileTypePipe, IonSegmentView, IonSegmentContent]
})
export class DataSourcesComponent  implements OnInit {
  files: UploadedFile[] = [];
  filesRequestComplete: boolean = false;
  private selectUploadedFileService: SelectUploadedFileService = inject(SelectUploadedFileService);
  
  constructor() {
    addIcons({cloudUploadOutline,checkmarkOutline,documentOutline,chevronForwardOutline});
  }

  ngOnInit() {
    this.getFiles();
  }

  async onFileDropped(files: File[]) {
    console.log(files);
    // this.prepareFilesList(files);
    // await this.getPresignedUrlForUpload();
    // this.initiateFileUploads();
  }

  async getFiles() {
    try {
      this.files = await this.selectUploadedFileService.getUploadedFilesList();
    } catch (error) {
      // this.presentToast('An error has occurred retrieving files list.', 'danger', 0);
      console.log(error);
    }
    this.filesRequestComplete = true;
  }

  handleFileSelect(uploadedFile: UploadedFile) {
    if (uploadedFile.selected) {
      this.removeFile(uploadedFile);
    } else {
      this.addFile(uploadedFile);
    }
    uploadedFile.selected = !uploadedFile.selected;
  }

  removeFile(uploadedFile: UploadedFile) {
    const fw = this.createFileWrapperFromUploadedFile(uploadedFile);
    const dataSource = this.selectUploadedFileService.createDataSourceFromUplodedFile(uploadedFile);
    // TODO: remove dataSource
    // this.chatRequestService.removeFile(fw);
  }

  addFile(uploadedFile: UploadedFile) {
    const fw = this.createFileWrapperFromUploadedFile(uploadedFile);
    // this.chatRequestService.addFile(fw);
    const dataSource = this.selectUploadedFileService.createDataSourceFromUplodedFile(uploadedFile);
    // this.chatRequestService.addDataSource(dataSource);
    // this.presentToast('File Added', 'dark', 3000);
  }

  createFileWrapperFromUploadedFile(uploadedFile: UploadedFile): FileWrapper {
      return {
        name: uploadedFile.name,
        id: `s3://${uploadedFile.id}`,
        uploaded: true,
        progress: 100,
        file: {
          type: uploadedFile.type
        } as File
      }
    }


}
