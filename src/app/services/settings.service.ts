import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import { SettingsResponse } from "../interfaces/settings.interface";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  private http = inject(HttpClient);

  getSettings(): Observable<SettingsResponse> {
    return this.http.get<SettingsResponse>(`${environment.apiUrl}sitesettings/get`);
  }
}