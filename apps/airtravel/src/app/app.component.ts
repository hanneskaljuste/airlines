import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Airport, Journey } from '@sixfold/api-interfaces';
import { FormControl } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { debounceTime, map, startWith } from 'rxjs/operators';
@Component({
    selector: 'sixfold-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
    airports$ = this.http.get<Airport[]>('/api/airports');
    allAirports: Airport[] = [];


    origins$: Observable<Airport[]> = of([]);
    originControl: FormControl = new FormControl();

    destinations$: Observable<Airport[]> = of([]);
    destinationControl: FormControl = new FormControl();



    journey$: Observable<Journey> = of({ distance: 0, steps: [] });


    result: Journey | any = null;
    loading = false;

    ngOnInit() {
        this.airports$.subscribe((airports: Airport[]) => {
            this.allAirports = airports;
            this.origins$ = this.originControl.valueChanges
                .pipe(
                    debounceTime(500),
                    // startWith(''),
                    map(val => {
                        if (val.length < 3) return [];
                        return this.filter(val)
                    })
                );
            this.destinations$ = this.destinationControl.valueChanges
                .pipe(
                    debounceTime(500),
                    // startWith(''),
                    map(val => {
                        if (val.length < 3) return [];
                        return this.filter(val)
                    })
                );
        });



    }


    constructor(private http: HttpClient) {}

    filter(val: string): Airport[] {
        console.log(this.allAirports.length, val);
        return this.allAirports.filter(airport =>
            airport.name.toLowerCase().indexOf(val.toLowerCase()) >= 0);

    }

    submit() {
        this.journey$ = this.http.get<Journey>(`/api/journey/${this.originControl.value}/${this.destinationControl.value}`);
        this.loading = true;
        this.result = null;
        this.journey$.subscribe(
            (j) => {
                if (j.steps.length > 0) {
                    this.result = j;
                }
            },
            (err) => {
                console.log(err);
                this.result = err;
                this.loading = false;
            },
            () => {
                this.loading = false;
            }
        )
    }
}
