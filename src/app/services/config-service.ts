import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class ConfigService {
  private apiUrl = 'http://127.0.0.1:8000/api/contacts/';


  constructor(private http: HttpClient) { }

  getContacts(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  createContact(contact: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, contact);
  }

  updateContact(contact: any): Observable<any> {
    const url = `${this.apiUrl}${contact.id}/`;
    return this.http.put<any>(url, contact);
  }

  deleteContact(id: number): Observable<any> {
    const url = `${this.apiUrl}${id}/`;
    return this.http.delete<any>(url);
  }
}