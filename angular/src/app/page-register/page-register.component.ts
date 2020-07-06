import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { LocalStorageService } from '../local-storage.service';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser'


@Component({
  selector: 'app-page-register',
  templateUrl: './page-register.component.html',
  styleUrls: ['./page-register.component.css']
})
export class PageRegisterComponent implements OnInit {

  constructor(private api : ApiService, private storage : LocalStorageService, private router: Router, private title: Title) { }

  ngOnInit(): void {
    this.title.setTitle("A Career Wise-Register")
  }

  public formError = "";
  public credentials={
    first_name:'',
    last_name:'',
    email:'',
    password:'',
    password_confirm:'' 
  };

  public formSubmit(){
    this.formError="";
    if(!this.credentials.first_name || !this.credentials.last_name || !this.credentials.email ||
      !this.credentials.password || !this.credentials.password_confirm){
        return this.formError="All fields are required"

    }
     /*  var re = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
      if(!re.test(this.credentials.email)){
        return this.formError="Please enter a valid email address"
      } */

      if(this.credentials.password!= this.credentials.password_confirm){
        return this.formError="Password and Confirm Password must match"
      }

    //console.log("Form submit");
    //console.log(this.credentials);
    this.register();
  }
  private register(){
    //console.log("Register");

    let requestObject= {
      type:"POST",
      location:"users/register",
      body: this.credentials

    }

    this.api.makeRequest(requestObject).then((val)=>{
     
      if(val.token){
        this.storage.setToken(val.token)
        this.router.navigate(['/']);
        return;
      }
     
      //if the email address is already registered then it will show error message
      if(val.message){
        this.formError = val.message;
      } 
     if(val.err){
       console.log(val.err)
     }
      
    })

  }

}
