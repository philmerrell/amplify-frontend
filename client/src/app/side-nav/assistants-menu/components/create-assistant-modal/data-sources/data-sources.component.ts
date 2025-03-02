import { 
  Component, 
  ElementRef, 
  inject, 
  Input, 
  OnInit, 
  Resource, 
  ResourceStatus, 
  Signal 
} from '@angular/core';
import { 
  IonHeader, 
  IonToolbar, 
  IonButtons, 
  IonBackButton, 
  IonTitle, 
  IonContent, 
  IonFooter, 
  IonButton, 
  IonIcon, 
  IonList, 
  IonItem, 
  IonLabel, 
  IonSkeletonText, 
  IonText, 
  IonBadge, 
  IonSegment, 
  IonSegmentButton, 
  IonSegmentView, 
  IonSegmentContent, 
  IonNav, 
  ToastController, 
  IonThumbnail, 
  IonSpinner 
} from "@ionic/angular/standalone";
import { addIcons } from 'ionicons';
import { 
  chevronForwardOutline, 
  checkmarkOutline, 
  documentOutline, 
  cloudUploadOutline, 
  fileTrayOutline, 
  close, 
  checkmarkCircle 
} from 'ionicons/icons';
import { SelectUploadedFileService, UploadedFile } from 'src/app/conversation/components/select-uploaded-file/select-uploaded-file.service';
import { FileUploadService, FileWrapper } from 'src/app/conversation/services/file-upload.service';
import { FileTypeIconPipe } from "../../../../../conversation/components/select-uploaded-file/pipes/file-type-icon.pipe";
import { DatePipe } from '@angular/common';
import { FileTypePipe } from "../../../../../conversation/components/select-uploaded-file/pipes/file-type.pipe";
import { FileDropZoneDirective } from 'src/app/conversation/components/chat-input/file-drop-zone.directive';
import { DataSource } from 'src/app/models/chat-request.model';
import { CreateAssistantFileService } from '../create-assistant-file.service';
import { FormGroup } from '@angular/forms';
import { AdvancedSettingsComponent } from '../advanced-settings/advanced-settings.component';

/**
 * The DataSourcesComponent is responsible for managing and uploading data source files 
 * for an assistant creation workflow. It handles file selection (both via drag & drop 
 * and browse), retrieves S3 pre-signed URLs, manages the upload process, and transitions 
 * to the next step once files are processed.
 */
@Component({
  selector: 'app-data-sources',
  templateUrl: './data-sources.component.html',
  styleUrls: ['./data-sources.component.scss'],
  standalone: true,
  imports: [
    IonSpinner, 
    FileDropZoneDirective, 
    IonSegmentButton, 
    IonSegment, 
    IonBadge, 
    IonText, 
    IonSkeletonText, 
    IonLabel, 
    IonItem, 
    IonList, 
    IonIcon, 
    IonButton, 
    IonFooter, 
    IonContent, 
    IonTitle, 
    IonBackButton, 
    IonButtons, 
    IonToolbar, 
    IonHeader, 
    FileTypeIconPipe, 
    DatePipe, 
    FileTypePipe, 
    IonSegmentView, 
    IonSegmentContent, 
    IonThumbnail
  ]
})
export class DataSourcesComponent implements OnInit {
  /**
   * This form is passed from the parent component, 
   * containing data needed for the creation of an assistant file.
   */
  @Input() form!: FormGroup;

  /**
   * A reference to the IonNav element, allowing programmatic navigation 
   * within the Ionic stack (pushing new pages, etc.).
   */
  @Input() nav!: ElementRef<IonNav>;

  /**
   * The SelectUploadedFileService manages a Resource object for the user's files. 
   * This Resource is used to display and toggle selection of existing uploaded files.
   */
  private selectUploadedFileService: SelectUploadedFileService = inject(SelectUploadedFileService);

  /**
   * The FileUploadService provides functionality to create file wrappers, 
   * fetch pre-signed URLs for uploads, and actually upload files to S3.
   */
  private fileUploadService: FileUploadService = inject(FileUploadService);

  /**
   * The CreateAssistantFileService is used to store and manage all file-related data 
   * during the assistant file creation flow, including the final list of data sources.
   */
  private createAssistantFileService: CreateAssistantFileService = inject(CreateAssistantFileService);

  /**
   * The ToastController from Ionic is used to present non-blocking messages or errors to the user.
   */
  private toastController: ToastController = inject(ToastController);

  /**
   * Tracks the Resource containing the user's uploaded files. 
   * The ResourceStatus enum is used to check states (idle, loading, success, error, etc.).
   */
  myFilesResource: Resource<UploadedFile[] | undefined> = this.selectUploadedFileService.myFilesResource;

  /**
   * Exposes the ResourceStatus enum for reference in the template or component logic.
   */
  status = ResourceStatus;

  /**
   * A Signal (reactive state) representing the current list of file wrappers. 
   * These files may come from local uploads or from previously uploaded user files.
   */
  files: Signal<FileWrapper[]> = this.createAssistantFileService.getFiles();

  /**
   * Sets up the component by injecting the Ionicons and 
   * registering icons that will be used for file management UI.
   */
  constructor() {
    addIcons({
      fileTrayOutline,
      documentOutline,
      close,
      checkmarkCircle,
      checkmarkOutline,
      chevronForwardOutline,
      cloudUploadOutline
    });
  }

  /**
   * Called once after the component is constructed; here it's left empty, 
   * but can be used to initialize logic related to data sources.
   */
  ngOnInit() {}

  /**
   * Handles the file drop event, which is fired by the custom FileDropZoneDirective 
   * when the user drags and drops files into the drop zone. 
   * This method adds files to the list, fetches pre-signed URLs, and initiates uploads.
   */
  async onFileDropped(files: File[]) {
    this.addFilesToList(files);
    await this.getPresignedUrlForUpload();
    this.initiateFileUploads();
  }

  /**
   * Handles files selected via the file browser dialog. 
   * This method is typically triggered by <input type="file"> events.
   */
  async fileBrowseHandler(event: any) {
    const files: File[] = event.files;
    this.addFilesToList(files);
    await this.getPresignedUrlForUpload();
    this.initiateFileUploads();
  }

  /**
   * Takes an array of files, creates a FileWrapper object for each one, 
   * and adds them to the CreateAssistantFileService for tracking.
   */
  async addFilesToList(files: Array<any>) {  
    for (const file of files) {
      const fw = this.fileUploadService.createFileWrapperObj(file);
      this.createAssistantFileService.addFile(fw);
    }
  }

  /**
   * Removes a file from the current tracked file list. 
   * If the file exists in `myFilesResource`, it toggles the file's selection.
   */
  removeFile(file: FileWrapper) {
    const foundMyFile = this.myFilesResource.value()!.find(f => `s3://${f.id}` === file.id);
    if (foundMyFile) {        
      foundMyFile.selected = false;
    }
    this.createAssistantFileService.removeFile(file);
  }

  /**
   * Handles the selection or deselection of a previously uploaded file (from the user's library). 
   * Updates both the file selection in `myFilesResource` and the internal list of tracked FileWrappers.
   */
  handleMyFileSelect(uploadedFile: UploadedFile) {
    if (uploadedFile.selected) {
      this.unSelectMyFile(uploadedFile);
    } else {
      this.selectMyFile(uploadedFile);
    }
    uploadedFile.selected = !uploadedFile.selected;
  }

  /**
   * Proceeds to the next step in the workflow after verifying that at least one file is selected 
   * and all selected files are fully uploaded. Presents a toast if no files are selected or 
   * if files are still uploading.
   */
  async handleNext() {
    if (this.files().length === 0) {
      this.presentErrorToast('Please upload at least one file.', 'dark', 3000);
    } else {
      this.next();
    }
  }

  /**
   * Attempts to navigate to the AdvancedSettingsComponent if all files are uploaded. 
   * Otherwise, a toast is displayed instructing the user to wait.
   */
  private async next() {
    if (this.allFilesUploaded()) {
      this.nav.nativeElement.push(AdvancedSettingsComponent, { form: this.form, nav: this.nav });
    } else {
      const top = await this.toastController.getTop();
      if (!top) {
        this.presentErrorToast('Please wait for all files to upload.', 'dark', 3000);
      }
    }
  }

  /**
   * Checks whether every file in the files Signal is fully uploaded (uploaded = true).
   * @returns True if all files are uploaded, otherwise false.
   */
  allFilesUploaded(): boolean {
    return this.files().every(file => file.uploaded);
  }

  /**
   * Deselects a previously uploaded file, removing its corresponding FileWrapper object 
   * and its associated data source entry.
   */
  private unSelectMyFile(uploadedFile: UploadedFile) {
    const fw = this.createFileWrapperFromUploadedFile(uploadedFile);
    this.createAssistantFileService.removeFile(fw);
    const dataSource = this.selectUploadedFileService.createDataSourceFromUplodedFile(uploadedFile);
    this.removeDataSource(dataSource);
  }

  /**
   * Selects a previously uploaded file by converting it into a FileWrapper, 
   * adding it to the tracked files, and creating a corresponding data source.
   */
  private selectMyFile(uploadedFile: UploadedFile) {
    const fw = this.createFileWrapperFromUploadedFile(uploadedFile);
    this.createAssistantFileService.addFile(fw);
    const dataSource = this.selectUploadedFileService.createDataSourceFromUplodedFile(uploadedFile);
    this.addDataSource(dataSource);
  }

  /**
   * Iterates through all local file wrappers that have not yet been uploaded and 
   * attempts to fetch a pre-signed URL for each. If any fail, a toast is shown 
   * and the file is removed from the list.
   */
  private async getPresignedUrlForUpload() {
    for (const file of this.files()) {
      if (!file.uploaded) {
        try {
          const response = await this.fileUploadService.getPresignedUrl(file);
          file.presignedUrlResponse = response;
        } catch (error) {
          this.presentErrorToast('An error occured getting a presigned URL.', 'danger');
          this.createAssistantFileService.removeFile(file);
        }
      }
    }
  }

  /**
   * Adds a data source reference to the CreateAssistantFileService. 
   * Used after a file is successfully uploaded or retrieved from existing user files.
   */
  private addDataSource(dataSource: DataSource) {
    this.createAssistantFileService.addDataSource(dataSource);
  }

  /**
   * Removes a data source reference from the CreateAssistantFileService. 
   * Typically called when a user deselects or removes a file.
   */
  private removeDataSource(dataSource: DataSource) {
    this.createAssistantFileService.removeDataSource(dataSource);
  }

  /**
   * Kicks off the upload process for all files that have not yet been marked as uploaded. 
   * Each file is uploaded to S3, and upon success, relevant metadata is processed, 
   * and progress is updated.
   */
  private initiateFileUploads() {
    for (const file of this.files()) {
      if (!file.uploaded) {
        this.uploadFileToS3(file);
      }
    }
  }

  /**
   * Utilizes the FileUploadService to upload the FileWrapper to S3. 
   * Progress is tracked in real-time, and upon successful metadata retrieval, 
   * a corresponding data source entry is created.
   */
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

  /**
   * Converts an UploadedFile object into a FileWrapper object, 
   * mirroring the properties used for local file uploads. 
   * This is needed so that existing user files can integrate 
   * with the same upload/selection pipeline.
   */
  private createFileWrapperFromUploadedFile(uploadedFile: UploadedFile): FileWrapper {
    return {
      name: uploadedFile.name,
      id: `s3://${uploadedFile.id}`,
      uploaded: true,
      progress: 100,
      file: {
        type: uploadedFile.type
      } as File
    };
  }

  /**
   * Presents a dismissible Toast message to the user with customizable text, color, and duration. 
   * This utility method simplifies error or info messaging throughout the component.
   */
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
