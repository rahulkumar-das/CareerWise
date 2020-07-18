import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { LocalStorageService } from '../local-storage.service';
import { EventEmitterService } from '../event-emitter.service';
//import { UserDataService } from '../user-data.service';
import { ApiService } from '../api.service';
import { Title } from '@angular/platform-browser';
import { Subscription } from 'rxjs';




@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.css']
})


export class TopbarComponent implements OnInit {

  
  constructor(public auth: AuthService, private router: Router, private storage: LocalStorageService, private events: EventEmitterService,
                 private api: ApiService, private title: Title) { }

  ngOnInit(): void {

    // grabbing the jwt token to get the username
    //let token = this.storage.getToken();
    //console.log(token);

    //let name = JSON.parse(atob(token.split(".")[1])).name;
    //console.log(name);
    this.usersName = this.storage.getParsedToken().name;
    this.usersId=this.storage.getParsedToken()._id;

    let alertEvent = this.events.onAlertEvent.subscribe((msg)=>{
      //console.log("ALERT");
      this.alertMessage = msg;
    });

    let friendRequestEvent= this.events.updateNumberOfFriendRequestsEvent.subscribe((msg)=>{
     // this.numOfFriendRequests--;
     this.notifications.friendRequests--;
    });

    let updateMessageEvent = this.events.updateSendMessageObjectEvent.subscribe((d)=>{
      this.sendMessageObject.id = d.id;
      this.sendMessageObject.name = d.name;
    });

    let userDataEvent=this.events.getUserData.subscribe((user)=>{
     // console.log(user);
     // this.userData = data;
     // this.numOfFriendRequests= data.friend_requests.length;
     //console.log(user.messages);
    
     this.notifications.friendRequests = user.friend_requests.length;
     this.notifications.messages = user.new_message_notifications.length;
      this.profilePicture=user.profile_image;
      this.notifications.alerts=user.new_notifications;
      this.setAlerts(user.notifications)
     // console.log(this.alerts);

      this.setMessagePreviews(user.messages, user.new_message_notifications);
     // console.log(this.messagePreviews);
      //console.log(this.profilePicture)
    });

    let resetMessagesEvent = this.events.resetMessageNotificationsEvent.subscribe(()=>{
      this.notifications.messages = 0;
    })
    
    let requestObject={
      location:`users/get-user-data/${this.usersId}`,
      method: "GET",
     // authorize:true

    }
    //console.log(requestObject)
    this.api.makeRequest(requestObject).then((val)=>{
      //console.log(val)
      if(val.status == 404){
        return this.auth.logout();
      }
      if(val.statusCode == 200){

        this.events.getUserData.emit(val.user);
      }
    });
    this.subscriptions.add(alertEvent);
    this.subscriptions.add(friendRequestEvent);
    this.subscriptions.add(userDataEvent)
    this.subscriptions.add(updateMessageEvent);
    this.subscriptions.add(resetMessagesEvent);
    //console.log("this is it",this.subscriptions)

  }

  ngOnDestroy(){
   // console.log("DESTROY");
    this.subscriptions.unsubscribe();
  } 

  public subscriptions= new Subscription();
  public query: String = "";
  public sendMessageObject={
    id:"",
    name:"",
    content:""
  }
  public alertMessage: String="";

  //User Data
  public usersName:String ="";
 // public userData:any={};
 public usersId:String ="" ;
 public profilePicture: string="default-avatar";
 public messagePreviews = [];
 public alerts=[];
 public notifications={
   alerts:0,
   friendRequests:0,
   messages:0
 }

 
 //public numOfFriendRequests: number=0;

  //to send message

  public sendMessage(){
   
    /* console.log("user to", this.sendMessageObject.name);
    console.log("user id", this.sendMessageObject.id);
    console.log("content", this.sendMessageObject.content); */
    this.api.sendMessage(this.sendMessageObject);
    this.sendMessageObject.content="";
  }
  

  public searchForFriends(){
    //console.log(this.query+"this is search for ");
    this.router.navigate(['/search-results',  { query: this.query }]);
  }

  public resetMessageNotifications(){
    if(this.notifications.messages == 0){
      return;
    }
    this.api.resetMessageNotifications();
  }

  public resetAlertNotifications(){
    if(this.notifications.alerts == 0){
      return;
    }
    let requestObject={
      location:"users/reset-alert-notifications",
      method:"POST"
    }
    this.api.makeRequest(requestObject).then((val)=>{
     // console.log(val);
     if(val.statusCode == 201){
       this.notifications.alerts=0;
     }
    })
  }

  private setMessagePreviews(messages,messageNotifications){
    for(let i = messages.length-1; i>=0;i--){
      let lastMessage = messages[i].content[messages[i].content.length-1];
      let preview={
        messengerName: messages[i].messengerName,
        messageContent: lastMessage.message,
        messengerImage: "",
        messengerId: messages[i].from_id,
        isNew: false
      }

      if(lastMessage.messenger == this.usersId){
        preview.messengerImage=this.profilePicture

      }
      else{
        preview.messengerImage=messages[i].messengerProfileImage
        if(messageNotifications.includes(messages[i].from_id)){
          preview.isNew=true;

        }

      }

      if(preview.isNew){
        this.messagePreviews.unshift(preview);

      }
      else{
        this.messagePreviews.push(preview);

      }
    }
  }

  public messageLink(messageId){
    this.router.navigate(['/messages'], {state:{data:{ msgId: messageId} } } );
  }

  private setAlerts(notificationsData){
   // console.log(notificationsData);

    for(let alert of notificationsData){
      let alertObj = JSON.parse(alert);
     // console.log(alertObj)

      let newAlert={
        text: alertObj.alert_text,
        icon: "",
        bgColor: "",
        href:""
      }

      switch(alertObj.alert_type){
        case "new_friend":
          newAlert.icon = "fa-user-check";
          newAlert.bgColor = "bg-success";
          newAlert.href=`/profile/${alertObj.from_id}`;
          break;
        
        case "liked_post":
          newAlert.icon = "fa-thumbs-up";
          newAlert.bgColor = "bg-purple";
          newAlert.href=`/profile/${this.usersId}`;
          break;
        
         case "commented_post":
          newAlert.icon = "fa-comment";
          newAlert.bgColor = "bg-purple";
          newAlert.href=`/profile/${this.usersId}`;
          break;
      }
      this.alerts.push(newAlert);
    }
  }


}
