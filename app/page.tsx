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
  const [playedNotes, setPlayedNotes] = useState<string[]>([]);
  const [showLabel, setShowLabel] = useState(false);
  const [isReceiveMode, setIsReceiveMode] = useState(false);
  const [isMute, setIsMute] = useState(false);
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
      socket.on(
        "receive-played-notes",
        (message: { playedNotes: string[] }) => {
          setPlayedNotes(message?.playedNotes);
        }
      );
      socket.on(
        "receive-lifted-notes",
        (message: { liftedNotes: string[] }) => {
          setLiftedNotes(message?.liftedNotes);
        }
      );
    }
    return () => {
      socket.disconnect();
    };
  }, [isReceiveMode]);

  useEffect(() => {
    if (inputRef.current !== myInput?.name) {
      inputRef.current &&
        WebMidi.getInputByName(inputRef.current)?.removeListener("noteon");

      inputRef.current &&
        WebMidi.getInputByName(inputRef.current)?.removeListener("noteoff");
      inputRef.current = myInput?.name || "";
    }

    !isReceiveMode
      ? myInput?.addListener("noteon", (e) => {
          setLiftedNotes((prev) => {
            const notes = prev.filter((notes) => notes !== e.note.identifier);
            socket.emit("send-lifted-notes", {
              liftedNotes: notes,
            });
            return notes;
          });
          setPlayedNotes((prev) => {
            const notes = _.uniq([...prev, e.note.identifier]);
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
            return notes;
          });
          setPlayedNotes((prev) => {
            const notes = prev.filter((notes) => notes !== e.note.identifier);
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
  }, [myInput, isReceiveMode, liftedNotes, isMute]);

  useEffect(() => {
    isReceiveMode && playNoteAudio(playedNotes);
  }, [isReceiveMode, playedNotes, liftedNotes]);

  const playNoteAudio = (playNotes: string[]) => {
    if (!isMute) {
      playNotes.forEach((note) => {
        const [play] = notesPlay[note];
        liftedNotes.some((liftNote) => liftNote === note) && play();
      });
    }
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
          playedNotes={
            // !isReceiveMode ?
            playedNotes
            // : receivedNotes
          }
          showLabel={showLabel}
          socket={socket}
        />
      </Flex>
    </Flex>
  );
}
