import {AfterViewInit, Component, ElementRef, Inject, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {Course} from '../model/course';
import {FormBuilder, Validators, FormGroup} from '@angular/forms';
import * as moment from 'moment';
import {catchError} from 'rxjs/operators';
import {throwError} from 'rxjs';
import { CoursesService } from '../services/courses.service';
import { LoadingService } from '../loading/loading.service.service';
import { MessagesService } from '../messages/messages.service';
import { CoursesStore } from '../services/courses.store';

@Component({
    // tslint:disable-next-line: component-selector
    selector: 'course-dialog',
    templateUrl: './course-dialog.component.html',
    styleUrls: ['./course-dialog.component.css'],
    providers: [
        LoadingService,
        MessagesService
    ]
})
export class CourseDialogComponent implements AfterViewInit {

    form: FormGroup;

    course: Course;

    constructor(
        private fb: FormBuilder,
        private dialogRef: MatDialogRef<CourseDialogComponent>,
        @Inject(MAT_DIALOG_DATA) course: Course,
        private coursesStore: CoursesStore,
        //private coursesService: CoursesService,   ==> replaed with coursesStore
        //private loadingService: LoadingService,  ==> calls it on storeservice not here
        private messagesService: MessagesService) {

        this.course = course;

        this.form = fb.group({
            description: [course.description, Validators.required],
            category: [course.category, Validators.required],
            releasedAt: [moment(), Validators.required],
            longDescription: [course.longDescription, Validators.required]
        });

    }

    ngAfterViewInit() {

    }


    //Stateless Save
    // save() {

    //   const changes = this.form.value;

    //   const saveCourse$ = this.coursesService.saveCourse(this.course.id, changes)
    //     .pipe(
    //         catchError(err => {
    //             const message = 'Could not save course';
    //             console.log (message, err);
    //             this.messagesService.showErrors(message);
    //             return throwError(err);
    //         })
    //     );

    // //   this.coursesService.saveCourse(this.course.id, changes)
    // //     .subscribe(
    // //         (value) => {
    // //             this.dialogRef.close(value);
    // //         }
    // //     );

    //   this.loadingService.showLoaderUntilCompleted(saveCourse$)
    //   .subscribe(
    //             (value) => {
    //                 this.dialogRef.close(value);
    //             }
    //         );

    // }


    //Store Save

    save() {

        const changes = this.form.value;
        

        //error handling by store
        const saveCourse$ = this.coursesStore.saveCourse(this.course.id, changes)
          .subscribe();

          this.dialogRef.close(changes);
      }

    close() {
        this.dialogRef.close();
    }

}
