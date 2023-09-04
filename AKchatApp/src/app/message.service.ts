import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  messageDivVisibility: { [key: number]: boolean } = {};
  messageDiv1Visibility: { [key: number]: boolean } = {};
  messageDiv2Visibility:{[key:number]: {count:number}}={};
  
    
  constructor() { }
}
