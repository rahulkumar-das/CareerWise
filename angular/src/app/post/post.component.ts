import { Component, OnInit, Input } from '@angular/core';
import { Title } from '@angular/platform-browser'


@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit {

  @Input() post;
  constructor(private title: Title) { }

  ngOnInit(): void {
  }

}
