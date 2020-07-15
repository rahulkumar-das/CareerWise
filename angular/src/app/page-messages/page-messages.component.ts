import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ApiService } from '../api.service';
import { UserDataService } from '../user-data.service';
import { Subscription } from 'rxjs';
import{ ChangeDetectorRef } from '@angular/core';



@Component({
  selector: 'app-page-messages',
  templateUrl: './page-messages.component.html',
  styleUrls: ['./page-messages.component.css']
})
export class PageMessagesComponent implements OnInit {

  constructor(private title: Title, private api: ApiService, private centralUserData: UserDataService,  private cdRef : ChangeDetectorRef ) { }

  ngOnInit(): void {



   
    this.title.setTitle("Your Messages");
    this.api.resetMessageNotifications();

    if(history.state.data && history.state.data.msgId){
     // console.log("Found State");
     this.activeMessage.fromId = history.state.data.msgId;

    }
    /* else{
      console.log("Not found")
    } */

    let userDataEvent = this.centralUserData.getUserData.subscribe((user)=>{
     // console.log(user)
     this.activeMessage.fromId = this.activeMessage.fromId ||  user.messages[0].from_id;
     this.messages = user.messages;
     this.usersName = user.name;
     this.usersId = user._id;
     this.usersProfileImage = user.profile_image;
     this.setActiveMessage(this.activeMessage.fromId);
    });

    this.subscriptions.add(userDataEvent);

  }

  public activeMessage = {
    fromId: "",
    fromName: "",
    fromProfilePicture: "",
    messageGroups:[]
  }

  public messages=[];
  public usersProfileImage = "default-avatar";
  public usersName="";
  public usersId="";
  public subscriptions= new Subscription();

  public setActiveMessage(id){
   // console.log("SET ACTIVE MESSAGE ",id);
   for(let message of this.messages){
     if(message.from_id == id){
       this.activeMessage.fromId = message.from_id;
       this.activeMessage.fromName=message.messengerName;
       this.activeMessage.fromProfilePicture = message.messengerProfileImage;
       //this.activeMessage.messages=message.content;
       let groups=(this.activeMessage.messageGroups=[]);
       for(let content of message.content){
         let me=(content.messenger == this.usersId);

         if(groups.length){
           var lastMessengerId = groups[groups.length - 1].id;

           if(content.messenger == lastMessengerId){
             groups[groups.length-1].messages.push(content.message);
             continue;
           }
         }

         let group={
           image: me ? this.usersProfileImage : message.messengerProfileImage,
           name: me ? "Me" : message.messengerName,
           id: content.messenger,
           messages: [content.message],
           isMe: me
         }

         groups.push(group);
       }
     }
   }
   this.cdRef.detectChanges();
   //console.log(this.activeMessage)
  }

}
