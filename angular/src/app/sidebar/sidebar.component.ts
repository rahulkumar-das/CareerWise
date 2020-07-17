import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../auth.service';
//import { UserDataService } from '../user-data.service';
import { EventEmitterService } from '../event-emitter.service';
import { Subscription } from 'rxjs';



@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  constructor(public auth: AuthService, private events: EventEmitterService) { }

  ngOnInit(): void {
   let userDataEvent= this.events.getUserData.subscribe((user)=>{
      this.userData=user;
      //console.log(this.userData)
    })
    this.subscriptions.add(userDataEvent)
  }
  ngOnDestroy(){
    //console.log("DESTROY");
    this.subscriptions.unsubscribe();
  } 

  public userData:any={};
  public subscriptions= new Subscription();

}
