import { Component, OnInit } from '@angular/core';
import { ModalController, IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonSegment, IonSegmentButton, IonLabel, IonSegmentView, IonSegmentContent, IonFooter } from '@ionic/angular/standalone';
import { UploadedFilesListComponent } from './components/uploaded-files-list/uploaded-files-list.component';

@Component({
  selector: 'app-select-uploaded-file',
  templateUrl: './select-uploaded-file.component.html',
  styleUrls: ['./select-uploaded-file.component.scss'],
  imports: [UploadedFilesListComponent, IonFooter, IonSegmentButton, IonSegment, IonSegmentView, IonSegmentContent, IonButton, IonContent, IonTitle, IonToolbar, IonHeader, IonLabel ],
  standalone: true,
})
export class SelectUploadedFileComponent  implements OnInit {
  

  constructor(
    private modalController: ModalController
  ) {}


  ngOnInit() {}

  dismiss() {
    this.modalController.dismiss();
  }
  

  

}
