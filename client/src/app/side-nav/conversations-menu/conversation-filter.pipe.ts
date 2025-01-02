import { Pipe, PipeTransform, Signal } from '@angular/core';
import { Conversation } from 'src/app/models/conversation.model';
@Pipe({
  name: 'filter',
  standalone: true,
  pure: false
})
export class ConversationFilterPipe implements PipeTransform {
  transform(conversations: Signal<Conversation[]>, folderId: string): Conversation[] {

    const filteredConversations = conversations().filter(c => c.folderId === folderId);
    return filteredConversations;
  }
}