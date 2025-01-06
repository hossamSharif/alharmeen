import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { PERMITS_DATA } from './mock-permits';

@Injectable({
  providedIn: 'root'
})

export class VisitorsPermitsService {
  constructor(private http: HttpClient) {}

  getPermits(): Observable<any[]> {
    // Simulate HTTP call with delay
    return of(PERMITS_DATA).pipe(delay(500));
  }

  searchPermits(searchTerm: string): Observable<any[]> {
    const filteredData = PERMITS_DATA.filter(permit => 
      permit.visitorName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    return of(filteredData).pipe(delay(300));
  }
}
