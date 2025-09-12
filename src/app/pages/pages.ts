import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { interval, Subscription } from 'rxjs';
import { SensorData } from '../interfaces/SensorData';
import { Esp32Service } from '../services/led';
@Component({
  selector: 'app-pages',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pages.html',
  styleUrls: ['./pages.css']
})
export class PagesComponent implements OnInit, OnDestroy {
  sensorData: SensorData = {
    light: 0,
    temperature: 0,
    humidity: 0,
    status: 'OFF',
    timestamp: '',
    led1State: false,
    led2State: false,
    led3State: false,
    lightThreshold: 2000,
    tempThreshold: 28.0
  };

  led3Status: 'ON' | 'OFF' = 'OFF';
  isLoading = false;
  isConnected = false;
  errorMessage = '';
  successMessage = '';
  newTempThreshold = 28.0;
  newLightThreshold = 2000;

  private subscription?: Subscription;

  constructor(private esp32: Esp32Service) {}

  ngOnInit() {
    this.refreshData();
    this.subscription = interval(2000).subscribe(() => {
      if (!this.isLoading) this.refreshData();
    });
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

  refreshData() {
    this.esp32.getSensors().subscribe({
      next: (data) => {
        this.sensorData = { ...data };
        this.led3Status = data.status as 'ON' | 'OFF';
        if (data.tempThreshold) this.newTempThreshold = data.tempThreshold;
        if (data.lightThreshold) this.newLightThreshold = data.lightThreshold;
        this.isConnected = true;
        this.clearMessages();
      },
      error: () => {
        this.isConnected = false;
        this.errorMessage = `❌ No se pudo conectar al ESP32.\n
        Verifica:\n- Que esté encendido\n- Que la IP sea correcta\n- Que estés en la misma red WiFi`;
      }
    });
  }

  toggleLed() {
    if (this.isLoading) return;
    this.isLoading = true;
    this.clearMessages();

    const newState = this.led3Status === 'ON' ? 'off' : 'on';

    this.esp32.toggleLed(newState).subscribe({
      next: (response: any) => {
        if (response.success) {
          this.led3Status = response.status;
          this.sensorData.led3State = response.status === 'ON';
          this.successMessage = `LED3 ${response.status === 'ON' ? 'encendido' : 'apagado'} correctamente`;
        }
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = '❌ Error al cambiar el estado del LED3';
        this.isLoading = false;
      }
    });
  }

  updateThresholds() {
    this.clearMessages();
    this.esp32.setThresholds(this.newTempThreshold, this.newLightThreshold).subscribe({
      next: (res) => {
        if (res.success) {
          this.successMessage = '✅ Umbrales actualizados correctamente';
        }
      },
      error: () => {
        this.errorMessage = '❌ Error al actualizar los umbrales';
      }
    });
  }

  clearMessages() {
    this.errorMessage = '';
    this.successMessage = '';
  }

  // Helpers para el HTML
  getTempPercentage() {
    return (this.sensorData.temperature / (this.sensorData.tempThreshold || this.newTempThreshold)) * 100;
  }

  getLightPercentage() {
    return (this.sensorData.light / (this.sensorData.lightThreshold || this.newLightThreshold)) * 100;
  }

  getHumidityLevel() {
    if (this.sensorData.humidity < 30) return 'Baja';
    if (this.sensorData.humidity < 60) return 'Óptima';
    return 'Alta';
  }

  getTempLevel() {
    if (this.sensorData.temperature < 18) return 'Frío';
    if (this.sensorData.temperature < 28) return 'Confortable';
    return 'Calor';
  }

  getLightLevel() {
    if (this.sensorData.light < 1000) return 'Oscuro';
    if (this.sensorData.light < 2500) return 'Medio';
    return 'Brillante';
  }

  getActiveLedCount() {
    return [this.sensorData.led1State, this.sensorData.led2State, this.sensorData.led3State].filter(v => v).length;
  }

  getTimeSinceLastUpdate() {
    if (!this.sensorData.timestamp) return 0;
    return Math.floor((Date.now() - new Date(this.sensorData.timestamp).getTime()) / 1000);
  }

  getDebugInfo() {
    return JSON.stringify(this.sensorData, null, 2);
  }
}
