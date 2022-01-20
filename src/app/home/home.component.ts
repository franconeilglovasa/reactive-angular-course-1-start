import {Component, OnInit} from '@angular/core';
import {Course, sortCoursesBySeqNo} from '../model/course';
import {interval, noop, Observable, of, throwError, timer} from 'rxjs';
import {catchError, delay, delayWhen, filter, finalize, map, retryWhen, shareReplay, tap} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {CourseDialogComponent} from '../course-dialog/course-dialog.component';
import { CoursesService } from '../services/courses.service';
import { LoadingService } from '../loading/loading.service.service';
import { MessagesService } from '../messages/messages.service';
import { CoursesStore } from '../services/courses.store';


@Component({
  // tslint:disable-next-line: component-selector
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  beginnerCourses$: Observable<Course[]>;

  advancedCourses$: Observable<Course[]>;


  constructor(
    // private coursesService: CoursesService, //no longer needed
    private coursesStore: CoursesStore,
    private loadingService: LoadingService,
    private messagesService: MessagesService) {

  }

  ngOnInit() {
    this.reloadCourses();
  }

  reloadCourses() {

    // this.loadingService.loadingOn();

    //CoursesService will be replaced with State CourseStore -> to store the data instead of loading it everytime
    // const courses$ = this.coursesService.loadAllCourses()
    //       .pipe (
    //         map( courses => courses.sort(sortCoursesBySeqNo)),
    //         // finalize(() => this.loadingService.loadingOff()) // finalize will trigger after the observable finishes
    //         catchError(err => {
    //           const message = 'Could not load courses';
    //           this.messagesService.showErrors(message);
    //           // console.log (message, err);
    //           return throwError(err); // need to throw another observable. throwerror terminates the observable chain.
    //         })
    //       );

    //// no more finalize. change the courses$ to loadCourses$
    //const loadCourses$ = this.loadingService.showLoaderUntilCompleted(courses$);
    
    // this.beginnerCourses$ = loadCourses$
    //   .pipe(
    //     map (courses => courses.filter(course => course.category == 'BEGINNER'))
    //   );

    //the home doesnt know where the data come from whether from the backend or memory
    this.beginnerCourses$ = this.coursesStore.filterByCategory("BEGINNER");

      // this.advancedCourses$ = loadCourses$
      // .pipe(
      //   map (courses => courses.filter(course => course.category == 'ADVANCED'))
      // );

    this.advancedCourses$ = this.coursesStore.filterByCategory("ADVANCED");
  }



}




