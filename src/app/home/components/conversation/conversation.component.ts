import { JsonPipe } from '@angular/common';
import { Component, input, OnInit, Signal } from '@angular/core';
import { Conversation } from 'src/app/models/conversation.model';
import { IonGrid, IonRow, IonCol } from "@ionic/angular/standalone";
import { MarkdownComponent } from 'ngx-markdown';

@Component({
  selector: 'app-conversation',
  templateUrl: './conversation.component.html',
  styleUrls: ['./conversation.component.scss'],
  imports: [IonGrid, IonRow, IonCol, JsonPipe, MarkdownComponent],
  standalone: true,
})
export class ConversationComponent  implements OnInit {
  readonly conversation = input<Conversation>();
  constructor() { }

  ngOnInit() {}



}
