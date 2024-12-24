import { Component, OnInit } from '@angular/core';
import { IonButton, IonIcon, IonCard, IonCardContent, IonTextarea } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { arrowUpOutline, addOutline, copyOutline, atOutline } from 'ionicons/icons';

@Component({
  selector: 'app-chat-input',
  templateUrl: './chat-input.component.html',
  styleUrls: ['./chat-input.component.scss'],
  standalone: true,
  imports: [IonButton, IonIcon, IonCard, IonCardContent, IonTextarea]
})
export class ChatInputComponent  implements OnInit {

  constructor() {
    addIcons({arrowUpOutline, addOutline, copyOutline, atOutline});
  }

  ngOnInit() {}

}
