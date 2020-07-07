import { Component, OnInit, Input } from '@angular/core';
import { Title } from '@angular/platform-browser'
import { ThrowStmt } from '@angular/compiler';


@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit {

  @Input() post;
  constructor(private title: Title) { }

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
  }

  public fakeId:String="";
}
