import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { Title } from '@angular/platform-browser';
import { LocalStorageService } from '../local-storage.service';
import { EventEmitterService } from '../event-emitter.service';


@Component({
  selector: 'app-page-feed',
  templateUrl: './page-feed.component.html',
  styleUrls: ['./page-feed.component.css']
})
export class PageFeedComponent implements OnInit {

  constructor( private api: ApiService, private title: Title, private storage: LocalStorageService, private events: EventEmitterService ) { }

  ngOnInit(): void {

    this.title.setTitle("A Career Wise-Feed")
    let requestObject = {
      type: "GET",
      location: "users/generate-feed",
      authorize: true
    }
    this.api.makeRequest(requestObject).then((val)=>{
     // console.log(val.posts);
     if(val.statusCode == 200){
       
       this.posts.col1= val.posts.filter((val,i)=>i%4==0);
       this.posts.col2=val.posts.filter((val,i)=>i%4==1);
       this.posts.col3=val.posts.filter((val,i)=>i%4==2);
       this.posts.col4=val.posts.filter((val,i)=>i%4==3);
       
     }
      
      //console.log("POST Object");
      //console.log(this.posts);
    });
  }

  public newPostContent: String ="";
  public newPostTheme: String = this.storage.getPostTheme() || "primary";

  public changeTheme(newTheme){
    this.newPostTheme=newTheme;
    this.storage.setPostTheme(newTheme);
    //console.log(this.newPostTheme);
  }

  //4 column format for feed page
  public posts={
    col3:[],
    col2:[],
    col4:[],
    col1:[],

  }

  public createPost(){
    if(this.newPostContent.length == 0){
      return this.events.onAlertEvent.emit("No content for your post was provided");
    }

    let requestObject={
      location:"users/create-post",
      type:"POST",
      authorize: true,
      body:{
        theme: this.newPostTheme,
        content: this.newPostContent
      }
    }

    this.api.makeRequest(requestObject).then((val)=>{
      console.log(val);
      if(val.statusCode ==201){
        //update go
        val.newPost.ago="Now";
        //Update feed
        this.posts.col1.unshift(val.newPost);

      }
      else{
        this.events.onAlertEvent.emit("Something went wrong, your post could not be created");
      }
      this.newPostContent="";
    });
    /* console.log("CREATE POST");
    console.log(this.newPostContent); */
  }
}
