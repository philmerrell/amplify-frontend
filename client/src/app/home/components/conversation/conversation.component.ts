import { Component, effect, input, OnInit } from '@angular/core';
import { Conversation } from 'src/app/models/conversation.model';
import { IonGrid, IonRow, IonCol, IonSpinner, IonContent } from "@ionic/angular/standalone";
import { MarkdownComponent } from 'ngx-markdown';

@Component({
  selector: 'app-conversation',
  templateUrl: './conversation.component.html',
  styleUrls: ['./conversation.component.scss'],
  imports: [IonSpinner, IonGrid, IonRow, IonCol, MarkdownComponent],
  standalone: true,
})
export class ConversationComponent  implements OnInit {
  readonly conversation = input<Conversation>();
  readonly loading = input<boolean>();
  readonly scroller = input<IonContent>();
  
  constructor() {
    effect(() => {
        if (this.conversation()!.messages.length > 3) {
          this.scrollToLatestUserMessage()
        }
      
    }) 
  }

  ngOnInit() {}

  scrollToLatestUserMessage() {
    const lastUserMessage = this.conversation()?.messages.filter(item => item.role === 'user').pop();
    if(lastUserMessage) {
      setTimeout(() => {
        const element = document.getElementById(lastUserMessage.id);
        this.scroller()?.scrollByPoint(0, element!.offsetTop, 700)
      }, 300)
    }
  }

  



}
