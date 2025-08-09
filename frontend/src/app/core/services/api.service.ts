import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { catchError, map, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private baseUrl = 'http://localhost:3001';

  constructor(private http: HttpClient, private toastr: ToastrService) { }

  get<T>(endpoint: string, params?: HttpParams): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}/${endpoint}`, { params });
  }

  post<T>(endpoint: string, data: any): Observable<T> {
    return this.http.post<T>(`${this.baseUrl}/${endpoint}`, data).pipe(
      map((res: any) => {
        console.log(res?.message);

        if (res?.message) this.toastr.success(res.message);
        return res;
      }),
      catchError(error => this.handleError(error))
    );
  }

  put<T>(endpoint: string, data: any): Observable<T> {
    return this.http.put<T>(`${this.baseUrl}/${endpoint}`, data).pipe(
      map((res: any) => {
        if (res?.message) this.toastr.success(res.message);
        return res;
      }),
      catchError(error => this.handleError(error))
    );
  }

  delete<T>(endpoint: string): Observable<T> {
    return this.http.delete<T>(`${this.baseUrl}/${endpoint}`).pipe(
      map((res: any) => {
        if (res?.message) this.toastr.success(res.message);
        return res;
      }),
      catchError(error => this.handleError(error))
    );
  }

  private handleError(error: any): Observable<never> {
    const message = error?.error?.message || 'Something went wrong!';
    this.toastr.error(message);
    return throwError(() => error);
  }
}
