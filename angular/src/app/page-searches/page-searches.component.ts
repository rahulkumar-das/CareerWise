import { Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../api.service';
import { Title } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';
import { UserDataService } from '../user-data.service';


@Component({
  selector: 'app-page-searches',
  templateUrl: './page-searches.component.html',
  styleUrls: ['./page-searches.component.css']
})
export class PageSearchesComponent implements OnInit {

  constructor(private api: ApiService, private route: ActivatedRoute, private title: Title,
     @Inject(DOCUMENT) private document: Document, private centralUserData: UserDataService ) { }

  public query= this.route.snapshot.params.query;
  public subscription;
  
  ngOnInit(): void {
    this.title.setTitle("Search Results");
    this.document.getElementById("sidebarToggleTop").classList.add("d-none");
    this.centralUserData.getUserData.subscribe((data)=>{
      this.subscription = this.route.params.subscribe(params =>{
     // console.log(this.query+" Inside onInit");
        this.query = params.query;
          this.user=data;
          this.getResults();
      });
    });
    
  }
  
  

  public results;
  private user;

  private getResults(){
    //console.log(this.query+" inside getResults");
    
    let requestObject={
      location:`users/get-search-results?query=${this.query}`,
      type:"GET",
      authorize: true
    }
    
    this.api.makeRequest(requestObject).then((val)=>{
      //console.log(val);
      this.results = val.results;

      for(let result of this.results){
        if(result.friends.includes(this.user._id)){
          
          result.isFriend = true;
        }

        if(result.friend_requests.includes(this.user._id)){
          
          result.haveSentFriendRequest = true;
        }

        if(this.user.friend_requests.includes(result._id)){
          
          result.haveReceivedFriendRequest = true;
        }
      }

    })

  }
  

}
