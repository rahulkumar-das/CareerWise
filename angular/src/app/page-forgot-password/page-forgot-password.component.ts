import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service'
import { Title } from '@angular/platform-browser'


@Component({
  selector: 'app-page-forgot-password',
  templateUrl: './page-forgot-password.component.html',
  styleUrls: ['./page-forgot-password.component.css']
})
export class PageForgotPasswordComponent implements OnInit {

  constructor(private api: ApiService, private title: Title) { }

  ngOnInit(): void {
    this.title.setTitle("A Career Wise-Forgot Password")
  }

  public formError = "";

  public credentials = {
    email : ''
  };

  public formSubmit(){
    this.formError = "";

    if( !this.credentials.email ){
      return this.formError="Email is required";
    }

    if(!this.formError){
      return this.forgot();
    }
    
  }

  private forgot(){
    let requestObject = {
      type : "POST",
      location : "forgot",
      body : this.credentials
    }

    this.api.makeRequest(requestObject).then((val)=>{
      if(val.message){this.formError = val.message;}
      console.log(val.message)

    });
  }
}


