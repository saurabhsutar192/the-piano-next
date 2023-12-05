import { NoteMessageEvent } from "webmidi";
export interface INote {
  note: string;
  velocity: number;
}

export interface NoteEvent extends NoteMessageEvent {
  rawVelocity?: number;
}
