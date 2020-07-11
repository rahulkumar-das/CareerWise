import { Component, OnInit, Inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';
import { UserDataService } from '../user-data.service';
import { ApiService } from '../api.service';
import { ActivatedRoute } from '@angular/router';
import { EventEmitterService } from '../event-emitter.service';



@Component({
  selector: 'app-page-profile',
  templateUrl: './page-profile.component.html',
  styleUrls: ['./page-profile.component.css']
})
export class PageProfileComponent implements OnInit {

  constructor(private title: Title, @Inject(DOCUMENT) private document: Document, private centralUserData: UserDataService, private api: ApiService, private route: ActivatedRoute, private events: EventEmitterService) { }

  ngOnInit(): void {
    this.title.setTitle("Profile")
    this.document.getElementById("sidebarToggleTop").classList.add("d-none");

    let paramId = this.route.snapshot.params.userid;
    //console.log("this is paramId",paramId)

    this.centralUserData.getUserData.subscribe((user)=>{
      //console.log(user)
      this.route.params.subscribe((params)=>{

        if(params.userid==user._id){
         // console.log("Your profile")
        // this.canSendMessage=false;
          this.setComponentValues(user);
          this.resetBooleans();
        }
        else{
         // console.log("Not your profile");
          this.canSendMessage=true;
          let requestObject={
            location:`users/get-user-data/${params.userid}`,
            method:"GET"
          }
  
          this.api.makeRequest(requestObject).then((data)=>{
            if(data.statusCode == 200){
              //console.log(data)

              //if already a friend, cannot add from profile page
              this.canAddUser = user.friends.includes(data.user._id) ? false:true;

              // user-> the logged in profile
              //data.user-> other's profile

              //if received friend request from data.user by checking friend_requests array of user by id of data.user set true
              this.haveReceivedFriendRequest=user.friend_requests.includes(data.user._id);
              //if sent friend request by user to data.user, check friend_requests array of data.user by id of user set true
              this.haveSentFriendRequest=data.user.friend_requests.includes(user._id) ? true:false;

              this.setComponentValues(data.user)
            }
          })
        }
      })
      })
  }


  public randomFriends: string[]=[];
  public totalFriends:number=0;
  public posts: object[]=[];
  public profilePicture: string = "default-avatar";
  public usersName: string="";
  public showPosts: number=6;
  public usersEmail: string="";
  public usersId: string="";

  public canAddUser: boolean=false;
  public canSendMessage: boolean=false;
  public haveSentFriendRequest: boolean = false;
  public haveReceivedFriendRequest: boolean=false;


  public showMorePosts(){
    this.showPosts=this.showPosts+6;
  }
  public backToTop(){
    this.document.body.scrollTop = this.document.documentElement.scrollTop = 0;
  }

  public setComponentValues(user){
    this.randomFriends=user.random_friends;
    this.profilePicture=user.profile_image;
    this.posts=user.posts;
    this.usersName=user.name;
    this.usersEmail=user.email;
    this.totalFriends=user.friends.length;
    this.usersId=user._id;
  }

  public accept(){
    console.log("ACCEPT")

    this.api.resolveFriendRequest("accept", this.usersId).then((val)=>{
      if(val['statusCode'] == 201){
        this.haveReceivedFriendRequest=false;
        this.canAddUser=false;
        this.totalFriends++;
      }

      
    })
  }
  public decline(){
    console.log("Decline")

    this.api.resolveFriendRequest("decline", this.usersId).then((val)=>{
      if(val['statusCode'] == 201){
        this.haveReceivedFriendRequest=false;
      }

      
    })
  }

  public makeFriendRequest(){
    this.api.makeFriendRequest(this.usersId).then((val)=>{
      if(val['statusCode']==201){
        this.haveSentFriendRequest=true;
      }
    })
  }  

  private resetBooleans(){
    this.canAddUser=false;
    this.canSendMessage=false;
    this.haveSentFriendRequest=false;
    this.haveReceivedFriendRequest=false
  }

}
