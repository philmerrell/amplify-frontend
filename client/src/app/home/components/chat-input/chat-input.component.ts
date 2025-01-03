import { Component, effect, OnInit, Signal, ViewChild } from '@angular/core';
import { IonButton, IonIcon, IonCard, IonCardContent, IonTextarea } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { arrowUpOutline, addOutline, copyOutline, atOutline, stop } from 'ionicons/icons';
import { ChatRequestService } from '../../services/chat-request.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-chat-input',
  templateUrl: './chat-input.component.html',
  styleUrls: ['./chat-input.component.scss'],
  standalone: true,
  imports: [IonButton, IonIcon, IonCard, IonCardContent, IonTextarea, FormsModule]
})
export class ChatInputComponent  implements OnInit {
  chatLoading: Signal<boolean> = this.chatRequestService.getChatLoading();
  message: string = '';
  loading: boolean = false;
  error = '';
  
  constructor(private chatRequestService: ChatRequestService) {
    addIcons({stop,arrowUpOutline,copyOutline,addOutline,atOutline});
  }

  ngOnInit() {}

  

  handleSubmitChat() {
    if (this.chatLoading()) {
      this.cancelChatRequest()
    } else {
      this.submitChatRequest()
    }
  }

  handleEnterKey(event: any) {
    if (event.which === 13 && !event.shiftKey) {
      event.preventDefault();
      this.submitChatRequest();
    }
  }

  private submitChatRequest() {
    const message = this.message.trim();
    if (message !== '') {
      this.chatRequestService.submitChatRequest(this.message);
    }
    this.message = ''
  }

  private cancelChatRequest() {
    this.chatRequestService.cancelChatRequest();
  }

}
