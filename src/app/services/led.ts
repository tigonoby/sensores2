import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SensorData } from '../interfaces/SensorData';
import { environment } from '../../environments/environment.development';

@Injectable({ providedIn: 'root' })
export class Esp32Service {
  private baseUrl = `${environment.esp32Url}/api`;

  constructor(private http: HttpClient) {}

  getSensors(): Observable<SensorData> {
    return this.http.get<SensorData>(`${this.baseUrl}/sensors`);
  }

  toggleLed(newState: 'on' | 'off'): Observable<any> {
    return this.http.post(`${this.baseUrl}/led3`, { estado: newState });
  }

  setThresholds(temp: number, light: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/thresholds`, { tempThreshold: temp, lightThreshold: light });
  }
}
