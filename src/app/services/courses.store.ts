import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, throwError } from "rxjs";
import { catchError, map, shareReplay, tap } from "rxjs/operators";
import { LoadingService } from "../loading/loading.service.service";
import { MessagesService } from "../messages/messages.service";
import { Course, sortCoursesBySeqNo } from "../model/course";

@Injectable( {
    providedIn: 'root'    //makes it universal - there's only one instance of this service
})
export class CoursesStore {

    private subject = new BehaviorSubject<Course[]>([]);
    courses$ : Observable<Course[]> = this.subject.asObservable();

    constructor(private http:HttpClient, 
        private loading: LoadingService,
        private messages: MessagesService) {
            this.loadAllCourses();

    }
    
    //must be loaded in the constructor so that it'll load when started
    private loadAllCourses() {
       const loadCourses$ = this.http.get<Course[]>('api/courses')
            .pipe(
                map(response => response["payload"]),
                catchError (err => {
                    const message = "Could not load courses";
                    this.messages.showErrors(message);
                    console.log (message,err);
                    return throwError(err);
                }),
                tap( courses => this.subject.next(courses))
            );
        this.loading.showLoaderUntilCompleted(loadCourses$)
            .subscribe();

    }

                                //Partial means partial objects
    saveCourse (courseId: string, changes: Partial<Course>): Observable<any> {
        const courses = this.subject.getValue(); //get the last value of the subject

        //identify the courses needs to be modified
        const index = courses.findIndex(course => course.id == courseId);

        //create a new version of the course incl changes;
        const newCourse : Course = {
            ...courses[index],
            ...changes
        };


        //slice is the slice of array and craate new array
        //its different array pointing to the same object
        const newCourses: Course[] = courses.slice(0);

        newCourses[index] = newCourse;
        //update the changes made
        this.subject.next(newCourses);

        //send to backend
        return this.http.put('/api/courses/${courseId', changes)
            .pipe(
                catchError(err => {
                    const message = 'Could not save course';
                    console.log (message, err);
                    this.messages.showErrors(message);
                    return throwError(err);
                    }),
                shareReplay()
            );


    }

    filterByCategory(category: string) : Observable<Course[]> {
        return this.courses$
            .pipe(
                map(courses => 
                    courses.filter(course => course.category == category)
                        .sort(sortCoursesBySeqNo))
            )
    }

}