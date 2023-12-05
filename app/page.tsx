"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import "./page.scss";
import { WebMidi } from "webmidi";
import _ from "lodash";
import Piano from "../components/Piano/Piano";
import { Flex, Label, Select } from "@hover-design/react";
import Switch from "../components/Switch/Switch";
import { io } from "socket.io-client";
import { Socket } from "socket.io-client";
import { usePianoSound } from "@/hooks/usePianoSound";
import { pianoNotes } from "@/utils/pianoNotes";
import { INote, NoteEvent } from "@/types/global.types";

interface IOptions {
  label: string;
  value: string;
}

let socket: Socket;

export default function Home() {
  const [midiOptions, setMidiOptions] = useState<IOptions[]>([]);
  const [selectedMidiOption, setSelecteMidiOption] = useState<IOptions>({
    label: "",
    value: "",
  });
  const [playedNotes, setPlayedNotes] = useState<INote[]>([]);
  const [showLabel, setShowLabel] = useState(false);
  const [isReceiveMode, setIsReceiveMode] = useState(false);
  const [isMute, setIsMute] = useState(false);
  const [isSustain, setIsSustain] = useState(false);
  const [liftedNotes, setLiftedNotes] = useState<string[]>(pianoNotes);

  const notesPlay = usePianoSound();

  const myInput = useMemo(() => {
    return selectedMidiOption?.value
      ? WebMidi.getInputByName(selectedMidiOption.value)
      : null;
  }, [selectedMidiOption]);

  const inputRef = useRef(selectedMidiOption?.value);

  useEffect(() => {
    WebMidi.enable()
      .then(() => {
        console.log("WebMidi enabled!");

        const midiOptionsData: IOptions[] = [];

        WebMidi.inputs.forEach((input) =>
          midiOptionsData.push({ label: input.name, value: input.name })
        );
        setMidiOptions(midiOptionsData);
      })
      .catch((err) => console.log(err));
  }, []);

  const initializeSocket = async () => {
    socket = io("http://localhost:4000");
  };

  useEffect(() => {
    initializeSocket();
    if (isReceiveMode) {
      socket.on("receive-played-notes", (message: { playedNotes: INote[] }) => {
        setPlayedNotes(message?.playedNotes);
      });
      socket.on(
        "receive-lifted-notes",
        (message: { liftedNotes: string[] }) => {
          setLiftedNotes(message?.liftedNotes);
        }
      );
      socket.emit("request-sustain-toggle");

      socket.on("receive-sustain-toggle", (message: { isSustain: boolean }) => {
        setIsSustain(message?.isSustain);
      });
    } else {
      socket.on("ask-sustain-toggle", () => {
        socket.emit("send-sustain-toggle", {
          isSustain,
        });
      });
    }

    return () => {
      socket.disconnect();
    };
  }, [isReceiveMode, isSustain]);

  useEffect(() => {
    if (inputRef.current !== myInput?.name) {
      inputRef.current &&
        WebMidi.getInputByName(inputRef.current)?.removeListener("noteon");

      inputRef.current &&
        WebMidi.getInputByName(inputRef.current)?.removeListener("noteoff");
      inputRef.current = myInput?.name || "";
    }

    !isReceiveMode
      ? myInput?.addListener("noteon", (e: NoteEvent) => {
          setLiftedNotes((prev) => {
            const notes = prev.filter((notes) => notes !== e.note.identifier);
            socket.emit("send-lifted-notes", {
              liftedNotes: notes,
            });
            return notes;
          });
          setPlayedNotes((prev) => {
            const notes = _.uniq([
              ...prev,
              { note: e.note.identifier, velocity: e.rawVelocity as number },
            ]);
            socket.emit("send-played-notes", {
              playedNotes: notes,
            });
            playNoteAudio(notes);
            return notes;
          });
        })
      : myInput?.removeListener("noteon");

    !isReceiveMode
      ? myInput?.addListener("noteoff", (e) => {
          setLiftedNotes((prev) => {
            const notes = _.uniq([...prev, e.note.identifier]);
            socket.emit("send-lifted-notes", {
              liftedNotes: notes,
            });
            stopNoteAudio(notes);
            return notes;
          });
          setPlayedNotes((prev) => {
            const notes = prev.filter(
              (notes) => notes.note !== e.note.identifier
            );
            socket.emit("send-played-notes", {
              playedNotes: notes,
            });
            return notes;
          });
        })
      : myInput?.removeListener("noteoff");

    return () => {
      myInput?.removeListener("noteon");

      myInput?.removeListener("noteoff");
    };
  }, [myInput, isReceiveMode, liftedNotes, isMute, isSustain]);

  useEffect(() => {
    isReceiveMode && playNoteAudio(playedNotes);
  }, [isReceiveMode, playedNotes, liftedNotes]);

  useEffect(() => {
    isReceiveMode && stopNoteAudio(liftedNotes);
  }, [isReceiveMode, liftedNotes, isSustain]);

  const playNoteAudio = (playNotes: INote[]) => {
    if (!isMute) {
      playNotes.forEach((note) => {
        const [, { sound }] = notesPlay[note.note];
        liftedNotes.some((liftNote) => liftNote === note.note) &&
          sound.volume(convertVelocityToVolume(note.velocity)).play();
      });
    }
  };

  const stopNoteAudio = (stopNotes: string[]) => {
    if (!isSustain) {
      stopNotes.forEach((note) => {
        const [, { sound }] = notesPlay[note];
        sound.fade(sound.volume(), 0, 300);
      });
    }
  };

  const convertVelocityToVolume = (velocity: number) => {
    return (velocity / 100) * 0.3;
  };

  return (
    <Flex className={"main"} alignItems="center">
      <Flex
        flexDirection="column"
        justifyContent="center"
        className="piano-container"
      >
        <h1>THE PIANO</h1>
        <Flex
          className="piano-controls-container"
          alignItems="center"
          justifyContent="flex-end"
        >
          <Flex className="piano-controls" flexBasis="30%" gap="20px">
            <Switch
              value={isReceiveMode}
              setValue={setIsReceiveMode}
              label="Broadcast > Recieve"
              alignItems="flex-end"
            />
            <Switch
              value={isMute}
              setValue={setIsMute}
              label="Mute"
              alignItems="center"
            />
            <Switch
              value={isSustain}
              setValue={(value) => {
                setIsSustain(value);
                socket.emit("send-sustain-toggle", {
                  isSustain: value,
                });
              }}
              label="Sustain"
              alignItems="center"
              isDisabled={isReceiveMode}
            />

            <Flex
              className="midi-selector"
              flexDirection="column"
              alignItems="center"
              gap="7px"
            >
              <Label htmlFor="midi-selector">Select MIDI Input</Label>
              <Select
                borderRadius="20px"
                color="#6c584c"
                id="midi-selector"
                options={midiOptions}
                isDisabled={isReceiveMode}
                onChange={(value) => {
                  setSelecteMidiOption(value as IOptions);
                }}
                value={selectedMidiOption}
                isClearable
              />
            </Flex>
            <Switch
              value={showLabel}
              setValue={setShowLabel}
              label="Show Notes"
            />
          </Flex>
        </Flex>
        <Piano
          playedNotes={playedNotes}
          showLabel={showLabel}
          socket={socket}
        />
      </Flex>
    </Flex>
  );
}
