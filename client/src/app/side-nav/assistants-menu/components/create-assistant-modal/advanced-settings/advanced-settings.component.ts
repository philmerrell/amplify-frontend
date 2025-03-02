import { Component, ElementRef, inject, Input, OnInit } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonContent, IonFooter, ModalController, IonBackButton, IonItemDivider, IonItem, IonCheckbox, IonNav } from "@ionic/angular/standalone";

@Component({
  selector: 'app-advanced-settings',
  templateUrl: './advanced-settings.component.html',
  styleUrls: ['./advanced-settings.component.scss'],
  standalone: true,
  imports: [ReactiveFormsModule, IonCheckbox, IonItem, IonItemDivider, IonBackButton, IonFooter, IonContent, IonButton, IonButtons, IonTitle, IonToolbar, IonHeader]
})
export class AdvancedSettingsComponent  implements OnInit {
  @Input() form!: FormGroup;
  @Input() nav!: ElementRef<IonNav>;

  private modalController: ModalController = inject(ModalController);

  constructor() { }

  ngOnInit() {}

  dismiss() {
    this.modalController.dismiss();
  }

  createAssistant() {
    console.log(this.form.value);
  }

}
