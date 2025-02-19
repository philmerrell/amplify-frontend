import { Injectable, Signal, signal, WritableSignal } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';
import { Conversation } from '../models/conversation.model';

export interface Folder {
  date?: string;
  id: string;
  name: string;
  type: string;
}

@Injectable({
  providedIn: 'root'
})
export class FoldersService {

  private activeFolder = signal<string | null>(null); // Signal for active folder

  /**
   * Sets the active folder ID.
  */
  setActiveFolder(folderId: string): void {
    this.activeFolder.set(folderId);
  }

  /**
   * Gets the currently active folder ID.
  */
  getActiveFolder(): string | null {
    return this.activeFolder();
  }

  /**
   * Creates a new folder with a unique ID and sets it as active.
  */
  createNewFolder(type: string = 'chat'): Folder {
    
    const today = new Date().toISOString().slice(0, 10);
    const newFolder: Folder = {
      id: uuidv4(),
      date: today,
      name: this.getFormattedDate(),
      type
    };

    this.setActiveFolder(newFolder.id); // Automatically set new folder as active
    return newFolder;
  }


  private folders: WritableSignal<Folder[]> = signal([]);
  
  getFolders(): Signal<Folder[]> {
    return this.folders;
  }

  private getFormattedDate() {
    const date = new Date();
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    const month = months[date.getMonth()];
    const day = date.getDate();
    const year = date.getFullYear();
    
    return `${month} ${day}, ${year}`;
  }

    /**
     * Groups conversations by folder.
    */
    groupConversationsByFolder(conversations: Conversation[]): Record<string, Conversation[]> {
      return conversations.reduce((acc, convo) => {
        const folderId = convo.folderId || 'unsorted';
        if (!acc[folderId]) {
          acc[folderId] = [];
        }
        acc[folderId].push(convo);
        return acc;
      }, {} as Record<string, Conversation[]>);
    }

    /**
     * Extracts unique folders from a list of conversations.
    */
    extractFolders(conversations: Conversation[]): Folder[] {
      const folderMap = new Map<string, Folder>();

      conversations.forEach(convo => {
        if (convo.folderId && !folderMap.has(convo.folderId)) {
          folderMap.set(convo.folderId, {
            id: convo.folderId,
            name: convo.name || `Folder ${folderMap.size + 1}`,
            date: new Date().toISOString().slice(0, 10),
            type: 'chat' // Default to 'chat' unless specified elsewhere
          });
        }
      });

      return Array.from(folderMap.values());
    }

  // V1

  // private folders: WritableSignal<Folder[]> = signal([]);
  
  // constructor() { }

  // getFolders(): Signal<Folder[]> {
  //   return this.folders;
  // }

  // setFolders(folders: Folder[]) {
  //   this.folders.set(folders);
  // }

  // initFolders() {
  //   const foldersJson = localStorage.getItem('folders');
  //   try {
  //     const allFolders = JSON.parse(foldersJson || '');
  //     const chatFolders = this.filterFoldersByType(allFolders, 'chat');
  //     this.folders.set(chatFolders);
  //   } catch (error) {
  //     console.error(error);
  //   }

  //   // Create folder for today if one doesn't exist.
  //   // const today = new Date().toISOString().slice(0, 10); // Format: YYYY-MM-DD
  //   // const todayFolder = this.folders().find((folder: Folder) => { folder.date === today});
  //   // if (!todayFolder) {
  //   //   this.createNewFolder('chat');
  //   // }
  // }

  // filterFoldersByType(folders: Folder[], type: string) {
  //   return folders
  //     .filter((folder: Folder) => folder.type === type)
  //     .sort((a: Folder, b: Folder) => new Date(b.date!).getTime() - new Date(a.date!).getTime());
  // }

  // getFolderId(): string {
  //   const today = new Date().toISOString().slice(0, 10); // Format: YYYY-MM-DD
  //   const existingFolder = this.folders().find(folder => folder.date === today);
  
  //   if (existingFolder) {
  //     return existingFolder.id;
  //   }
    
  //   const newFolder = this.createNewFolder('chat');
  //   return newFolder.id;
  // }

  // private createNewFolder(type: string): Folder {
  //   const today = new Date().toISOString().slice(0, 10); // Format: YYYY-MM-DD
  //   const folderId = uuidv4();
  //   const newFolder = {
  //     id: folderId,
  //     date: today,
  //     name: this.getFormattedDate(),
  //     type,
  //   };
  //   this.folders.update((folders: Folder[]) => [...[newFolder], ...folders]);
  //   return newFolder;
  // }

  // private getFormattedDate() {
  //   const date = new Date();
  //   const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
  //   const month = months[date.getMonth()];
  //   const day = date.getDate();
  //   const year = date.getFullYear();
    
  //   return `${month} ${day}, ${year}`;
  // }
}
