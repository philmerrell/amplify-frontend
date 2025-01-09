import { Component, OnInit, Signal } from '@angular/core';
import { IonButton, IonIcon, IonCard, IonCardContent, IonTextarea, IonChip, IonLabel, IonAvatar, IonBadge, ToastController } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { arrowUpOutline, addOutline, copyOutline, atOutline, stop, pin, close, documentsOutline, documentOutline } from 'ionicons/icons';
import { ChatRequestService } from '../../services/chat-request.service';
import { FormsModule } from '@angular/forms';
import { FileDropZoneDirective } from './file-drop-zone.directive';
import { FileUploadService } from '../../services/file-upload.service';

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
  files: any[] = [];
  
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
    this.uploadFilesToS3();
  }

  /**
   * handle file from browsing
   */
  async fileBrowseHandler(event: any) {
    this.prepareFilesList(event.files);
    await this.getPresignedUrlForUpload();
    this.uploadFilesToS3();
  }

  /**
   * Delete file from files list
   * @param index (File index)
   */
  deleteFile(index: number) {
    this.files.splice(index, 1);
  }

  /**
   * Convert Files list to normal array list
   * @param files (Files List)
   */
    async prepareFilesList(files: Array<any>) {
      
      for (const file of files) {
        file.progress = 0;
        file.uploaded = false;
        this.files.push(file);
      }
  }

  async getPresignedUrlForUpload() {
    for (const file of this.files) {
      if (!file.uploaded) {
        try {
          const response = await this.fileUploadService.getPresignedUrl(file);
          file.uploadUrl = response.uploadUrl
        } catch (error) {
          this.presentToast('An error occured getting a presigned URL.', 'danger');
          const index = this.files.indexOf(file);
          this.files.splice(index, 1);
        }
      }
    }
  }

  uploadFilesToS3() {
    for (const file of this.files) {
      if (!file.uploaded) {
          this.fileUploadService.uploadFileToS3(file.uploadUrl, file)
            .subscribe({
              next: (response) => {
                if (response) {
                  console.log(response);
                  file.progress = response.progress;
  
                  if (response.status === 'complete') {
                    file.uploaded = true;
                  }
                }
              },
              error: (error) => {
                this.presentToast('An error occured uploading to S3.', 'danger');
                const index = this.files.indexOf(file);
                this.files.splice(index, 1);
              }
            })
      }
    }
  }

  /**
   * format bytes
   * @param bytes (File size in bytes)
   * @param decimals (Decimals point)
   */
  formatBytes(bytes: any, decimals: any) {
    if (bytes === 0) {
      return '0 Bytes';
    }
    const k = 1024;
    const dm = decimals <= 0 ? 0 : decimals || 2;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
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
      this.chatRequestService.submitChatRequest(this.message);
    }
    this.message = ''
  }

  private cancelChatRequest() {
    this.chatRequestService.cancelChatRequest();
  }

  private async presentToast(message: string, color: string) {
    const toast = await this.toastController.create({
      message,
      color,
      duration: 5000
    });
    toast.present();
  }

}
