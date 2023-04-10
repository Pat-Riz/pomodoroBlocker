export interface StartMessage {
  action: "start";
  workIntervalMinutes: number;
  breakIntervalMinutes: number;
  blockedWebsites: string[];
}

export interface StopMessage {
  action: "stop";
}

export interface GetRemainingTimeMessage {
  action: "getRemainingTime";
}

export type TimerMessage = StartMessage | StopMessage | GetRemainingTimeMessage;
