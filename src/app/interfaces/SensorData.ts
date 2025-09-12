export interface SensorData {
  light: number;
  temperature: number;
  humidity: number;
  status: string;
  timestamp: string;
  led1State: boolean;
  led2State: boolean;
  led3State: boolean;
  lightThreshold?: number;
  tempThreshold?: number;
}
