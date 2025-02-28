import { Component, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  IonButton, 
  IonButtons, 
  IonChip, 
  IonContent, 
  IonHeader, 
  IonIcon, 
  IonInput, 
  IonItem, 
  IonLabel, 
  IonTitle, 
  IonToolbar,
  ModalController,
  IonFooter
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { closeOutline, folderOutline } from 'ionicons/icons';

@Component({
  selector: 'app-new-folder-modal',
  templateUrl: './new-folder-modal.component.html',
  styleUrls: ['./new-folder-modal.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonButton,
    IonButtons,
    IonChip,
    IonContent,
    IonHeader,
    IonIcon,
    IonInput,
    IonItem,
    IonLabel,
    IonTitle,
    IonToolbar,
    IonFooter
  ]
})
export class NewFolderModalComponent {
  readonly folderNameInput = viewChild.required(IonInput);
  
  folderName: string = '';
  
  // Suggested folder names
  suggestedNames: string[] = [
    // Course-based folders
    'CS 202 - Data Structures',
    'MATH 301 - Linear Algebra',
    'ML 527 - Machine Learning',
    
    // Topic-based folders
    'Research Projects',
    'Homework Help',
    'Exam Prep',
    
    // Faculty-specific folders
    'Course Materials',
    'Student Questions',
    'Research Papers',
    
    // Time-based folders
    'Spring 2024',
    'Fall Research',
    
    // Department-specific folders
    'CS Department',
    'Engineering Projects',
    
    // Function-based folders
    'Code Reviews',
    'Lab Assignments',
    'Teaching Materials'
  ];

  constructor(private modalController: ModalController) {
    addIcons({ closeOutline, folderOutline });
  }

  ionViewDidEnter() {
    // Focus the input when the modal is fully visible
    setTimeout(() => {
      this.folderNameInput().setFocus();
    }, 150);
  }

  selectSuggestion(name: string) {
    this.folderName = name;
  }

  cancel() {
    return this.modalController.dismiss(null, 'cancel');
  }

  confirm() {
    if (this.folderName.trim()) {
      return this.modalController.dismiss(this.folderName, 'confirm');
    }
    // If no name is provided, show validation error or use a default name
    this.folderName = 'New Folder';
    return this.modalController.dismiss(this.folderName, 'confirm');
  }
} 