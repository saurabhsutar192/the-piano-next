export const noteNames = ["A", "B", "C", "D", "E", "F", "G"];

export const pianoNotes = noteNames
  .map((note) => {
    const noteSet = [];
    for (let i = 0; i <= 8; i++) {
      if (i < 8) {
        if (i === 0) {
          if (note === "A" || note === "B") {
            noteSet.push(`${note}${i}`);
            if (note !== "B") {
              noteSet.push(`${note}#${i}`);
            }
          }
        } else {
          noteSet.push(`${note}${i}`);
          if (!(note === "E" || note === "B")) {
            noteSet.push(`${note}#${i}`);
          }
        }
      } else if (i === 8 && note === "C") {
        noteSet.push(`${note}${i}`);
      }
    }
    return noteSet;
  })
  .join()
  .split(",");

export const keyboardNoteMap = {
  a: "C4",
  w: "C#4",
  s: "D4",
  e: "D#4",
  d: "E4",
  f: "F4",
  t: "F#4",
  g: "G4",
  y: "G#4",
  h: "A4",
  u: "A#4",
  j: "B4",
  k: "C5",
  o: "C#5",
  l: "D5",
  p: "D#5",
  ";": "E5",
  "'": "F5",
  "]": "F#5",
};

export const convertVelocityToVolume = (velocity: number) => {
  return 0.1 * Math.pow(velocity / 100, 1.7);
};

export const pianoSizes = [25, 49, 61, 88].map((size) => ({
  label: String(size),
  value: String(size),
}));

export const whiteKeyMap = {
  "88": { whiteKeys: 52, octave: 0 },
  "61": { whiteKeys: 36, octave: 1 },
  "49": { whiteKeys: 29, octave: 2 },
  "25": { whiteKeys: 15, octave: 3 },
};
