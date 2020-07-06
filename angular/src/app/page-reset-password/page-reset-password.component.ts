import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { ActivatedRoute } from '@angular/router' //for finding url parameters
import { Title } from '@angular/platform-browser'


@Component({
  selector: 'app-page-reset-password',
  templateUrl: './page-reset-password.component.html',
  styleUrls: ['./page-reset-password.component.css']
})
export class PageResetPasswordComponent implements OnInit {

  constructor(private api: ApiService, private route: ActivatedRoute, private title: Title) { }

  public token = '';

  ngOnInit(): void {
    this.title.setTitle("A Career Wise-Reset Password")
    this.token = this.route.snapshot.paramMap.get("token"); //the path is given as reset/:token
                                                            //that's why use get("token")
    console.log(this.token);

  }

  public formError = "";

  public credentials = {
    
    password : '',
    password_confirm : ''

  };

  public formSubmit(){
    this.formError = "";

    if( !this.credentials.password || !this.credentials.password_confirm )
    {
      return this.formError="All fields are required";
    }

    if(this.credentials.password !== this.credentials.password_confirm){
      return this.formError = "Passwords don't match.";
    }


    if(!this.formError){
      return this.reset();
    }
    
  }

  private reset(){
    let requestObject = {
      type : "POST",
      location : "reset/"+this.token,
      body : this.credentials
    }

    this.api.makeRequest(requestObject).then((val)=>{
      if(val.message){this.formError = val.message;}
      console.log(val.message);
      
    });

  }

}
