import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { ModalController, IonNav } from '@ionic/angular/standalone';
import { FormBuilder, FormGroup, Validators, FormArray, ReactiveFormsModule } from '@angular/forms';
import { validateAllFormFields } from 'src/app/shared/form-utils';
import { AssistantDetailsComponent } from './assistant-details/assistant-details.component';
import { AssistantResponseItem } from 'src/app/models/assistant.model';

@Component({
  selector: 'app-create-assistant-modal',
  templateUrl: './create-assistant-modal.component.html',
  styleUrls: ['./create-assistant-modal.component.scss'],
  standalone: true,
  imports: [IonNav, ReactiveFormsModule]
})
export class CreateAssistantModalComponent implements OnInit {
  @Input() assistant: AssistantResponseItem | undefined;
  @ViewChild('nav', {read: ElementRef, static: true}) nav!: ElementRef<IonNav>
  assistantForm: FormGroup = this.fb.group({
    name: ['', Validators.required],
    description: ['', Validators.required],
    assistantId: [''],
    tags: this.fb.array([], Validators.required),
    instructions: ['', Validators.required],
    disclaimer: [''],
    uri: [''],
    dataSources: this.fb.array([], Validators.required),
    dataSourceOptions: this.fb.group({
      insertAttachedDocumentsMetadata: [false],
      insertAttachedDocuments: [false],
      insertConversationDocuments: [false],
      disableDataSources: [false],
      insertConversationDocumentsMetadata: [false],
      ragConversationDocuments: [false],
      ragAttachedDocuments: [false]
    })
  });

  constructor(private modalController: ModalController, private fb: FormBuilder) { }


  ngOnInit() {
    if(this.assistant) {
      this.assistantForm.patchValue(this.assistant);
      if (this.assistant.dataSources) {
        this.assistant.dataSources.forEach(dataSource => {
          this.dataSources.push(this.fb.group(dataSource));
        });
      }
    }
    this.nav.nativeElement.setRoot(AssistantDetailsComponent, { nav: this.nav, form: this.assistantForm });
  }


  get tags(): FormArray {
    return this.assistantForm.get('tags') as FormArray;
  }

  get dataSources(): FormArray {
    return this.assistantForm.get('dataSources') as FormArray;
  }

  addTag() {
    // this.tags.push(this.fb.control(tag, Validators.required));
  }

  addDataSource() {
    // this.dataSources.push(this.fb.group(dataSource));
  }

  dismiss() {
    this.modalController.dismiss();
  }

  onSubmit() {
    if (this.assistantForm.valid) {
      console.log(this.assistantForm.value);
      // Handle form submission logic here
    } else {
      validateAllFormFields(this.assistantForm);
    }
  }
}
