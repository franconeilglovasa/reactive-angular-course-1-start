import {Component, OnInit} from '@angular/core';
import { LoadingService } from './loading/loading.service.service';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [
    LoadingService   // added here since there's no @injectable ({ 'root' }) on the loading service
  ]
})
export class AppComponent implements  OnInit {

    constructor() {

    }

    ngOnInit() {


    }

  logout() {

  }

}
