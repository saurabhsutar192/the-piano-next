import { pianoNotes } from "@/utils/pianoNotes";
//@ts-ignore
import useSound from "use-sound";

export const usePianoSound = () => {
  const notesPlay: Record<string, [() => void, Record<string, () => void>]> =
    {};
  pianoNotes.forEach((note) => {
    notesPlay[note] = useSound(
      `assets/piano-sounds/${note.replace("#", "S")}.wav`
    );
  });

  return notesPlay;
};
