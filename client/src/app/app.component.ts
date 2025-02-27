
import { Component, OnInit } from '@angular/core';
import { AsyncPipe, NgIf } from '@angular/common';
import { IonHeader, IonToolbar, IonIcon, IonSegmentView, IonSegment, IonSegmentButton, IonSegmentContent, IonApp, IonSplitPane, IonMenu, IonContent, IonRouterOutlet, IonImg, IonButton } from '@ionic/angular/standalone';
import { ConversationsMenuComponent } from './side-nav/conversations-menu/conversations-menu.component';
import { addIcons } from 'ionicons';
import { bodyOutline, briefcaseOutline, chatbox, createOutline, settingsOutline, shareSocialOutline } from 'ionicons/icons';
import { ShareMenuComponent } from './side-nav/share-menu/share-menu.component';
import { WorkspacesMenuComponent } from './side-nav/workspaces-menu/workspaces-menu.component';
import { ThemeService } from './services/theme.service';
import { TooltipDirective } from './core/tooltip.directive';
import { AssistantsMenuComponent } from './side-nav/assistants-menu/assistants-menu.component';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  imports: [NgIf, AsyncPipe, IonButton, IonHeader, IonToolbar, IonIcon, IonSegmentView, IonSegment, IonSegmentButton, IonSegmentContent, IonApp, IonSplitPane, IonMenu, IonContent, IonRouterOutlet, ConversationsMenuComponent, ShareMenuComponent, WorkspacesMenuComponent, TooltipDirective, AssistantsMenuComponent],
})
export class AppComponent implements OnInit {
  logo$: Observable<string> = this.themeService.logo$;
  
  constructor(
    private themeService: ThemeService) {
    addIcons({chatbox, shareSocialOutline, settingsOutline, briefcaseOutline, bodyOutline, createOutline})
  }

  ngOnInit() {
  }
  
}
