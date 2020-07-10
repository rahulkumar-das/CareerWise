import { Component, OnInit, Inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';
import { UserDataService } from '../user-data.service';
import { ApiService } from '../api.service';
import { ActivatedRoute } from '@angular/router';



@Component({
  selector: 'app-page-profile',
  templateUrl: './page-profile.component.html',
  styleUrls: ['./page-profile.component.css']
})
export class PageProfileComponent implements OnInit {

  constructor(private title: Title, @Inject(DOCUMENT) private document: Document, private centralUserData: UserDataService, private api: ApiService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.title.setTitle("Profile")
    this.document.getElementById("sidebarToggleTop").classList.add("d-none");

    let paramId = this.route.snapshot.params.userid;
    //console.log("this is paramId",paramId)

    this.centralUserData.getUserData.subscribe((user)=>{
      //console.log(user)
      if(paramId==user._id){
        console.log("Your profile")
        this.setComponentValues(user);
      }
      else{
        console.log("Not your profile")
      }
    })
  }


  public randomFriends: string[]=[];
  public totalFriends:number=0;
  public posts: object[]=[];
  public profilePicture: string = "default-avatar";
  public usersName: string="";
  public showPosts: number=6;
  public usersEmail: string="";

  public canAddUser: boolean=false;
  public canSendMessage: boolean=true;


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
  }

}
