import { Component, OnInit } from '@angular/core';
import { IonSkeletonText, IonList, IonBadge, ToastController, IonIcon, IonLabel, IonText, IonItem } from "@ionic/angular/standalone";
import { ChatRequestService } from 'src/app/conversation/services/chat-request.service';
import { SelectUploadedFileService, UploadedFile } from '../../select-uploaded-file.service';
import { FileWrapper } from 'src/app/conversation/services/file-upload.service';
import { FileTypePipe } from "../../pipes/file-type.pipe";
import { FileTypeIconPipe } from "../../pipes/file-type-icon.pipe";
import { DatePipe } from '@angular/common';
import { addIcons } from 'ionicons';
import { checkmarkOutline, documentOutline, imageOutline, listOutline, readerOutline } from 'ionicons/icons';

@Component({
  selector: 'app-uploaded-files-list',
  templateUrl: './uploaded-files-list.component.html',
  styleUrls: ['./uploaded-files-list.component.scss'],
  imports: [IonItem, IonIcon, IonText, IonBadge, IonSkeletonText, IonList, IonLabel, FileTypePipe, FileTypeIconPipe, DatePipe],
  standalone: true,
})
export class UploadedFilesListComponent  implements OnInit {
  files: UploadedFile[] = [];
  filesRequestComplete: boolean = false;

  constructor(
    private selectUploadedFileService: SelectUploadedFileService,
    private chatRequestService: ChatRequestService,
    private toastController: ToastController
  ) {
    addIcons({checkmarkOutline,readerOutline,documentOutline,imageOutline,listOutline});
  }

  ngOnInit() {
    this.getFiles();
  }

  async getFiles() {
    try {
      this.files = await this.selectUploadedFileService.getUploadedFilesList();
    } catch (error) {
      this.presentToast('An error has occurred retrieving files list.', 'danger', 0);
      console.error(error);
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
    this.chatRequestService.removeFile(fw);
  }

  addFile(uploadedFile: UploadedFile) {
    const fw = this.createFileWrapperFromUploadedFile(uploadedFile);
    this.chatRequestService.addFile(fw);
    const dataSource = this.selectUploadedFileService.createDataSourceFromUplodedFile(uploadedFile);
    this.chatRequestService.addDataSource(dataSource);
    this.presentToast('File Added', 'dark', 3000);
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

  async presentToast(message: string, color: 'dark' | 'danger', duration: number = 0) {
    const toast = await this.toastController.create({
      message,
      color,
      duration,
      buttons: ['OK']
    });
    toast.present();
  }

}
