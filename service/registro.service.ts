import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RegistroService {

  private api = "http://localhost:3000/api/auth";

  constructor(private http: HttpClient) {}

  registro(data: any) {
    return this.http.post(`${this.api}/registro`, data);
  }
}
