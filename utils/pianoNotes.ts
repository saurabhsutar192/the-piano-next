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
