
export enum ModulationType {
  AM = 'AM',
  FM = 'FM',
  PM = 'PM',
  ASK = 'ASK',
  FSK = 'FSK',
  PSK = 'PSK',
}

export enum WaveformShape {
  SINE = 'Sinusoidal',
  SQUARE = 'Digital/Square',
}

export enum FrequencyUnit {
  HZ = 'Hz',
  KHZ = 'KHz',
  MHZ = 'MHz',
}

export enum TimeUnit {
    S = 's',
    MS = 'ms',
    US = 'µs',
}

export interface WaveformPoint {
  time: number;
  amplitude: number;
}
