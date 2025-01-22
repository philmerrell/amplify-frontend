import { Component, effect, input, OnInit } from '@angular/core';
import { Conversation } from 'src/app/models/conversation.model';
import { IonGrid, IonRow, IonCol, IonSpinner, IonContent, IonChip, IonIcon, IonLabel } from "@ionic/angular/standalone";
import { MarkdownComponent } from 'ngx-markdown';
import { FileTypeIconPipe } from "../select-uploaded-file/pipes/file-type-icon.pipe";
import { addIcons } from 'ionicons';
import { documentOutline, imageOutline, listOutline, readerOutline } from 'ionicons/icons';

@Component({
  selector: 'app-conversation-text',
  templateUrl: './conversation-text.component.html',
  styleUrls: ['./conversation-text.component.scss'],
  imports: [IonLabel, IonIcon, IonChip, IonSpinner, IonGrid, IonRow, IonCol, MarkdownComponent, FileTypeIconPipe],
  standalone: true,
})
export class ConversationTextComponent  implements OnInit {
  readonly conversation = input<Conversation>();
  readonly loading = input<boolean>();
  readonly scroller = input<IonContent>();
  
  constructor() {
    addIcons({readerOutline,documentOutline,imageOutline,listOutline})
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
