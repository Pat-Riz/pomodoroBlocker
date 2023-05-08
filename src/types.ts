export interface BaseMessage {
  target: "offscreen" | "timer";
}

export interface StartMessage extends BaseMessage {
  action: "start";
}

export interface StopMessage extends BaseMessage {
  action: "stop";
}

export interface RestartMessage extends BaseMessage {
  action: "restart";
}

export interface GetCurrentStatusMessage extends BaseMessage {
  action: "getCurrentStatus";
}

export interface GetCurrentStatusMessage extends BaseMessage {
  action: "getCurrentStatus";
}

export interface GetCurrentStatusResponse extends BaseMessage {
  focusTime: number;
  breakTime: number;
  isTimerRunning: boolean;
  isFocusTime: boolean;
  remainingTime: number;
  blockedSites: string[];
  timeRemaining: number | string;
}

export interface UpdateSettings extends BaseMessage {
  action: "updateSettings";
  focusTime: number;
  breakTime: number;
  autoPlayFocus: boolean;
  autoPlayBreaks: boolean;
  blockedSites: string[];
}

export type TimerMessage =
  | StartMessage
  | StopMessage
  | RestartMessage
  | GetCurrentStatusMessage
  | UpdateSettings;

export interface OffscreenMessage extends BaseMessage {
  action: "playSound";
  volume: number;
  source: string;
}
