
import { Component } from '@angular/core';
import { IonButton, IonHeader, IonToolbar, IonIcon, IonSegmentView, IonSegment, IonSegmentButton, IonSegmentContent, IonApp, IonSplitPane, IonMenu, IonContent, IonRouterOutlet } from '@ionic/angular/standalone';
import { ConversationsMenuComponent } from './side-nav/conversations-menu/conversations-menu.component';
import { addIcons } from 'ionicons';
import { add, briefcaseOutline, chatbox, folder, settingsOutline, shareSocialOutline } from 'ionicons/icons';
import { SettingsMenuComponent } from './side-nav/settings-menu/settings-menu.component';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  imports: [IonButton, IonHeader, IonToolbar, IonIcon, IonSegmentView, IonSegment, IonSegmentButton, IonSegmentContent, IonApp, IonSplitPane, IonMenu, IonContent, IonRouterOutlet, ConversationsMenuComponent, SettingsMenuComponent, SettingsMenuComponent],
})
export class AppComponent {

  constructor() {
    addIcons({chatbox, shareSocialOutline, settingsOutline, folder, add, briefcaseOutline})
  }
}
