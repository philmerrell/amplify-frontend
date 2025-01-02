import { JsonPipe } from '@angular/common';
import { Component, effect, input, OnInit } from '@angular/core';
import { Conversation } from 'src/app/models/conversation.model';
import { IonGrid, IonRow, IonCol, IonSpinner, IonContent } from "@ionic/angular/standalone";
import { MarkdownComponent } from 'ngx-markdown';

@Component({
  selector: 'app-conversation',
  templateUrl: './conversation.component.html',
  styleUrls: ['./conversation.component.scss'],
  imports: [IonSpinner, IonGrid, IonRow, IonCol, JsonPipe, MarkdownComponent],
  standalone: true,
})
export class ConversationComponent  implements OnInit {
  readonly conversation = input<Conversation>();
  readonly loading = input<boolean>();
  readonly scroller = input<IonContent>();
  
  constructor() {}

  ngOnInit() {
    console.log(this.scroller());
  }



}
