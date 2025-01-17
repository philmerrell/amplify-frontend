import { Component, OnInit, Signal } from '@angular/core';
import { IonButton, IonIcon, IonCard, IonCardContent, IonTextarea, IonChip, IonLabel, IonAvatar, IonBadge, ToastController } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { arrowUpOutline, addOutline, copyOutline, atOutline, stop, pin, close, documentsOutline, documentOutline } from 'ionicons/icons';
import { ChatRequestService } from '../../services/chat-request.service';
import { FormsModule } from '@angular/forms';
import { FileDropZoneDirective } from './file-drop-zone.directive';
import { FileUploadService, FileWrapper } from '../../services/file-upload.service';

@Component({
  selector: 'app-chat-input',
  templateUrl: './chat-input.component.html',
  styleUrls: ['./chat-input.component.scss'],
  standalone: true,
  imports: [IonBadge, IonAvatar, IonLabel, IonChip, IonButton, IonIcon, IonCard, IonCardContent, IonTextarea, FormsModule, FileDropZoneDirective]
})
export class ChatInputComponent  implements OnInit {
  chatLoading: Signal<boolean> = this.chatRequestService.getChatLoading();
  message: string = '';
  loading: boolean = false;
  error = '';
  files: FileWrapper[] = [];
  
  constructor(
    private chatRequestService: ChatRequestService,
    private fileUploadService: FileUploadService,
    private toastController: ToastController) {
    addIcons({documentOutline,close,stop,arrowUpOutline,copyOutline,addOutline,atOutline,documentsOutline,pin});
  }

  ngOnInit() {}

  /**
   * on file drop handler
   */
  async onFileDropped(files: File[]) {
    this.prepareFilesList(files);
    await this.getPresignedUrlForUpload();
    this.initiateFileUploads();
  }

  async fileBrowseHandler(event: any) {
    const files: File[] = event.files;
    this.prepareFilesList(files);
    await this.getPresignedUrlForUpload();
    this.initiateFileUploads();
  }

  deleteFile(index: number) {
    // TODO: Remove from S3 or just from the chat request?
    this.files.splice(index, 1);
  }

  async prepareFilesList(files: Array<any>) {  
    for (const file of files) {
      const fw = this.fileUploadService.createFileWrapperObj(file)
      this.files.push(fw);
    }
  }

  private async getPresignedUrlForUpload() {
    for (const file of this.files) {
      if (!file.uploaded) {
        try {
          const response = await this.fileUploadService.getPresignedUrl(file);
          file.presignedUrlResponse = response
        } catch (error) {
          this.presentErrorToast('An error occured getting a presigned URL.', 'danger');
          const index = this.files.indexOf(file);
          this.files.splice(index, 1);
        }
      }
    }
  }

  private initiateFileUploads() {
    for (const file of this.files) {
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
          console.log('Metadata received:', result.data);
          this.addFileMetaDataToChatRequestDataSources(result.data, fw)
        }
      },
      error: (error) => {
        this.presentErrorToast('An error occured uploading to S3.', 'danger');
        const index = this.files.indexOf(fw);
        this.files.splice(index, 1);
      },
      complete: () => {
        fw.uploaded = true;
      }
    });
  }

  private addFileMetaDataToChatRequestDataSources(s3MetadataResult: any, fw: FileWrapper) {
    console.log(s3MetadataResult);
    const dataSource = {
      id: `s3://${fw.presignedUrlResponse.key}`,
      metadata: {
        ...s3MetadataResult
      },
      name: s3MetadataResult.name,
      type: fw.file.type
    };
    this.chatRequestService.addDataSource(dataSource);
  }

  handleSubmitChat() {
    if (this.chatLoading()) {
      this.cancelChatRequest()
    } else {
      this.submitChatRequest()
    }
  }

  handleEnterKey(event: any) {
    if (event.which === 13 && !event.shiftKey) {
      event.preventDefault();
      this.submitChatRequest();
    }
  }

  private submitChatRequest() {
    const message = this.message.trim();
    if (message !== '') {
      // this.chatRequestService.debugSSEMessages(message);
      this.chatRequestService.submitChatRequest(this.message);
    }
    this.message = ''
  }

  private cancelChatRequest() {
    this.chatRequestService.cancelChatRequest();
  }

  private async presentErrorToast(message: string, color: string) {
    const toast = await this.toastController.create({
      message,
      color,
      duration: 0,
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
