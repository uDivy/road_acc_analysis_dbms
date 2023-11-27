import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'http://localhost:3000'; // This will be proxied to your Express backend

  constructor(private http: HttpClient) {}

  // Example GET request for login
  login(userData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/authenticate/login`, userData );
  }

  // Example POST request for signup
  signup(userData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/authenticate/signup`, userData);
  }

  // Add more methods for other API calls as needed
  // Add a method to fetch table count from the API
  getTableCount(): Observable<any> {
    const url = `${this.baseUrl}/queries/tableCount`; // Replace with your API endpoint
    return this.http.get(url);
  }

  drugAlcoholVision(): Observable<any> {
    return this.http.get(`${this.baseUrl}/queries/drugAlcoholVision`);
  }
  fatalitiesPerSeason(): Observable<any> {
    return this.http.get(`${this.baseUrl}/queries/fatalitiesPerSeason`);
  }
  crashSeverityIndex(): Observable<any> {
    return this.http.get(`${this.baseUrl}/queries/crashSeverityIndex`);
  }
  perHundredThousandPopulation(): Observable<any> {
    return this.http.get(`${this.baseUrl}/queries/perHundredThousandPopulation`);
  }
  responseTime(): Observable<any> {
    return this.http.get(`${this.baseUrl}/queries/responseTime`);
  }
}