import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonToolbar, IonHeader, IonTitle, IonContent, IonButtons, IonButton, ModalController, IonItem, IonInput, IonTextarea, IonFooter } from "@ionic/angular/standalone";

@Component({
  selector: 'app-create-custom-instructions',
  templateUrl: './create-custom-instructions.component.html',
  styleUrls: ['./create-custom-instructions.component.scss'],
  standalone: true,
  imports: [IonTextarea, IonInput, IonButton, IonButtons, IonContent, IonTitle, IonHeader, IonToolbar, ReactiveFormsModule, IonFooter ]
})
export class CreateCustomInstructionsComponent  implements OnInit {
  form: FormGroup = this.fb.group({
    name: ['', Validators.required],
    description: [''],
    prompt: ['', Validators.required],
    tags: ['']
  });

  constructor(private modalController: ModalController, private fb: FormBuilder) { }

  ngOnInit() {}

  dismiss() {
    this.modalController.dismiss();
  }

  handleSubmit() {
  }

}
