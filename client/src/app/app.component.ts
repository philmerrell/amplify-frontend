
import { Component, OnInit, Signal } from '@angular/core';
import { IonHeader, IonToolbar, IonIcon, IonSegmentView, IonSegment, IonSegmentButton, IonSegmentContent, IonApp, IonSplitPane, IonMenu, IonContent, IonRouterOutlet, IonImg } from '@ionic/angular/standalone';
import { ConversationsMenuComponent } from './side-nav/conversations-menu/conversations-menu.component';
import { addIcons } from 'ionicons';
import { briefcaseOutline, chatbox, settingsOutline, shareSocialOutline } from 'ionicons/icons';
import { SettingsMenuComponent } from './side-nav/settings-menu/settings-menu.component';
import { ShareMenuComponent } from './side-nav/share-menu/share-menu.component';
import { WorkspacesMenuComponent } from './side-nav/workspaces-menu/workspaces-menu.component';
import { ThemeService } from './services/theme.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  imports: [IonHeader, IonToolbar, IonIcon, IonSegmentView, IonSegment, IonSegmentButton, IonSegmentContent, IonApp, IonSplitPane, IonMenu, IonContent, IonRouterOutlet, ConversationsMenuComponent, SettingsMenuComponent, SettingsMenuComponent, ShareMenuComponent, WorkspacesMenuComponent, IonImg],
})
export class AppComponent implements OnInit {
  logo: Signal<string> = this.themeService.getLogo();
  
  constructor(private themeService: ThemeService) {
    addIcons({chatbox, shareSocialOutline, settingsOutline, briefcaseOutline})
  }

  ngOnInit() {
    this.themeService.initTheme();
  }
  
}
