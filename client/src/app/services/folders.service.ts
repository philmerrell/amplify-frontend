import { Injectable, Signal, signal, WritableSignal } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';

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

  private folders: WritableSignal<Folder[]> = signal([]);
  
  constructor() { }

  getFolders(): Signal<Folder[]> {
    return this.folders;
  }

  setFolders(folders: Folder[]) {
    this.folders.set(folders);
  }

  initFolders() {
    const foldersJson = localStorage.getItem('folders');
    try {
      const allFolders = JSON.parse(foldersJson || '');
      const chatFolders = this.filterFoldersByType(allFolders, 'chat');
      this.folders.set(chatFolders);
    } catch (error) {
      console.error(error);
    }

    // Create folder for today if one doesn't exist.
    // const today = new Date().toISOString().slice(0, 10); // Format: YYYY-MM-DD
    // const todayFolder = this.folders().find((folder: Folder) => { folder.date === today});
    // if (!todayFolder) {
    //   this.createNewFolder('chat');
    // }
  }

  filterFoldersByType(folders: Folder[], type: string) {
    return folders
      .filter((folder: Folder) => folder.type === type)
      .sort((a: Folder, b: Folder) => new Date(b.date!).getTime() - new Date(a.date!).getTime());
  }

  getFolderId(): string {
    const today = new Date().toISOString().slice(0, 10); // Format: YYYY-MM-DD
    const existingFolder = this.folders().find(folder => folder.date === today);
  
    if (existingFolder) {
      return existingFolder.id;
    }
    
    const newFolder = this.createNewFolder('chat');
    return newFolder.id;
  }

  private createNewFolder(type: string): Folder {
    const today = new Date().toISOString().slice(0, 10); // Format: YYYY-MM-DD
    const folderId = uuidv4();
    const newFolder = {
      id: folderId,
      date: today,
      name: this.getFormattedDate(),
      type,
    };
    this.folders.update((folders: Folder[]) => [...[newFolder], ...folders]);
    return newFolder;
  }

  private getFormattedDate() {
    const date = new Date();
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    const month = months[date.getMonth()];
    const day = date.getDate();
    const year = date.getFullYear();
    
    return `${month} ${day}, ${year}`;
  }
}
