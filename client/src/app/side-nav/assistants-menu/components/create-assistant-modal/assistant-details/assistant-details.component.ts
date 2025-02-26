import { Component, ElementRef, inject, Input, OnInit } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { IonNav, IonHeader, IonTitle, IonToolbar, IonButtons, IonButton, IonContent, IonItemDivider, IonInput, IonTextarea, ModalController, IonFooter, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { chevronForwardOutline } from 'ionicons/icons';
import { validateAllFormFields } from 'src/app/shared/form-utils';
import { DataSourcesComponent } from '../data-sources/data-sources.component';

@Component({
  selector: 'app-assistant-details',
  templateUrl: './assistant-details.component.html',
  styleUrls: ['./assistant-details.component.scss'],
  standalone: true,
  imports: [IonIcon, IonFooter, IonTextarea, IonInput, IonItemDivider, IonContent, IonButton, IonButtons, IonHeader, IonToolbar, IonTitle, ReactiveFormsModule]
})
export class AssistantDetailsComponent  implements OnInit {
  @Input() form!: FormGroup;
  @Input() nav!: ElementRef<IonNav>;
  private modalController: ModalController = inject(ModalController);

  constructor() {
    addIcons({chevronForwardOutline});
  }

  ngOnInit() {}

  dismiss() {
    this.modalController.dismiss();
  }

  next() {
    if(this.form.controls['name'].valid && this.form.controls['instructions'].valid) {
      this.nav.nativeElement.push(DataSourcesComponent, { nav: this.nav.nativeElement, form: this.form });
    } else {
      validateAllFormFields(this.form);
    }
  }

}
