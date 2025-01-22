import { HttpClient, HttpDownloadProgressEvent, HttpEvent, HttpEventType } from '@angular/common/http';
import { Injectable, Signal, signal, WritableSignal } from '@angular/core';
import { environment } from 'src/environments/environment';
import { SseClient } from 'ngx-sse-client';
import { v4 as uuidv4 } from 'uuid';
import { DeveloperSettingsService } from 'src/app/settings/developer/developer-settings.service';
import { ConversationService } from 'src/app/services/conversation.service';
import { Conversation, Message } from 'src/app/models/conversation.model';
import { ModelService } from 'src/app/services/model.service';
import { Model } from 'src/app/models/model.model';
import { DEFAULT_SYSTEM_PROMPT } from 'src/app/services/prompts';
import { FoldersService } from 'src/app/services/folders.service';
import { firstValueFrom, Subscription } from 'rxjs';
import { DataSource } from 'src/app/models/chat-request.model';
import { FileWrapper } from './file-upload.service';
import { ConversationRenameService } from './conversation-rename.service';

@Injectable({
  providedIn: 'root'
})
export class ChatRequestService {
  private chatLoading: WritableSignal<boolean> = signal(false);
  private conversations: WritableSignal<Conversation[]> = this.conversationService.getConversations();
  private currentConversation: WritableSignal<Conversation> = this.conversationService.getCurrentConversation();
  private currentRequestId = '';
  private dataSources: DataSource[] = [];
  private files: WritableSignal<FileWrapper[]> = signal([]);
  private responseContent = '';
  private responseSubscription: Subscription = new Subscription();
  // private selectedAssistant: WritableSignal<Assistant> = signal({} as Assistant); 
  private selectedModel: Signal<Model> = this.modelService.getSelectedModel();
  private selectedTemperature: Signal<number> = this.modelService.getSelectedTemperature();

  constructor(
    private http: HttpClient,
    private sseClient: SseClient,
    private conversationService: ConversationService,
    private conversationRenameService: ConversationRenameService,
    private developerSettingsService: DeveloperSettingsService,
    private folderService: FoldersService,
    private modelService: ModelService) {
  }

  addFile(fw: FileWrapper) {
    this.files.update(files => {
      return [
        ...files,
        fw
      ]
    });
  }

  removeFile(fileToBeRemoved: FileWrapper) {
    this.files.update(files => files.filter(file => file.id !== fileToBeRemoved.id))
  }

  getFiles(): Signal<FileWrapper[]> {
    return this.files;
  }

  
  addDataSource(dataSource: DataSource) {
    this.dataSources.push(dataSource);
  }

  getChatLoading(): Signal<boolean> {
    return this.chatLoading;
  }

  // debugSSEMessages(message: string) {
  //   const requestObject = this.createRequestObject(message);
  //   this.http
  //     .post(environment.chatEndpoint, requestObject, {
  //       observe: 'events',
  //       responseType: 'text',
  //       reportProgress: true,
  //     })
  //     .subscribe({
  //       next: (event: HttpEvent<string>) => {
  //         if (event.type === HttpEventType.Sent) {
  //           console.log('Sent: ', event);
  //         }
  //         if (event.type === HttpEventType.ResponseHeader) {
  //           console.log('Response Header: ', event);
  //         }
  //         if (event.type === HttpEventType.User) {
  //           console.log('User: ', event);
  //         }
  //         if (event.type === HttpEventType.DownloadProgress) {
  //           const text = (
  //             event as HttpDownloadProgressEvent
  //           ).partialText + '…';
  //           console.log(text);
  //         } else if (event.type === HttpEventType.Response) {
  //           console.log(event)
  //         }
  //       },
  //       error: () => {
          
  //       },
  //     });
  // }
  
  async submitChatRequest(userInput: string) {
    this.updateCurrentConversationWithUserInput(userInput);
    const requestObject = this.createRequestObject(userInput);
    // Refactor after POC
    const chatEndpoint = this.developerSettingsService.getDeveloperChatEndpoint();
    
    this.chatLoading.set(true);

    this.responseSubscription = this.sseClient.stream(environment.chatEndpoint, { keepAlive: false, responseType: 'event' }, { body: requestObject }, 'POST' )
      .subscribe((event) => {
        if (event.type === 'error') {
          const errorEvent = event as ErrorEvent;
          // this.cancelChatRequest();
        } else {
          const message = event as MessageEvent;
          this.parseMessageEvent(message)
        }
      });
  }

  updateCurrentConversationWithUserInput(userInput: string) {
    const userMessage = this.initUserMessage(userInput);

    // If folderId is an empty string, then it is a new conversation
    if (this.currentConversation().folderId === '') {

      const folderId = this.folderService.getFolderId();
      this.currentConversation.update((c: Conversation) => {
        return {
          ...c,
          folderId: folderId,
          messages: [...c.messages, userMessage]
        }
      });

      this.conversations.update((conversations) => [...conversations, this.currentConversation()]);

    } else {
      // This is an existing conversation. Update the currentConversation and update convesations array.

      this.currentConversation.update((c: Conversation) => {
        return {
          ...c,
          messages: [...c.messages, userMessage]
        }
      });

      this.conversations.update((c: Conversation[]) => {
        return c.map(conversation => 
          conversation.id === this.currentConversation().id ? { ...conversation, messages: [...conversation.messages, userMessage] } : conversation
        )
      })
    }
    
  }

  cancelChatRequest() {
    this.responseSubscription.unsubscribe();
    this.chatLoading.set(false);
    // TODO: Refactor after POC
    const chatEndpoint = this.developerSettingsService.getDeveloperChatEndpoint();
    const request = this.http.post(chatEndpoint(), { killSwitch: { requestId: this.currentRequestId, value: true}});

    return firstValueFrom(request);
  }

  private getSystemMessageForChatResponse(conversation: Conversation): Message {

    const lastMessage = conversation.messages[conversation.messages.length - 1];
    let systemMessage: Message;

    if (lastMessage.role !== 'system') {
      systemMessage = this.initSystemMessage();
      this.currentConversation.update((c: Conversation) => {
        return {
          ...c,
          messages: [...c.messages, systemMessage]
        }
      });
    } else {
      systemMessage = lastMessage
    }

    return systemMessage;
  }

  private parseMessageEvent(messageEvent: MessageEvent) {
    const conversation = this.currentConversation();
    const systemMessage = this.getSystemMessageForChatResponse(conversation);    
    const userMessage = conversation.messages[0];

    try {
      const message = JSON.parse(messageEvent.data);
      if (message.s === 'meta') {
        // TODO: Handle meta data from response...
        console.log(message);
      }
      // This case contains the response text we want to compile
      if (message.s === 0 && typeof message.d === 'string') {
        this.responseContent = this.responseContent += message.d;
        systemMessage.content = this.responseContent;
      }
      // We are done
      if (message.s === 0 && message.type === 'end') {
        this.chatLoading.set(false);
        if (conversation.name === 'New Conversation') {
          this.conversationRenameService.renameConversation(userMessage.content);
        }
        this.responseContent = '';
        this.dataSources = [];
        this.files.set([])
      }
    } catch(error) {
      this.responseContent = '';
      // console.error(`Error in JSON.parse: ${error}`)
    }
  }

  private createRequestObject(userInput: string) {
    const model = this.selectedModel();
    const conversation = this.currentConversation();
    this.currentRequestId = uuidv4();
    // const keysToExclude = ['messages', 'temperature', 'max_tokens', 'stream', 'dataSources'];
    // const vendorProps = Object.fromEntries(
    //     Object.entries(chatBody).filter(([key, _]) => !keysToExclude.includes(key))
    // );

    return {
      dataSources: [
        ...this.dataSources
      ], // TODO: 
      max_tokens: 1000, // TODO: How is this derived?
      messages: [
        {
            role: 'system',
            content: DEFAULT_SYSTEM_PROMPT, // TODO: Get user selected prompt
        },
        ...conversation.messages
      ],
      model: model.id, // Can model change in a conversation?
      options: { // TODO: Better understand what options can be and where derived... 
          accountId: 'general_account', // TODO: Where/how is this derived?
          conversationId: conversation.id,
          model: model,
          prompt: DEFAULT_SYSTEM_PROMPT, // TODO: getSelectedPrompt
          rateLimit: { // Where/how is this derived?
            period: 'Unlimited',
            rate: null
          },
          requestId: this.currentRequestId,
          
      },
      stream: true,
      temperature: this.selectedTemperature(),
    }
  }

  private initUserMessage(content: string = ''): Message {

    return {
      content,
      data: this.getUserMessageData(),
      id: uuidv4(),
      role: 'user',
      type: 'prompt'
    }
  }

  private initSystemMessage(): Message {
    return {
      content: '',
      type: 'prompt',
      id: uuidv4(),
      role: 'system'
    }
  }

  private initAssistantMessage(): Message {
    return {
      content: '',
      type: 'prompt',
      id: uuidv4(),
      role: 'assistant'
    }
  }

  
  private getUserMessageData() {
    
    let data = {};
    if (this.dataSources.length > 0) {
      data = {
        dataSources: this.dataSources
      }
    }
    return data
  }

}
