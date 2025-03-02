import { Component, ElementRef, inject, Input, OnInit, Resource, ResourceStatus, Signal } from '@angular/core';
import { IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, IonContent, IonFooter, IonButton, IonIcon, IonList, IonItem, IonLabel, IonSkeletonText, IonText, IonBadge, IonSegment, IonSegmentButton, IonSegmentView, IonSegmentContent, IonNav, ToastController, IonThumbnail, IonSpinner } from "@ionic/angular/standalone";
import { addIcons } from 'ionicons';
import { chevronForwardOutline, checkmarkOutline, documentOutline, cloudUploadOutline, fileTrayOutline, close, checkmarkCircle } from 'ionicons/icons';
import { SelectUploadedFileService, UploadedFile } from 'src/app/conversation/components/select-uploaded-file/select-uploaded-file.service';
import { FileUploadService, FileWrapper } from 'src/app/conversation/services/file-upload.service';
import { FileTypeIconPipe } from "../../../../../conversation/components/select-uploaded-file/pipes/file-type-icon.pipe";
import { DatePipe } from '@angular/common';
import { FileTypePipe } from "../../../../../conversation/components/select-uploaded-file/pipes/file-type.pipe";
import { FileDropZoneDirective } from 'src/app/conversation/components/chat-input/file-drop-zone.directive';
import { DataSource } from 'src/app/models/chat-request.model';
import { CreateAssistantFileService } from '../create-assistant-file.service';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-data-sources',
  templateUrl: './data-sources.component.html',
  styleUrls: ['./data-sources.component.scss'],
  standalone: true,
  imports: [IonSpinner, FileDropZoneDirective, IonSegmentButton, IonSegment, IonBadge, IonText, IonSkeletonText, IonLabel, IonItem, IonList, IonIcon, IonButton, IonFooter, IonContent, IonTitle, IonBackButton, IonButtons, IonToolbar, IonHeader, FileTypeIconPipe, DatePipe, FileTypePipe, IonSegmentView, IonSegmentContent, IonThumbnail]
})
export class DataSourcesComponent  implements OnInit {
  @Input() form!: FormGroup;
  @Input() nav!: ElementRef<IonNav>;
  private selectUploadedFileService: SelectUploadedFileService = inject(SelectUploadedFileService);
  private fileUploadService: FileUploadService = inject(FileUploadService);
  private createAssistantFileService: CreateAssistantFileService = inject(CreateAssistantFileService);
  private toastController: ToastController = inject(ToastController);
  
  myFilesResource: Resource<UploadedFile[] | undefined> = this.selectUploadedFileService.myFilesResource;
  status = ResourceStatus;
  files: Signal<FileWrapper[]> = this.createAssistantFileService.getFiles();
  
  constructor() {
    addIcons({fileTrayOutline,documentOutline,close,checkmarkCircle,checkmarkOutline,chevronForwardOutline,cloudUploadOutline});
  }

  ngOnInit() {}

  async onFileDropped(files: File[]) {
    this.addFilesToList(files);
    await this.getPresignedUrlForUpload();
    this.initiateFileUploads();
  }

  async fileBrowseHandler(event: any) {
    const files: File[] = event.files;
    this.addFilesToList(files);
    await this.getPresignedUrlForUpload();
    this.initiateFileUploads();
  }

  async addFilesToList(files: Array<any>) {  
    for (const file of files) {
      const fw = this.fileUploadService.createFileWrapperObj(file);
      this.createAssistantFileService.addFile(fw);
    }
  }

  removeFile(file: FileWrapper) {
    const foundMyFile = this.myFilesResource.value()!.find(f => `s3://${f.id}` === file.id);
    if (foundMyFile) {        
      foundMyFile.selected = false;
    }
    this.createAssistantFileService.removeFile(file);
  }

  handleMyFileSelect(uploadedFile: UploadedFile) {
    if (uploadedFile.selected) {
      this.unSelectMyFile(uploadedFile);
    } else {
      this.selectMyFile(uploadedFile);
    }
    uploadedFile.selected = !uploadedFile.selected;
  }

  async next() {
    if (this.allFilesUploaded()) {
      // this.nav.nativeElement.push('app-create-assistant-file');
    } else {
      const top = await this.toastController.getTop()
      if (!top) {
        this.presentErrorToast('Please wait for all files to upload.', 'dark', 3000);
      }
    }
  }

  allFilesUploaded(): boolean {
    return this.files().every(file => file.uploaded);
  }



  private unSelectMyFile(uploadedFile: UploadedFile) {
    const fw = this.createFileWrapperFromUploadedFile(uploadedFile);
    this.createAssistantFileService.removeFile(fw);
    const dataSource = this.selectUploadedFileService.createDataSourceFromUplodedFile(uploadedFile);
    this.removeDataSource(dataSource);
  }

  private selectMyFile(uploadedFile: UploadedFile) {
    const fw = this.createFileWrapperFromUploadedFile(uploadedFile);
    this.createAssistantFileService.addFile(fw);
    const dataSource = this.selectUploadedFileService.createDataSourceFromUplodedFile(uploadedFile);
    this.addDataSource(dataSource);
  }

  private async getPresignedUrlForUpload() {
    for (const file of this.files()) {
      if (!file.uploaded) {
        try {
          const response = await this.fileUploadService.getPresignedUrl(file);
          file.presignedUrlResponse = response
        } catch (error) {
          this.presentErrorToast('An error occured getting a presigned URL.', 'danger');
          this.createAssistantFileService.removeFile(file);
        }
      }
    }
  }

  private addDataSource(dataSource: DataSource) {
    this.createAssistantFileService.addDataSource(dataSource);
  }

  private removeDataSource(dataSource: DataSource) {
    this.createAssistantFileService.removeDataSource(dataSource);
  }

  private initiateFileUploads() {
    for (const file of this.files()) {
      if (!file.uploaded) {
        this.uploadFileToS3(file);
      }
    }
  }

  private uploadFileToS3(fw: FileWrapper) {
    this.fileUploadService.uploadAndGetMetadata(fw).subscribe({
      next: result => {
        if (result.type === 'upload') {
          fw.progress = result.data.progress;
        } else if (result.type === 'metadata') {
          const dataSource = this.createAssistantFileService.createDataSource(result.data, fw);
          this.addDataSource(dataSource);
        }
      },
      error: (error) => {
        this.presentErrorToast('An error occured uploading to S3.', 'danger');
        this.createAssistantFileService.removeFile(fw);
      },
      complete: () => {
        fw.uploaded = true;
      }
    });
  }

  private createFileWrapperFromUploadedFile(uploadedFile: UploadedFile): FileWrapper {
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

  private async presentErrorToast(message: string, color: string, duration: number = 0) {
    const toast = await this.toastController.create({
      message,
      color,
      duration,
      buttons: [
        {
          text: 'Close', 
          role: 'cancel' 
        }
      ]
    });
    toast.present();
  }


}
