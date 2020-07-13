import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { LocalStorageService } from './local-storage.service';
import { EventEmitterService } from './event-emitter.service'
import { EventEmitter } from 'protractor';


@Injectable({
  providedIn: 'root'
})
export class ApiService {


  constructor(private http: HttpClient, private storage : LocalStorageService, private events: EventEmitterService) { }

  private baseUrl="http://localhost:3000";

  private successHandler(value){
    return value;
  }
  private errorHandler(error){
    return error;
  }

  public makeRequest(requestObject):any{
    let method= requestObject.method.toLowerCase();
    if(!method){
      return console.log("No method is specified in the request object");
    }

    let body= requestObject.body || {};
    let location = requestObject.location;
    if(!location){

      return console.log("No location is specified in the request object");
    }
    let url = `${this.baseUrl}/${location}`;
    let httpOptions ={};

     if(this.storage.getToken()){
      httpOptions={
        headers: new HttpHeaders({
          'Authorization': `Bearer ${this.storage.getToken()}`
        }),
      }
    } 

    if(method == "get"){
      return this.http.get(url, httpOptions).toPromise()
      .then(this.successHandler)
      .catch(this.errorHandler);
    }

    if(method =="post"){
      return this.http.post(url, body, httpOptions).toPromise()
      .then(this.successHandler)
      .catch(this.errorHandler)
    }

  }

  public makeFriendRequest(to: string){
    let from = this.storage.getParsedToken()._id;
   let requestObject={
     location: `users/make-friend-request/${from}/${to}`,
     method: "POST"
   }


   return new Promise((resolve, reject)=>{

     this.makeRequest(requestObject).then((val)=>{
       //console.log(val);
        if(val.statusCode === 201){
          this.events.onAlertEvent.emit("Successfully sent a friend request!");
        }
        else{
          
          this.events.onAlertEvent.emit("Something went wrong, we could not send a friend request. Perhaps you already sent a friend request to this user.")
        }
        resolve(val);
     });
   });
  }

  public resolveFriendRequest(resolution, id){
    let to = this.storage.getParsedToken()._id;

    return new Promise((resolve)=>{
      let requestObject={
        location:`users/resolve-friend-request/${id}/${to}?resolution=${resolution}`,
        method:"POST"
      }
      this.makeRequest(requestObject).then((val)=>{
       if(val.statusCode === 201){
         this.events.updateNumberOfFriendRequestsEvent.emit();
          let resolutioned = (resolution == "accept") ? "accepted" : "declined";
          this.events.onAlertEvent.emit(`Successfully ${resolutioned} friend request`)

       }
       else{
         this.events.onAlertEvent.emit("Something went wrong")

       }
       
        resolve(val);
      });

    });
  }

  public sendMessage(sendMessageObject){
    if(!sendMessageObject.content){
      this.events.onAlertEvent.emit("Message not sent. You must provide some content for your message");
      return;
    }

    let requestObject={
      location: `users/send-message/${sendMessageObject.id}`,
      method:"POST",
      body:{
        content: sendMessageObject.content
      }
    }

    return new Promise((resolve, reject)=>{
      this.makeRequest(requestObject).then((val)=>{
        console.log(val);
        if(val.statusCode  == 201){
          this.events.onAlertEvent.emit("Successfully send a message");
        }

        resolve(val);
      });
    });

  }

}
