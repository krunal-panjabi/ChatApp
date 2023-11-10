import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SessionstorageserviceService {
  isSessionStorageReady: Promise<boolean>;

  constructor() {
    this.isSessionStorageReady = this.initializeSessionStorage();
  }

  private initializeSessionStorage(): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(true); 
      }, 500); 
    });
  }
}
