"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import "./page.scss";
import { WebMidi } from "webmidi";
import _ from "lodash";
import Piano from "@/components/Piano/Piano";
import { Flex, Label, Select, Switch } from "@hover-design/react";

interface IOptions {
  label: string;
  value: string;
}
export default function Home() {
  const [midiOptions, setMidiOptions] = useState<IOptions[]>([]);
  const [selectedMidiOption, setSelecteMidiOption] = useState<IOptions>({
    label: "",
    value: "",
  });
  const [playedNotes, setPlayedNotes] = useState<string[]>([]);
  const [showLabel, setShowLabel] = useState(false);

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
      setPlayedNotes((prev) => _.uniq([...prev, e.note.identifier]));
    });

    myInput?.addListener("noteoff", (e) => {
      setPlayedNotes((prev) =>
        prev.filter((notes) => notes !== e.note.identifier)
      );
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
            <Flex
              className="control label-switch"
              flexDirection="column"
              alignItems="flex-end"
              flexGrow={2}
              gap="13px"
            >
              <Label htmlFor="label-switch">Show Notes</Label>
              <Switch
                id="label-switch"
                status={showLabel}
                onChange={(value) => setShowLabel(value as boolean)}
              />
            </Flex>
            <Flex
              className="control midi-selector"
              flexDirection="column"
              flexGrow={5}
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
          </Flex>
        </Flex>
        <Piano playedNotes={playedNotes} showLabel={showLabel} />
      </Flex>
    </Flex>
  );
}
