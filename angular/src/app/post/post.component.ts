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
  }

  public fakeId:String="";
  //to align and adjust the fontSize of small content
  public fontSize: number =18;
  public align: String = "left";
}
