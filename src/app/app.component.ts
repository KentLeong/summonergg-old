import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  showSearch: boolean = false;

  constructor(
    private router: Router,
  ) {
    router.events.subscribe(route => {
      if (route.toString().split("(")[0] == "NavigationEnd" && Object.values(route)[2] != "/") {
        this.showSearch = true;
      } else if (route.toString().split("(")[0] == "NavigationEnd" && Object.values(route)[2] == "/") {
        this.showSearch = false;
      }
    })
  }


  ngOnInit() {

  }
}
