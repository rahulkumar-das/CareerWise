import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Title } from '@angular/platform-browser'



@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  constructor(public auth: AuthService, private title: Title) { }

  ngOnInit(): void {
  }

}
