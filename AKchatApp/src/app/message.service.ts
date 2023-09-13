import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  messageDivVisibility: { [key: number]: boolean } = {};//for opening options
  messageDiv1Visibility: { [key: number]: boolean } = {};// for like iconin div that appears after dot
  messageDiv2Visibility:{[key:number]: boolean}={};//for private chat like logo
  
    
  constructor() { }
}
