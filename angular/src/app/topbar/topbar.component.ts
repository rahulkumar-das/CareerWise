import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { LocalStorageService } from '../local-storage.service';
import { EventEmitterService } from '../event-emitter.service';
import { UserDataService } from '../user-data.service';
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
                private centralUserData: UserDataService, private api: ApiService, private title: Title) { }

  ngOnInit(): void {

    // grabbing the jwt token to get the username
    //let token = this.storage.getToken();
    //console.log(token);

    //let name = JSON.parse(atob(token.split(".")[1])).name;
    //console.log(name);
    this.usersName = this.storage.getParsedToken().name;
    this.usersId=this.storage.getParsedToken()._id;

    let alertEvent = this.events.onAlertEvent.subscribe((msg)=>{
      console.log("ALERT");
      this.alertMessage = msg;
    });

    let friendRequestEvent= this.events.updateNumberOfFriendRequestsEvent.subscribe((msg)=>{
      this.numOfFriendRequests--;
    });

    let updateMessageEvent = this.events.updateSendMessageObjectEvent.subscribe((d)=>{
      this.sendMessageObject.id = d.id;
      this.sendMessageObject.name = d.name;
    });

    let userDataEvent=this.centralUserData.getUserData.subscribe((data)=>{
      //console.log(data);
      this.userData = data;
      this.numOfFriendRequests= data.friend_requests.length;
      this.profilePicture=data.profile_image;
      //console.log(this.profilePicture)
    });

    let requestObject={
      location:`users/get-user-data/${this.usersId}`,
      method: "GET",
     // authorize:true

    }
    //console.log(requestObject)
    this.api.makeRequest(requestObject).then((val)=>{
      //console.log(val)
      this.centralUserData.getUserData.emit(val.user);
    });
    this.subscriptions.add(alertEvent);
    this.subscriptions.add(friendRequestEvent);
    this.subscriptions.add(userDataEvent)
    this.subscriptions.add(updateMessageEvent);
    //console.log("this is it",this.subscriptions)

  }

  ngOnDestroy(){
    console.log("DESTROY");
    this.subscriptions.unsubscribe();
  } 

  public query: String = "";
  public usersName:String ="";
  public alertMessage: String="";
  public userData:any={};
  public numOfFriendRequests: number=0;
  public usersId:String ="" ;
  public profilePicture: String="default-avatar";

  public subscriptions= new Subscription();

  //to send message
  public sendMessageObject={
    id:"",
    name:"",
    content:""
  }

  public sendMessage(){
   
    /* console.log("user to", this.sendMessageObject.name);
    console.log("user id", this.sendMessageObject.id);
    console.log("content", this.sendMessageObject.content); */
    this.api.sendMessage(this.sendMessageObject);
    this.sendMessageObject.content="";
  }
  

  public searchForFriends(){
    //console.log(this.query+"this is search for ");
    this.router.navigate(['/search-results',  { query: this.query }])
  }

}
