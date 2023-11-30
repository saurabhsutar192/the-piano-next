/* eslint-disable @typescript-eslint/no-explicit-any */
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
  const [toggleBroadcast, setToggleBroadcast] = useState(true);
  const [receivedNotes, setReceivedNotes] = useState<string[]>([]);

  useEffect(() => {
    initializeSocket();

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

    // Clean up the socket connection on unmount
    return () => {
      socket.disconnect();
    };
  }, []);

  const initializeSocket = async () => {
    socket = io("http://localhost:4000");

    socket.on("connection", () => {
      console.log("FE Connected");
    });

    // Listen for incoming messages
    socket.on("receive-message", (message: any) => {
      console.log("client", message);
      setReceivedNotes(message?.playedNotes);
    });
  };

  const myInput = useMemo(() => {
    return selectedMidiOption?.value
      ? WebMidi.getInputByName(selectedMidiOption.value)
      : null;
  }, [selectedMidiOption]);

  const inputRef = useRef(selectedMidiOption?.value);

  useEffect(() => {
    if (inputRef.current !== myInput?.name) {
      inputRef.current &&
        WebMidi.getInputByName(inputRef.current)?.removeListener("noteon");

      inputRef.current &&
        WebMidi.getInputByName(inputRef.current)?.removeListener("noteoff");
      inputRef.current = myInput?.name || "";
    }

    myInput?.addListener("noteon", (e) => {
      setPlayedNotes((prev) => {
        const notes = _.uniq([...prev, e.note.identifier]);
        socket.emit("send-message", {
          playedNotes: notes,
        });
        return notes;
      });
    });

    myInput?.addListener("noteoff", (e) => {
      setPlayedNotes((prev) => {
        const notes = prev.filter((notes) => notes !== e.note.identifier);
        socket.emit("send-message", {
          playedNotes: notes,
        });
        return notes;
      });
    });
  }, [myInput]);

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
              value={toggleBroadcast}
              setValue={setToggleBroadcast}
              label="Broadcast > Recieve"
              alignItems="flex-end"
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
          playedNotes={toggleBroadcast ? playedNotes : receivedNotes}
          showLabel={showLabel}
          socket={socket}
        />
      </Flex>
    </Flex>
  );
}
