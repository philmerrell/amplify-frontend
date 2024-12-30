import { Injectable, Signal, signal, WritableSignal } from '@angular/core';

export interface Folder {
  date: string;
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
      const raw = JSON.parse(foldersJson || '');
      const conversations = raw
        .filter((folder: Folder) => folder.type === 'chat')
        .sort((a: Folder, b: Folder) => new Date(b.date).getTime() - new Date(a.date).getTime());
      this.folders.set(conversations);
    } catch (error) {
      console.error(error);
    }
  }
}
