import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { catchError, map, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private baseUrl = 'http://localhost:3000';

  constructor(private http: HttpClient, private toastr: ToastrService) { }


  /**
   * Perform HTTP GET request
   * @param API endpoint 
   * @param params 
   */
  public get<T>(endpoint: string, params?: HttpParams): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}/${endpoint}`, { params });
  }

  /**
   * Perform HTTP POST request
   * @param endpoint API endpoint
   * @param data Request body payload
   */
  public post<T>(endpoint: string, data: any): Observable<T> {
    return this.http.post<T>(`${this.baseUrl}/${endpoint}`, data).pipe(
      map((res: any) => {
        console.log(res?.message);

        if (res?.message) this.toastr.success(res.message);
        return res;
      }),
      catchError(error => this.handleError(error))
    );
  }


  /**
  * Perform HTTP PUT request
  * @param endpoint API endpoint
  * @param data Request body payload
  */
  public put<T>(endpoint: string, data: any): Observable<T> {
    return this.http.put<T>(`${this.baseUrl}/${endpoint}`, data).pipe(
      map((res: any) => {
        if (res?.message) this.toastr.success(res.message);
        return res;
      }),
      catchError(error => this.handleError(error))
    );
  }


  /**
  * Perform HTTP DELETE request
  * @param endpoint API endpoint
  */
  public delete<T>(endpoint: string): Observable<T> {
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
