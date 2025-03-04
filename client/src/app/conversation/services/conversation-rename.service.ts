import { Injectable, signal, Signal, WritableSignal } from '@angular/core';
import { SseClient } from 'ngx-sse-client';
import { Conversation } from 'src/app/models/conversation.model';
import { Model } from 'src/app/models/model.model';
import { ConversationService } from 'src/app/services/conversation.service';
import { ModelService } from 'src/app/services/model.service';
import { v4 as uuidv4 } from 'uuid';
import { environment } from '../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class ConversationRenameService {
  private renamedConversationTitle = '';
  private conversationRename: WritableSignal<{loading: boolean, name: string, conversationId: string}> = signal({loading: false, name: '', conversationId: ''});
  private currentConversation: WritableSignal<Conversation> = this.conversationService.getCurrentConversation();
  private selectedModel: Signal<Model> = this.modelService.getSelectedModel();
  private conversations: WritableSignal<Conversation[]> = this.conversationService.getConversations();

  constructor(
    private sseClient: SseClient,
    private conversationService: ConversationService,
    private modelService: ModelService
  ) {}

  getConversationRename(): Signal<{loading: boolean, name: string, conversationId: string}> {
    return this.conversationRename;
  }

  renameConversation(userInput: string) {
    const requestObject = this.createRenameRequestObject(userInput);
    const chatEndpoint = environment.chatEndpoint;
    this.conversationRename.set({loading: true, name: '', conversationId: this.currentConversation().id  })


    this.sseClient.stream(chatEndpoint, { keepAlive: false, responseType: 'event' }, { body: requestObject }, 'POST' )
      .subscribe((event) => {
        if (event.type === 'error') {
          const errorEvent = event as ErrorEvent;
          // console.error(errorEvent);
        } else {
          const message = event as MessageEvent;
          this.parseRenameMessageEvent(message)
        }
      });

  }

  private parseRenameMessageEvent(messageEvent: MessageEvent) {
    try {
      const message = JSON.parse(messageEvent.data);
      // This case contains the response text we want to compile
      if (message.s === 0 && typeof message.d === 'string') {
        this.renamedConversationTitle = this.renamedConversationTitle += message.d;
        this.conversationRename.set({loading: false, name: this.renamedConversationTitle, conversationId: this.currentConversation().id  })
      }
      // We are done
      if (message.s === 0 && message.type === 'end') {
        this.conversationRename.set({loading: false, name: this.renamedConversationTitle, conversationId: this.currentConversation().id  })
        this.currentConversation.update(c => ({...c, name: this.renamedConversationTitle }))
        this.conversations.update((c: Conversation[]) => {
          return c.map(conversation => 
            conversation.id === this.currentConversation().id ? { ...conversation, name: this.renamedConversationTitle } : conversation
          )
        })
        this.renamedConversationTitle = '';
        this.conversationService.saveConversation(this.currentConversation());
      }
    } catch(error) {
      this.renamedConversationTitle = ''
      // console.error(`Error in JSON.parse: ${error}`)
    }
  }

  // TODO: Refactor when done with POC...
  private createRenameRequestObject(userInput: string) {
    const prompt = 'Respond with only the title name and nothing else.';
    const systemMessage = {
      content: prompt,
      role: 'system'
    };
    const renameMessage = {
      content: `Look at the following prompt: "${userInput}" \n\nYour task: As an AI proficient in summarization, create a short concise title for the given prompt. Ensure the title is under 30 characters.`,
      role: 'user'
    }

    const model = this.selectedModel();

    return {
      dataSources: [], // TODO: 
      max_tokens: 10, // TODO: How is this derived?
      messages: [
        systemMessage,
        renameMessage
      ],
      model: model.id, // Can model change in a conversation?
      options: { // TODO: Better understand what options can be and where derived... 
        maxTokens: 10,
        model: model,
        prompt: prompt, // TODO: getSelectedPrompt
        requestId: uuidv4(),
        skipCodeInterpreter: true,
        skipRag: true
      },
      stream: true,
      temperature: 0.5,
    }
  }
}
