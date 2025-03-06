import { inject, Injectable, resource, Signal, signal, WritableSignal } from '@angular/core';
import { Conversation } from '../models/conversation.model';
import { v4 as uuidv4 } from 'uuid';
import { ModelService } from './model.service';
import { Model } from '../models/model.model';
import { PromptService } from './prompt.service';
import { lzwCompress, lzwUncompress } from './compression';
import { HttpBackend, HttpClient } from '@angular/common/http';
import { switchMap, map, catchError, of, firstValueFrom } from 'rxjs';
import { Folder, FoldersService } from './folders.service';
import { DeveloperSettingsService } from '../settings/developer/developer-settings.service';
import { UserService } from './user.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ConversationService {  
  private selectedModel: Signal<Model> = this.modelService.getSelectedModel();
  private selectedTemperature: Signal<number> = this.modelService.getSelectedTemperature();
  private selectedPrompt: Signal<string> = this.promptService.getSelectedPrompt();
  private currentConversation: WritableSignal<Conversation> = signal(this.createConversation());
  private conversations: WritableSignal<Conversation[]> = signal([]);
  private deletingFolder: WritableSignal<string | null> = signal(null);
  private deletingConversation: WritableSignal<Conversation | null> = signal(null);
  private userService: UserService = inject(UserService);
  private url = environment.apiBaseUrl;

  // dont fetch conversations until the user has logged in
  // re-run if the user object changes, ie if the user is still authenticated after refreshing the page
  private _conversationsResource = resource({
    request: () => ({isAuthenticated: this.userService.isAuthenticated(), user: this.userService.currentUser()}), 
    loader: ({request}) => {
      if(request.isAuthenticated === false) {
        return firstValueFrom(of({folders: [], conversations: {}}));
      } else {
        return this.getAllConversations();
      }
    }
  })

  get conversationsResource() {
    return this._conversationsResource.asReadonly()
  }

  private s3Client: HttpClient;

  constructor(
    private modelService: ModelService,
    private promptService: PromptService,
    private httpClient: HttpClient,
    private folderService: FoldersService,
    handler: HttpBackend,
  ) {
    this.s3Client = new HttpClient(handler);
  }

  getCurrentConversation(): WritableSignal<Conversation> {
    return this.currentConversation;
  }

  getDeletingFolder(): Signal<string | null> {
    return this.deletingFolder.asReadonly();
  }

  getDeletingConversation(): Signal<Conversation | null> {
    return this.deletingConversation.asReadonly();
  }

  async setCurrentConversation(conversation: Conversation) {
    this.currentConversation.set(conversation);
  }

  deleteConversation(conversation: Conversation) {
    this.deletingConversation.set(conversation);
    const apiBase = `${this.url}/state/conversation/delete?conversationId=${conversation.id}`;
    return firstValueFrom(this.httpClient.delete<{statusCode: number; body:string}>(apiBase).pipe(
      map(response => {
        if (response.statusCode !== 200) {
          throw new Error('Failed to delete conversation');
        }
        this._conversationsResource.update((current) => {
          if (current?.conversations) {
            const conversations = current.conversations[conversation.folderId ?? '']
            const idx = conversations.findIndex(x => x.id === conversation.id);
            conversations.splice(idx, 1);
            return current;
          }
          return current;
        })
        this.deletingConversation.set(null);
        return conversation;
      }),
      catchError(error => {
        console.error('Error fetching conversation:', error);
        this.deletingConversation.set(null);
        return of({} as Conversation);
      })
    ));
  }

  async deleteFolder(folder: Folder) {
    this.deletingFolder.set(folder.id);
    const conversationsInFolder = this._conversationsResource.value()?.conversations[folder.id] ?? [];
    
    try {
      // Create an array of promises for all conversation deletions
      const deletionPromises = conversationsInFolder.map(conversation => 
        this.deleteConversation(conversation)
      );
      
      // Wait for all conversations to be deleted
      await Promise.all(deletionPromises);
      
      // After all conversations are deleted, remove the folder entry
      this._conversationsResource.update((current) => {
        if (current?.conversations) {
          delete current.conversations[folder.id];
        }
        
        const foldersCopy = current?.folders ? [...current.folders] : [];
        const idx = foldersCopy.findIndex(f => f.id === folder.id);
        if (idx !== -1) {
          foldersCopy.splice(idx, 1);
        }
        
        return { 
          folders: foldersCopy, 
          conversations: current?.conversations ?? {} 
        };
      });
    } catch (error) {
      console.error('Error deleting folder:', error);
    } finally {
      // Set deletingFolder back to null when done
      this.deletingFolder.set(null);
    }
  }

  saveFolder(folder: Folder) {
    const currentConversation = this.currentConversation();
    if(currentConversation.folderId !== folder.id) {
      this.currentConversation().folderId = folder.id;
      this.saveConversation(currentConversation);
      this.conversations.update(conversations => 
        conversations.map(c => c.id === currentConversation.id ? currentConversation : c)
      );
    }
  }


  renameConversation(conversationId: string, newName: string) {
    console.log('Renaming conversation service triggered', conversationId, newName);
    const conversation = this.conversations().find(c => c.id === conversationId);
    if (conversation) {
      conversation.name = newName;
      this.conversations.update(conversations => 
        conversations.map(c => c.id === conversationId ? { ...c, name: newName } : c)
      );
      this.saveConversation(conversation);
    } 
  }

  getConversationName() {}

  getConversations(): WritableSignal<Conversation[]> {
    return this.conversations;
  }

  addFolderToConversations(folder: Folder) {
    this._conversationsResource.update((current) => {
      const foldersCopy = current?.folders ? [...current.folders] : [];
      foldersCopy.unshift(folder); // add to the front so it shows up at the top

      return { folders: foldersCopy, conversations: current?.conversations ?? {} };
    })
    this.folderService.setActiveFolder(folder.id);
  }

  addConversationToFolder(conversation: Conversation, folderId: string) {
    this._conversationsResource.update((current) => {
      const conversationsCopy = current?.conversations ? { ...current.conversations } : {};
      if (!conversationsCopy[folderId]) {
        conversationsCopy[folderId] = [];
      }
      
      // Check if conversation already exists in folder
      const exists = conversationsCopy[folderId].some(c => c.id === conversation.id);
      if (!exists) {
        conversationsCopy[folderId].unshift(conversation);
      }

      return { folders: current?.folders ?? [], conversations: conversationsCopy };
    })
  }

  removeConversationFromFolder(conversation: Conversation, folderId: string) {
    this._conversationsResource.update((current) => {
      const conversationsCopy = current?.conversations ? { ...current.conversations } : {};
      
      if (conversationsCopy[folderId]) {
        // Filter out the conversation from the specified folder
        conversationsCopy[folderId] = conversationsCopy[folderId].filter(
          c => c.id !== conversation.id
        );
      }

      return { 
        folders: current?.folders ?? [], 
        conversations: conversationsCopy 
      };
    });
  }

  getAllConversations(): Promise<{ folders: Folder[]; conversations: Record<string, Conversation[]> }> {
    const apiBase = `${this.url}/state/conversation/get_all`;
    console.log('getting all conversations', apiBase);
    return firstValueFrom(this.httpClient.get<{ statusCode: number; body: string }>(apiBase).pipe(
      switchMap(response => {
        if (response.statusCode !== 200) {
          throw new Error('Failed to fetch S3 URL');
        }
        const parsed = JSON.parse(response.body);

        if(parsed.conversationsData?.length === 0) {
          return of([{ folder: {} as Folder, conversation: {} as Conversation }]);
        }

        if(parsed.presignedUrl === undefined) {
          throw new Error('S3 Presigned URL is undefined');
        }

        return this.s3Client.get<ConversationResponse[]>(parsed.presignedUrl);
      }),
      map(data => {
        // Use folder service to extract and group conversations
        const folders = this.folderService.extractFolders(data);
        if(folders.length === 0) {
          return { folders: [this.folderService.createNewFolder()], conversations: {} };
        }
        this.folderService.setActiveFolder(folders[0].id);
        const conversations = data.map(({ conversation }) => conversation);
        const groupedConversations = this.folderService.groupConversationsByFolder(conversations);
        // Return the record type
        return { folders, conversations: groupedConversations };
      }),
      catchError(error => {
        console.error('Error fetching conversations:', error);
        throw new Error('Failed to fetch conversations');
      })
    ));
  }

  getConversationById(conversationId: string): Promise<Conversation> {
    const apiBase = `${this.url}/state/conversation/get?conversationId=${conversationId}`;
    return firstValueFrom(this.httpClient.get<{statusCode: number; body:string}>(apiBase).pipe(
      map(response => {
        if (response.statusCode !== 200) {
          throw new Error('Failed to fetch conversation');
        }
        const body: {success: boolean; conversation: number[]} = JSON.parse(response.body);
        const conversationString = lzwUncompress(body.conversation);
        const conversation: Conversation = JSON.parse(conversationString);
        conversation.isLocal = true;
        this._conversationsResource.update((current) => {
          if (current?.conversations) {
            Object.values(current.conversations).forEach((conversations) => {
              const convoToUpdate = conversations.find((convo) => convo.id === conversationId);
              if(convoToUpdate) {
                convoToUpdate.messages = conversation.messages;
                convoToUpdate.isLocal = true;
              }
            });
          }
          return current;
        })
        return conversation;
      }),
      catchError(error => {
        console.error('Error fetching conversation:', error);
        return of({} as Conversation);
      })
    ));
  }

  saveConversation(conversation: Conversation, moveFolders: boolean = false): Promise<{ success: boolean; message: string }> {
    const apiBase = `${this.url}/state/conversation/upload`;
    let folder: Folder;
    // If we are moving the folder, we need to use the folderId from the conversation
    if(moveFolders) {
      folder = this._conversationsResource.value()?.folders.find(f => f.id === conversation.folderId) ?? {} as Folder;
    } else {
      // Otherwise, we need to use the active folder
      const activeFolder = this.folderService.getActiveFolder();
      folder = this._conversationsResource.value()?.folders.find(f => f.id === activeFolder()) ?? {} as Folder;
    }
    conversation.isLocal = false;
    console.log('saving conversation', conversation.folderId === folder.id);
    const data = {
      conversation: lzwCompress(JSON.stringify(conversation)),
      conversationId: conversation.id,
      folder: folder
    }

    return firstValueFrom(this.httpClient.put<{ statusCode: number; body: string }>(apiBase, {data: data}).pipe(
      map(response => {
        if (response.statusCode !== 200) {
          throw new Error('Failed to save conversation');
        }
        const body: { success: boolean; message: string } = JSON.parse(response.body);
        return body;
      }),
      catchError(error => {
        console.error('Error saving conversation:', error);
        return of({ success: false, message: 'Failed to save conversation' });
      })
    ));
  }

  createConversation(folderId: string = ''): Conversation {
    const newConversation = {
      id: uuidv4(),
      name: 'New Conversation',
      messages: [],
      model: this.selectedModel(),
      prompt: this.selectedPrompt(),
      temperature: this.selectedTemperature(),
      folderId: folderId,
      isLocal: true
    };
    return newConversation;
  }

  setConversations(conversations: Conversation[]) {
    this.conversations.set(conversations);
  }
}

interface ConversationResponse {
  conversation: Conversation;
  folder: Folder;
}

interface ConversationTransferObject {
  conversation: number[];
  conversationId: string;
  folder: Folder;
}
