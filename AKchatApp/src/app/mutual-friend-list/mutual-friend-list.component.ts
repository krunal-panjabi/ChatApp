import { Component,Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-mutual-friend-list',
  templateUrl: './mutual-friend-list.component.html',
  styleUrls: ['./mutual-friend-list.component.css']
})
export class MutualFriendListComponent implements OnInit{
  imagedata: string[];
  namedata: string[];
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    this.imagedata = data.mutualarr; // Access 'res' property from data
    this.namedata=data.mutualfriendnames
  }
ngOnInit(): void {
  console.log("imgdata",this.imagedata);
  console.log("the friend",this.namedata);
}
}
