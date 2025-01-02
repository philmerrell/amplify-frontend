
import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonIcon, IonSegmentView, IonSegment, IonSegmentButton, IonSegmentContent, IonApp, IonSplitPane, IonMenu, IonContent, IonRouterOutlet } from '@ionic/angular/standalone';
import { ConversationsMenuComponent } from './side-nav/conversations-menu/conversations-menu.component';
import { addIcons } from 'ionicons';
import { briefcaseOutline, chatbox, settingsOutline, shareSocialOutline } from 'ionicons/icons';
import { SettingsMenuComponent } from './side-nav/settings-menu/settings-menu.component';
import { ShareMenuComponent } from './side-nav/share-menu/share-menu.component';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  imports: [IonHeader, IonToolbar, IonIcon, IonSegmentView, IonSegment, IonSegmentButton, IonSegmentContent, IonApp, IonSplitPane, IonMenu, IonContent, IonRouterOutlet, ConversationsMenuComponent, SettingsMenuComponent, SettingsMenuComponent, ShareMenuComponent],
})
export class AppComponent {

  constructor() {
    addIcons({chatbox, shareSocialOutline, settingsOutline, briefcaseOutline})
  }
}
