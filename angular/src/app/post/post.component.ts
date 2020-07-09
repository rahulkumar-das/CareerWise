/* import { Component, OnInit, Input } from '@angular/core';
import { ApiService } from '../api.service';
import { LocalStorageService } from '../local-storage.service';



@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit {

  @Input() post;
  constructor(private api: ApiService, private storage: LocalStorageService) { }

  ngOnInit(): void {

    function removeLeadingNumbers(string){
      function isNumber(n){
        n=Number(n);
        if(!isNaN(n)){
          return true;
        }
      }
      if(string && isNumber(string[0])){
        string = removeLeadingNumbers(string.substring(1));
      }
      
      return string;
     
    }
    this.fakeId=removeLeadingNumbers(this.post._id);
    
    //console.log(this.fakeId);

    //extra styling based on content length set the fontSize and align
    if(this.post.content.length<40){
      this.fontSize=22;
    }
    if(this.post.content.length<24){
      this.align="center";
      this.fontSize=28;
    }
    if(this.post.content.length<14){
      this.fontSize=32;
    }
    if(this.post.content.length<8){
      this.fontSize=44;
    }
    if(this.post.content.length<5){
      this.fontSize=62;
    }

    this.userId = this.storage.getParsedToken()._id;
    if(this.post.likes.includes(this.userId)){
      this.liked= true;
    }
  }

  public fakeId:String="";
  //to align and adjust the fontSize of small content
  public fontSize: number =18;
  public align: String = "left";
  public liked:boolean = false;
  public userId:String = "";
  public comment: String = "";

  //method to like and remove like the post->same controller
  public likeButtonClicked(postid){
   // console.log(postid)
    let requestObject={
      location: `users/like-unlike/${this.post.ownerid}/${this.post._id}`,
      method: "POST",
    
    }
    this.api.makeRequest(requestObject).then((val)=>{
      //console.log(val);
      if(this.post.likes.includes(this.userId)){
        this.post.likes.splice(this.post.likes.indexOf(this.userId),1);
        this.liked = false; 

      }
      else{

        this.post.likes.push(this.userId);
        this.liked=true;
      }
    })
    //console.log("Like of Dislike", postid);
  }

  public postComment(){
    if(this.comment.length == 0){
      return;
    }
    console.log("POST COMMENT", this.comment);

    let requestObject={
      location:`users/post-comment/${this.post.ownerid}/${this.post._id}`,
      method: "POST",
      body:{
        content: this.comment
      },
      authorize:true
    }

    this.api.makeRequest(requestObject).then((val)=>{
      console.log("this is ",val);
      console.log("POST ",this.post)

      if(val.statusCode == 201){
        let newComment={
          ...val.comment,
          commenter_name: val.commenter.name,
          //commenter_profile_image: val.commenter.profile_image
        }

        this.post.comments.push(newComment);
        this.comment="";
      }
    })

  }

  }
 */

import { Component, OnInit, Input } from '@angular/core';
import { ApiService } from '../api.service';
import { LocalStorageService } from '../local-storage.service';



@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit {

  @Input() post;
  constructor(private api: ApiService, private storage: LocalStorageService) { }

  ngOnInit(): void {

    function removeLeadingNumbers(string){
      function isNumber(n){
        n=Number(n);
        if(!isNaN(n)){
          return true;
        }
      }
      if(string && isNumber(string[0])){
        string = removeLeadingNumbers(string.substring(1));
      }
      
      return string;
     
    }
    this.fakeId=removeLeadingNumbers(this.post._id);
    
    //console.log(this.fakeId);

    //extra styling based on content length set the fontSize and align
    if(this.post.content.length<40){
      this.fontSize=22;
    }
    if(this.post.content.length<24){
      this.align="center";
      this.fontSize=28;
    }
    if(this.post.content.length<14){
      this.fontSize=32;
    }
    if(this.post.content.length<8){
      this.fontSize=44;
    }
    if(this.post.content.length<5){
      this.fontSize=62;
    }

    this.userId = this.storage.getParsedToken()._id;
    if(this.post.likes.includes(this.userId)){
      this.liked= true;
    }
  }

  public fakeId:String="";
  //to align and adjust the fontSize of small content
  public fontSize: number =18;
  public align: String = "left";
  public liked:boolean = false;
  public userId:String = "";
  public comment: String = "";

  //method to like and remove like the post->same controller
  public likeButtonClicked(postid){

    let requestObject={
      location: `users/like-unlike/${this.post.ownerid}/${this.post._id}`,
      method: "POST",
      authorize: true
    }
    this.api.makeRequest(requestObject).then((val)=>{
      //console.log(val);
      if(this.post.likes.includes(this.userId)){
        this.post.likes.splice(this.post.likes.indexOf(this.userId),1);
        this.liked = false; 

      }
      else{

        this.post.likes.push(this.userId);
        this.liked=true;
      }
    })
    //console.log("Like of Dislike", postid);
  }

  public postComment(){
    if(this.comment.length == 0){
      return;
    }
    console.log("POST COMMENT", this.comment);

    let requestObject={
      location:`users/post-comment/${this.post.ownerid}/${this.post._id}`,
      method: "POST",
      authorize: true,
      body:{
        content: this.comment
      }
    }

    this.api.makeRequest(requestObject).then((val)=>{
      console.log(requestObject);
      console.log(this.post)

      if(val.statusCode == 201){
        let newComment={
          ...val.comment,
          commenter_name: val.commenter.name,
          commenter_image: val.commenter.profile_image
        }

        this.post.comments.push(newComment);
        this.comment="";
      }
    })

  }

  }
