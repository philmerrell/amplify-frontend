import { Injectable, Signal, signal, WritableSignal } from '@angular/core';
import { Conversation } from '../models/conversation.model';
import { v4 as uuidv4 } from 'uuid';
import { ModelService } from './model.service';
import { Model } from '../models/model.model';
import { PromptService } from './prompt.service';
import { lzwCompress, lzwUncompress } from './compression';

@Injectable({
  providedIn: 'root'
})
export class ConversationService {
  private selectedModel: Signal<Model> = this.modelService.getSelectedModel();
  private selectedTemperature: Signal<number> = this.modelService.getSelectedTemperature();
  private selectedPrompt: Signal<string> = this.promptService.getSelectedPrompt();
  private currentConversation: WritableSignal<Conversation> = signal(this.createConversation());
  private conversations: WritableSignal<Conversation[]> = signal([]);
  
  constructor(
    private modelService: ModelService,
    private promptService: PromptService) {
      
  }


  getCurrentConversation(): WritableSignal<Conversation> {
    return this.currentConversation;
  }

  setCurrentConversation(conversation: Conversation) {
    this.currentConversation.set(conversation);
  }

  getConversationName() {}

  getConversations(): WritableSignal<Conversation[]> {
    return this.conversations;
  }


  initConversations() {
    if (!this.conversations().length) {
      const conversationHistoryJson = localStorage.getItem('conversationHistory');
      try {
        const conversations = JSON.parse(conversationHistoryJson || '')
        this.uncompressMessages(conversations);
        this.conversations.set(conversations);
      } catch (error) {
        console.error(error);
      }
    }
  }

  // getConversationsByFolderId(folderId: string): Conversation[] {
  //   // console.log(folderId, this.conversations())
  //   const conversations = this.conversations().filter((conversation: Conversation) => conversation.folderId === folderId);
  //   return conversations;
  // }

  createConversation(): Conversation {
    const newConversation = {
      id: uuidv4(),
      name: 'New Conversation',
      messages: [],
      model: this.selectedModel(),
      prompt: this.selectedPrompt(),
      temperature: this.selectedTemperature(),
      folderId: ''
    };
    return newConversation;
    
  }

  compressMessages(conversations: Conversation[]): Conversation[] {
    for (let conversation of conversations) {
      const json = JSON.stringify(conversations);
      const compressedMessages = lzwCompress(json);
      conversation.compressedMessages = compressedMessages;
      conversation.messages = [];
    }
    return conversations;
  }

  private uncompressMessages(conversations: Conversation[]): Conversation[] {
    for (let conversation of conversations) {
      const compressedMessages = conversation.compressedMessages || [];
      const uncompressedMessages = lzwUncompress(compressedMessages);
      try {
        conversation.messages = JSON.parse(uncompressedMessages);
        delete conversation.compressedMessages;
      } catch (error) {
        conversation.messages = []
      }
    }
    return conversations;
  }

  setConversations(conversations: Conversation[]) {
    this.conversations.set(conversations);
  }

  getRequestObject(userInput: string) {
    return {
      model: "us.anthropic.claude-3-5-haiku-20241022-v1:0",
      temperature: 0.5,
      max_tokens: 10,
      stream: true,
      dataSources: [],
      messages: [
          {
              role: "system",
              content: "Respond with only the title name and nothing else."
          },
          {
              role: "user",
              content: `Look at the following prompt: "${userInput}" \n\nYour task: As an AI proficient in summarization, create a short concise title for the given prompt. Ensure the title is under 30 characters.`,
              type: "prompt",
              data: {
                  assistant: {
                      definition: {
                          name: "Standard Conversation"
                      }
                  }
              },
              id: "c19e477d-e25c-4202-b9a0-2bbc7a2d48a8"
          }
      ],
      options: {
          requestId: "f4f0f2d0-12d3-4f23-8531-d37a454a9f10",
          model: {
              id: "us.anthropic.claude-3-5-haiku-20241022-v1:0",
              name: "Claude-3-5-Haiku",
              maxLength: 24000,
              tokenLimit: 4000,
              actualTokenLimit: 4096,
              visible: false,
              outputCost: 0.001,
              inputCost: 0.0005,
              description: "Consider for high-velocity tasks with near-instant responsiveness and emphasis on security and robustness through minimized risk of harmful outputs.\nFeatures speeds 3 times faster than its Claude peer models while being the most economical choice.\nBest for simple queries, lightweight conversation, rapid analysis of large volumes of data, handling of much longer prompts, and supports images as input.\nTrained on information available through August 2023."
          },
          key: "eyJraWQiOiJQMlllUVVOaVFvdU5hWHZIMWkyZEJGODV4TlwvZTdMb2FDYVhGektlWlwvY1k9IiwiYWxnIjoiUlMyNTYifQ.eyJzdWIiOiJiNDM4ZjQ1OC04MDQxLTcwNjAtNzBiNC1lNGRjMGE3MDY4YjUiLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAudXMtZWFzdC0xLmFtYXpvbmF3cy5jb21cL3VzLWVhc3QtMV94bnJYWGpGSmoiLCJ2ZXJzaW9uIjoyLCJjbGllbnRfaWQiOiJxMG02dHJraGV2dGJmYTNhMXNuMnJidTY1Iiwib3JpZ2luX2p0aSI6IjUyMWEyODU3LTUyOWQtNGNhNS05Y2YxLWUyOTk0MjQ4YWZiNyIsImV2ZW50X2lkIjoiNjAwNTdlZjYtODViZS00ZGI3LThiNWUtYTkwNTllYzVmNjQzIiwidG9rZW5fdXNlIjoiYWNjZXNzIiwic2NvcGUiOiJvcGVuaWQiLCJhdXRoX3RpbWUiOjE3MzU0OTA1NzQsImV4cCI6MTczNTU3Njk3NCwiaWF0IjoxNzM1NDkwNTc0LCJqdGkiOiJmYTVlNDNhMC1jMTE3LTRjNjMtYjZjZC0wNzkxOWE2Y2QwNjciLCJ1c2VybmFtZSI6InBoaWxtZXJyZWxsIn0.n_9qoNQAxw5rL604Jcu9xRdEYU2jiQk9avOw7zzw-cVp93BIU7fhyvuRJPWSLusHGzS6O30b2WifwhA0qXmnT21OOOcBO-ZQB8LWDV_fYGxYqaS5Lm1mP7QbtMLHstHzjDwwzO7-WcyWGUqPPOyefiB58GXj0vIrpyqS36vF4xUTo9IboXe2N07RA21dJag8TviHc6X2vt_i1u_eXdpJ3KJlHOr37r8BG2MEsDI-dnHgePzJJnG69tdi_bf98CgfTw7kZ5F4wY1hDuIpS-UFT8yfqqL_Yy1m912LtB1ldHPh3urVUPTz8YgM2y2CIHtMgCPP9KYaXFwS1da7JfsqXg",
          prompt: "Respond with only the title name and nothing else.",
          maxTokens: 10,
          skipRag: true,
          skipCodeInterpreter: true
      }
    }
  }
}
