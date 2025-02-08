import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonToolbar, IonHeader, IonTitle, IonContent, IonList, IonButtons, IonButton, ModalController, IonItem, IonInput, IonTextarea, IonFooter } from "@ionic/angular/standalone";

@Component({
  selector: 'app-create-prompt-template',
  templateUrl: './create-prompt-template.component.html',
  styleUrls: ['./create-prompt-template.component.scss'],
  standalone: true,
  imports: [IonTextarea, IonInput, IonButton, IonButtons, IonContent, IonTitle, IonHeader, IonToolbar, ReactiveFormsModule, IonFooter ]
})
export class CreatePromptTemplateComponent  implements OnInit {
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
