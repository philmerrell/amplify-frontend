import { HttpClient } from '@angular/common/http';
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
import { ResponseMetadataService } from './response-metadata.service';
import { CustomInstructionService } from 'src/app/services/custom-instruction.service';


/**
 * ChatRequestService
 * 
 * This Angular service manages sending messages to a Large Language Model (LLM) and 
 * handles the structuring of conversation state in real-time. It leverages Angular signals 
 * for reactive data management, supports streaming responses via Server-Sent Events (SSE),
 * and stores metadata about data sources and files that the user can attach to a request.
 */
@Injectable({
  providedIn: 'root'
})
export class ChatRequestService {
  /**
   * Indicates whether a chat request is currently in progress (true) or not (false).
   */
  private chatLoading: WritableSignal<boolean> = signal(false);

  /**
   * List of all conversations from the ConversationService as an Angular signal.
   */
  private conversations: WritableSignal<Conversation[]> = this.conversationService.getConversations();

  /**
   * The currently active conversation as an Angular signal.
   */
  private currentConversation: WritableSignal<Conversation> = this.conversationService.getCurrentConversation();

  /**
   * A unique identifier for the current chat request. Used to match server responses
   * or signal the server to kill a specific request mid-stream.
   */
  private currentRequestId = '';

  /**
   * A collection of data sources that can be attached to the chat request, 
   * e.g., references or external context the user wants to include.
   */
  private dataSources: DataSource[] = [];

  /**
   * List of files attached to the chat request, wrapped in a custom FileWrapper 
   * to include additional metadata if needed.
   */
  private files: WritableSignal<FileWrapper[]> = signal([]);

  /**
   * Used to accumulate the SSE stream's partial responses into a full response 
   * before finalizing.
   */
  private responseContent = '';

  /**
   * Tracks the subscription to the SSE stream so it can be canceled (unsubscribed) 
   * if needed (e.g., user clicks "Stop" or "Cancel").
   */
  private responseSubscription: Subscription = new Subscription();

  /**
   * The currently selected model that will handle the chat requests. 
   * This is exposed as a read-only Angular signal from the ModelService.
   */
  private selectedModel: Signal<Model> = this.modelService.getSelectedModel();

  /**
   * The currently selected temperature (creativity parameter) for the model 
   * requests, also exposed as a read-only Angular signal.
   */
  private selectedTemperature: Signal<number> = this.modelService.getSelectedTemperature();

  /**
   * @constructor
   * 
   * @param http - Angular's HttpClient for standard HTTP requests.
   * @param sseClient - A custom SSE client that handles streaming of server-sent events.
   * @param conversationService - Manages all conversations and the active conversation state.
   * @param conversationRenameService - Handles renaming of conversations (e.g., after the first user message).
   * @param developerSettingsService - Provides developer/configuration settings such as the chat endpoint.
   * @param folderService - Manages folder IDs for new and existing conversations.
   * @param modelService - Provides which LLM model is currently selected and related configuration.
   * @param responseMetadataService - Handles metadata responses from the LLM to display to user.
   */
  constructor(
    private http: HttpClient,
    private sseClient: SseClient,
    private conversationService: ConversationService,
    private conversationRenameService: ConversationRenameService,
    private customInstructionService: CustomInstructionService,
    private developerSettingsService: DeveloperSettingsService,
    private folderService: FoldersService,
    private modelService: ModelService,
    private responseMetadataService: ResponseMetadataService
  ) {
  }

  /**
   * Add a file to the internal file list. 
   * This function updates the signal to include the new file.
   */
  addFile(fw: FileWrapper) {
    this.files.update(files => {
      return [
        ...files,
        fw
      ]
    });
  }

  /**
   * Remove a file from the internal file list by matching its ID. 
   * This function updates the signal to exclude the removed file.
   */
  removeFile(fileToBeRemoved: FileWrapper) {
    this.files.update(files => files.filter(file => file.id !== fileToBeRemoved.id))
  }

  /**
   * Returns the current list of file attachments as a read-only Signal. 
   * Useful for binding in templates or read-only operations.
   */
  getFiles(): Signal<FileWrapper[]> {
    return this.files;
  }
  
  /**
   * Add a new data source object to the request. Data sources can be domain-specific 
   * references or additional context for the LLM.
   */
  addDataSource(dataSource: DataSource) {
    this.dataSources.push(dataSource);
  }

  /**
   * Returns whether a chat is currently in progress or not as a read-only Signal.
   */
  getChatLoading(): Signal<boolean> {
    return this.chatLoading;
  }

  /**
   * Returns the current conversation as a read-only Signal. 
   */
  getCurrentConversation(): Signal<Conversation> {
    return this.currentConversation;
  }
  
  /**
   * Submits the user input as a new message to the LLM. 
   * 
   * Steps:
   * 1. Add the user's input to the current conversation state.
   * 2. Create a request object that includes model, temperature, data sources, etc.
   * 3. Initiate an SSE connection to the server endpoint.
   * 4. Listen for streaming responses (partial or final) and handle them via parseMessageEvent().
   */
  async submitChatRequest(userInput: string) {
    this.setResponseMetadata();
    // First, update conversation with the user's text.
    this.updateCurrentConversationWithUserInput(userInput);

    // Build the request payload for the chat endpoint.
    const requestObject = this.createRequestObject(userInput);

    // The actual endpoint for SSE streaming from developer settings.
    const chatEndpoint = this.developerSettingsService.getDeveloperChatEndpoint();
    
    this.chatLoading.set(true);

    // Start streaming the response from our environment's chat endpoint using SSE.
    this.responseSubscription = this.sseClient.stream(
      chatEndpoint(), 
      { keepAlive: false, responseType: 'event' }, 
      { body: requestObject }, 
      'POST'
    ).subscribe((event) => {
      if (event.type === 'error') {
        // Handle error events. 
        const errorEvent = event as ErrorEvent;
        // Possibly call cancelChatRequest() or handle error UI.
      } else {
        // Handle normal message events from SSE.
        const message = event as MessageEvent;
        this.parseMessageEvent(message)
      }
    });
  }

  /**
   * Updates the currentConversation with a new user message. 
   * 
   * If this is the first message in a brand-new conversation (folderId is empty),
   * then a folder ID is generated, and the conversation is added to the main list.
   * Otherwise, it simply updates the existing conversation messages.
   */
  updateCurrentConversationWithUserInput(userInput: string) {
    const userMessage = this.initUserMessage(userInput);

    // Check if it's a new conversation (folderId is empty).
    if (this.currentConversation().folderId === '') {

      const folderId = this.folderService.getActiveFolder();
      this.currentConversation.update((c: Conversation) => {
        return {
          ...c,
          folderId: folderId(),
          messages: [...c.messages, userMessage]
        }
      });

      // Add the new conversation to the list of all conversations.
      this.conversations.update((conversations) => [...conversations, this.currentConversation()]);
      this.conversationService.addConversationToFolder(this.currentConversation(), folderId() ?? '')

    } else {
      // This is an existing conversation. Just append the user message.
      this.currentConversation.update((c: Conversation) => {
        return {
          ...c,
          messages: [...c.messages, userMessage]
        }
      });

      // Also update the master list of conversations in place.
      this.conversations.update((c: Conversation[]) => {
        return c.map(conversation => 
          conversation.id === this.currentConversation().id 
            ? { ...conversation, messages: [...conversation.messages, userMessage] } 
            : conversation
        )
      })
    }
  }

  /**
   * Cancels the current SSE-based chat request by unsubscribing from the stream 
   * and signaling the server to kill the request using the current request ID.
   * 
   * Returns a Promise that resolves when the POST request is completed.
   */
  cancelChatRequest() {
    // Unsubscribe from SSE events so no more data is received.
    this.responseSubscription.unsubscribe();
    this.chatLoading.set(false);

    // Notify the server to kill the current request (kill switch).
    const chatEndpoint = this.developerSettingsService.getDeveloperChatEndpoint();
    const request = this.http.post(chatEndpoint(), { 
      killSwitch: { 
        requestId: this.currentRequestId, 
        value: true
      }
    });

    return firstValueFrom(request);
  }

  /**
   * Internal helper that returns a system Message object intended to hold LLM responses.
   * If the last message in the conversation is NOT system role, it creates a new system
   * message and appends it to the conversation. Otherwise, it returns the last existing system message.
   *
   * @param conversation - The conversation to check for the last message's role.
   * @returns A system message object (either newly created or the last one in conversation).
   */
  private getSystemMessageForChatResponse(conversation: Conversation): Message {
    const lastMessage = conversation.messages[conversation.messages.length - 1];
    let systemMessage: Message;

    if (lastMessage.role !== 'system') {
      systemMessage = this.initSystemMessage();

      // Append this new system message to the conversation.
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

  /**
   * Called whenever a new SSE message event arrives. It handles partial response 
   * concatenation and conversation updates, and signals when the response has ended.
   * 
   * @param messageEvent - The MessageEvent object containing streamed text or metadata.
   */
  private parseMessageEvent(messageEvent: MessageEvent) {
    const conversation = this.currentConversation();
    const userMessage = conversation.messages[0];
    const isNewConversation = conversation.name === 'New Conversation';
    try {
      const message = JSON.parse(messageEvent.data);
      if (message.s === 'meta') {
        // Metadata returned by the server. You can handle it here as needed.

        if (message.st) {
          this.responseMetadataService.setResponseMetaData(message.st);
        }
      }

      // When s=0 and d is a string, it's partial or complete LLM-generated text to append.
      if (message.s === 0 && typeof message.d === 'string') {
        this.updateSystemMessageResponse(message.d, conversation);
      }

      // This case handles when multiple datasources are attached to the request.
      if (message.s === 'result') {
        this.updateSystemMessageResponse(message.d, conversation);
      }

      // message.type='end', the server signals the completion of the response.
      if ((message.s === 0 || message.s === 'result') && message.type === 'end') {
        this.chatLoading.set(false);

        // If the conversation name is still default, rename it based on first user message.
        if (isNewConversation) {
          this.conversationRenameService.renameConversation(userMessage.content);
        }

        // Reset buffers and data for the next request.
        this.responseContent = '';
        this.dataSources = [];
        this.files.set([]);
        this.responseMetadataService.resetResponseMetaData(); 
        this.currentConversation.set(conversation);
        this.conversations.update(conversations => 
          conversations.map(c => c.id === conversation.id ? conversation : c)
        );
        if(!isNewConversation) {
          this.conversationService.saveConversation(conversation);
        }
      }
    } catch(error) {
      // If an error occurs, reset the response content. 
      // The SSE might have malformed JSON or a server glitch.
      this.responseContent = '';
      // console.error(`Error in JSON.parse: ${error}`);
    }
  }

  /**
   * Called whenever the LLM provides a response intended for the user. It is called frequently 
   * and concatenates partial responses for immediate display for the user.
   * 
   * @param systemResponse - The string to be added to the conversations system response.
   * @param conversation - The conversation the system response is a part of.
   */
  private updateSystemMessageResponse(systemResponse: string, conversation: Conversation) {
    this.responseContent = this.responseContent += systemResponse;
    const systemMessage = this.getSystemMessageForChatResponse(conversation);    

    // Instead of just mutating systemMessage, reassign it in a signal update
    this.currentConversation.update((c: Conversation) => {
      // Find the current system message in the conversation
      const updatedMessages = c.messages.map(msg => {
        if (msg.id === systemMessage.id) {
          // Return a new object with updated content
          return { ...msg, content: this.responseContent };
        }
        return msg;
      });
      
      return {
        ...c,
        messages: updatedMessages
      };
    });
  }

  /**
   * Generates the request payload for sending a message to the LLM. 
   * It includes conversation messages, model, temperature, and a unique request ID.
   * 
   * @param userInput - The user's prompt/message text.
   * @returns A structured object that can be sent to the SSE endpoint via POST.
   */
  private createRequestObject(userInput: string) {
    const model = this.selectedModel();
    const conversation = this.currentConversation();
    const selectedInstructions = this.customInstructionService.getSelectedCustomInstruction();
    this.currentRequestId = uuidv4();

    return {
      dataSources: [
        ...this.dataSources
      ],
      max_tokens: 1000, // Example fixed token limit; could be derived from UI or config.
      messages: [
        {
          role: 'system',
          content: selectedInstructions().content, // Default or user-selected system prompt.
        },
        ...conversation.messages
      ],
      model: model.id, // Model ID to be used, e.g. "gpt-3.5-turbo".
      options: {
        accountId: 'general_account', // Example placeholder. Adjust to your use case.
        conversationId: conversation.id,
        model: model,
        prompt: selectedInstructions().content, // The system prompt again (if needed).
        rateLimit: {
          period: 'Unlimited',
          rate: null
        },
        requestId: this.currentRequestId,
      },
      stream: true,
      temperature: this.selectedTemperature(),
    }
  }

  /**
   * Initializes a Message object with the user's prompt.
   * 
   * @param content - The text input from the user.
   * @returns A new Message object representing the user's prompt.
   */
  private initUserMessage(content: string = ''): Message {
    return {
      content,
      data: this.getUserMessageData(),
      id: uuidv4(),
      role: 'user',
      type: 'prompt'
    }
  }

  private setResponseMetadata() {
    this.responseMetadataService.setResponseMetaData({
      id: uuidv4(),
      inProgress: true,
      message: 'Your request is being sent',
      summary: '',
      type: '',
      sticky: true
    })
  }

  /**
   * Initializes a Message object for system role, typically used to hold LLM responses.
   */
  private initSystemMessage(): Message {
    return {
      content: '',
      type: 'prompt',
      id: uuidv4(),
      role: 'system'
    }
  }

  /**
   * (Not currently used) Initializes a Message object for an assistant role. 
   * Could be useful if you separate "system" messages from "assistant" messages.
   */
  private initAssistantMessage(): Message {
    return {
      content: '',
      type: 'prompt',
      id: uuidv4(),
      role: 'assistant'
    }
  }

  /**
   * Gathers any additional data (e.g., attached data sources) to be associated 
   * with a user message. If there are no data sources, returns an empty object.
   */
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
