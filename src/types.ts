export interface StartMessage {
  action: "start";
}

export interface StopMessage {
  action: "stop";
}

export interface GetCurrentStatusMessage {
  action: "getCurrentStatus";
}

export interface GetCurrentStatusMessage {
  action: "getCurrentStatus";
}

export interface GetCurrentStatusResponse {
  focusTime: number;
  breakTime: number;
  isTimerRunning: boolean;
  blockedSites: string[];
  timeRemaining: number | string;
}

export interface UpdateSettings {
  action: "updateSettings";
  focusTime: number;
  breakTime: number;
  blockedSites: string[];
}

export type TimerMessage =
  | StartMessage
  | StopMessage
  | GetCurrentStatusMessage
  | UpdateSettings;
