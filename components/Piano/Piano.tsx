import React from "react";
import "./piano.styles.scss";
import { Socket } from "socket.io-client";
import { noteNames } from "@/utils/pianoNotes";
import { INote } from "@/types/global.types";

interface IPiano {
  playedNotes: INote[];
  showLabel: boolean;
  socket: Socket;
}

const Piano = ({ playedNotes, showLabel = false }: IPiano) => {
  const renderKeys = (color: "white" | "black") => {
    const keys = [];
    let skipKey = 1;
    let gapSwitcher = false;
    let notesLoopCount = 0;

    for (let i = 0; i < 52; i++) {
      const noteName = noteNames[i % noteNames.length];

      if (noteName === "C") notesLoopCount++;

      const blackNoteLabel = `${noteName}# ${notesLoopCount}`;
      const whiteNoteLabel = `${noteName}${notesLoopCount}`;

      if (color === "black") {
        let isEmpty = false;

        if (skipKey === i || i === 51) {
          isEmpty = true;
          gapSwitcher = !gapSwitcher;
          skipKey = gapSwitcher ? i + 3 : i + 4;
        }

        keys.push(
          <div key={i} className={`key black ${isEmpty && "is-empty"} `}>
            <span
              className={`note black ${
                playedNotes.find(
                  ({ note }) => note === blackNoteLabel.split(" ").join("")
                ) && "pressed"
              }`}
            >
              {showLabel ? blackNoteLabel : ""}
            </span>
          </div>
        );
      } else {
        keys.push(
          <div key={i} className={`key white `}>
            <span
              className={`note white ${
                playedNotes.find(({ note }) => note === whiteNoteLabel) &&
                "pressed"
              }`}
            >
              {showLabel ? whiteNoteLabel : ""}
            </span>
          </div>
        );
      }
    }

    return keys;
  };

  return (
    <div className="piano">
      <div className="keys-container">
        <div className="white-keys-container">{renderKeys("white")}</div>
        <div className="black-keys-container">{renderKeys("black")}</div>
      </div>
    </div>
  );
};

export default Piano;
