import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Airport, Message } from '@sixfold/api-interfaces';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
@Component({
    selector: 'sixfold-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
    airports$ = this.http.get<Airport[]>('/api/airports');


    startFilterControl = new FormControl();
    endFilterControl = new FormControl();
    start = new FormControl('');
    end = new FormControl('');

    options: Airport[] = [];
    filteredStart: Observable<Airport[]> | undefined;
    filteredEnd: Observable<Airport[]> | undefined;

    ngOnInit() {
        this.airports$.subscribe(d => this.options = d);

        this.filteredStart = this.startFilterControl.valueChanges.pipe(
            startWith(''),
            map(value => this._filter(value, 'start'))
        );
        this.filteredEnd = this.endFilterControl.valueChanges.pipe(
            startWith(''),
            map(value => this._filter(value, 'end'))
        );
    }

    private _filter(value: string, sourrce: string): Airport[] {

        console.log([value, sourrce]);
        // if (typeof value === 'string') {
        const filterValue = value.toLowerCase();

        const filtered = this.options.filter(option => option.name.toLowerCase().includes(filterValue));
        console.log(filtered);
        return filtered
        // }
        // return this.options;

    }
    constructor(private http: HttpClient) {}

    selected(type: string, value: Airport) {
        // this._filter('');
        console.log(value);
    }
}
