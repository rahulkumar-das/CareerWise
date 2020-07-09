import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { LocalStorageService } from '../local-storage.service';
import { EventEmitterService } from '../event-emitter.service';
import { UserDataService } from '../user-data.service';
import { ApiService } from '../api.service';
import { Title } from '@angular/platform-browser'




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

    this.events.onAlertEvent.subscribe((msg)=>{
      this.alertMessage = msg;
    });

    this.events.updateNumberOfFriendRequestsEvent.subscribe((msg)=>{
      this.numOfFriendRequests--;
    });

    this.centralUserData.getUserData.subscribe((data)=>{
      console.log(data);
      this.userData = data;
      this.numOfFriendRequests= data.friend_requests.length;
      this.profilePicture=data.profile_image;
      //console.log(this.profilePicture)
    });

    let requestObject={
      location:`users/get-user-data/${this.usersId}`,
      method: "GET",
      authorize:true

    }
    //console.log(requestObject)
    this.api.makeRequest(requestObject).then((val)=>{
      //console.log(val)
      this.centralUserData.getUserData.emit(val.user);
    })

  }
  public query: String = "";
  public usersName:String ="";
  public alertMessage: String="";
  public userData:any={};
  public numOfFriendRequests: number=0;
  public usersId:String ="" ;
  public profilePicture: String="default-avatar";
  

  public searchForFriends(){
    //console.log(this.query+"this is search for ");
    this.router.navigate(['/search-results',  { query: this.query }])
  }

}
