import { HttpClient, HttpDownloadProgressEvent, HttpEvent, HttpEventType } from '@angular/common/http';
import { Injectable, Signal, signal, WritableSignal } from '@angular/core';
import { environment } from 'src/environments/environment';
import { SseClient } from 'ngx-sse-client';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private text = '';
  private chatLoading: WritableSignal<boolean> = signal(false);
  private chatResponse: WritableSignal<string> = signal('');
  private userInput: WritableSignal<string> = signal('');

  constructor(private httpClient: HttpClient, private sseClient: SseClient) { }

  getUserInput(): Signal<string> {
    return this.userInput;
  }

  getChatResponse(): Signal<string> {
    return this.chatResponse;
  }

  getChatLoading(): Signal<boolean> {
    return this.chatLoading;
  }

  debugSSEMessages(message: string) {
    this.httpClient
      .post(environment.chatEndpoint, this.getRequestObject(message), {
        observe: "events",
        responseType: "text",
        reportProgress: true,
      })
      .subscribe({
        next: (event: HttpEvent<string>) => {
          if (event.type === HttpEventType.Sent) {
            console.log('Sent: ', event);
          }
          if (event.type === HttpEventType.ResponseHeader) {
            console.log('Response Header: ', event);
          }
          if (event.type === HttpEventType.User) {
            console.log('User: ', event);
          }
          if (event.type === HttpEventType.DownloadProgress) {
            const text = (
              event as HttpDownloadProgressEvent
            ).partialText + "…";

            // console.log(text);
          } else if (event.type === HttpEventType.Response) {
            console.log(event)
          }
        },
        error: () => {
          
        },
      });
  }
  
  async submitChatRequest(chatInput: string) {
    this.chatLoading.set(true);
    this.userInput.set(chatInput);
    this.sseClient.stream(environment.chatEndpoint, { keepAlive: false, responseType: 'event' }, { body: { ...this.getRequestObject(chatInput) } }, 'POST' )
    .subscribe((event) => {
      if (event.type === 'error') {
        const errorEvent = event as ErrorEvent;
        console.error(errorEvent);
      } else {
        const message = event as MessageEvent;
        this.parseMessageEvent(message)
      }
    });
  }

  cancelChatRequest() {

  }

  private parseMessageEvent(messageEvent: MessageEvent) {
    console.log(messageEvent.data);
    try {
      const message = JSON.parse(messageEvent.data);
      // This case contains the response text we want to compile
      if (message.s === 0 && typeof message.d === 'string') {
        this.text = this.text += message.d;
        this.chatResponse.set(this.text);
      }
      // We are done
      if (message.s === 0 && message.type === 'end') {
        console.log(this.text);
        this.chatLoading.set(false);
      }
    } catch(error) {
      console.error(`Error in JSON.parse: ${error}`)
    }
  }

  getRequestObject(userInput: string) {
    return {
      model: "us.anthropic.claude-3-5-sonnet-20241022-v2:0",
      temperature: 0.5,
      max_tokens: 1000,
      stream: true,
      dataSources: [],
      messages: [
        {
          role: "system",
          content: `Follow the user's instructions carefully. Respond using markdown. If you are asked to draw a diagram, you can use Mermaid diagrams using mermaid.js syntax in a \`\`\`mermaid code block. If you are asked to visualize something, you can use a \`\`\`vega code block with Vega-lite. Don't draw a diagram or visualize anything unless explicitly asked to do so. Be concise in your responses unless told otherwise.`
        },
        {
          role: "user",
          content: userInput,
          type: "prompt",
          data: {},
          id: "ae2e4d4c-7e57-4394-b59c-57b56cf5af4f"
        }
      ],
      options: {
        requestId: "bzd8zq",
        model: {
          id: "us.anthropic.claude-3-5-sonnet-20241022-v2:0",
          name: "Claude-3-5-Sonnet-v2",
          maxLength: 24000,
          tokenLimit: 4000,
          actualTokenLimit: 4096,
          visible: false,
          outputCost: 0.015,
          inputCost: 0.003,
          description: `Consider for advanced tasks with the most up-to-date information.
    Claude 3.5 is Anthropic's most current, powerful, and cost-efficient model.
    Can write, edit, and execute code with sophisticated reasoning, understands user context, offers orchestrating multi-step workflows, can navigate unstructured data, write creatively, understands nuance and humor, and supports images as input.
    Trained on information available through April 2024.`
        },
        prompt: `Follow the user's instructions carefully. Respond using markdown. If you are asked to draw a diagram, you can use Mermaid diagrams using mermaid.js syntax in a \`\`\`mermaid code block. If you are asked to visualize something, you can use a \`\`\`vega code block with Vega-lite. Don't draw a diagram or visualize anything unless explicitly asked to do so. Be concise in your responses unless told otherwise.`,
        maxTokens: 1000,
        conversationId: "432a69c9-94a5-4961-a3d6-b9a24516cf4c",
        accountId: "general_account",
        rateLimit: {
          period: "Unlimited",
          rate: null
        }
      }
    };
  }
}
