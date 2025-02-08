
import { Component, OnInit, Signal } from '@angular/core';
import { IonHeader, IonToolbar, IonIcon, IonSegmentView, IonSegment, IonSegmentButton, IonSegmentContent, IonApp, IonSplitPane, IonMenu, IonContent, IonRouterOutlet, IonImg } from '@ionic/angular/standalone';
import { ConversationsMenuComponent } from './side-nav/conversations-menu/conversations-menu.component';
import { addIcons } from 'ionicons';
import { bodyOutline, briefcaseOutline, chatbox, settingsOutline, shareSocialOutline } from 'ionicons/icons';
import { ShareMenuComponent } from './side-nav/share-menu/share-menu.component';
import { WorkspacesMenuComponent } from './side-nav/workspaces-menu/workspaces-menu.component';
import { ThemeService } from './services/theme.service';
import { TooltipDirective } from './core/tooltip.directive';
import { AssistantsMenuComponent } from './side-nav/assistants-menu/assistants-menu.component';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  imports: [IonHeader, IonToolbar, IonIcon, IonSegmentView, IonSegment, IonSegmentButton, IonSegmentContent, IonApp, IonSplitPane, IonMenu, IonContent, IonRouterOutlet, ConversationsMenuComponent, ShareMenuComponent, WorkspacesMenuComponent, IonImg, TooltipDirective, AssistantsMenuComponent],
})
export class AppComponent implements OnInit {
  logo: Signal<string> = this.themeService.getLogo();
  
  constructor(
    private themeService: ThemeService) {
    addIcons({chatbox, shareSocialOutline, settingsOutline, briefcaseOutline, bodyOutline})
  }

  ngOnInit() {
    this.themeService.initTheme();
  }
  
}
