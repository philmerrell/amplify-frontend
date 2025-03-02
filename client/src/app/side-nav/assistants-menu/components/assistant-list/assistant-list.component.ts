import { Component, inject, OnInit, ResourceStatus } from '@angular/core';
import { AssistantService } from '../../assistant.service';
import { IonIcon, IonLabel, IonSkeletonText, IonItem, IonList, IonPopover, IonButton } from "@ionic/angular/standalone";

@Component({
  selector: 'app-assistant-list',
  templateUrl: './assistant-list.component.html',
  styleUrls: ['./assistant-list.component.scss'],
  standalone: true,
  imports: [IonButton, IonPopover, IonList, IonItem, IonSkeletonText, IonLabel, IonIcon]
})
export class AssistantListComponent  implements OnInit {
  private assistantService: AssistantService = inject(AssistantService);
  
  assistantResource = this.assistantService.assistantResource;
  status = ResourceStatus;
    
  constructor() { }

  ngOnInit() {}

}
