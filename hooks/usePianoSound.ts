import { pianoNotes } from "@/utils/pianoNotes";
//@ts-ignore
import useSound from "use-sound";

export const usePianoSound = () => {
  const notesPlay: Record<
    string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [() => void, { sound: Record<string, any> }]
  > = {};
  pianoNotes.forEach((note) => {
    notesPlay[note] = useSound(
      `assets/piano-sounds/${note.replace("#", "S")}.wav`,
      { volume: 0.3 }
    );
  });

  return notesPlay;
};
