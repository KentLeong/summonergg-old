import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit {

  constructor() { }

  @ViewChild('background', {static: true}) background: ElementRef;

  ngOnInit() {
    this.background.nativeElement.muted = true;
    this.background.nativeElement.play();
  }
}
