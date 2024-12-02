"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { WebMidi } from "webmidi";
import _ from "lodash";
import Piano from "../components/Piano/Piano";
import { Flex, Label, Loader, Select } from "@hover-design/react";
import Switch from "../components/Switch/Switch";
// import { Socket, io } from "socket.io-client";
import { usePianoSound } from "@/hooks/usePianoSound";
import {
  convertVelocityToVolume,
  keyboardNoteMap,
  pianoNotes,
  pianoSizes,
} from "@/utils/utils";
import { INote, NoteEvent } from "@/types/global.types";
// import { Button } from "@/components/Button/Button";
import {
  // toast,
  Toaster,
} from "react-hot-toast";
import variables from "@/theme/colors.module.scss";
import { montserratSub } from "./fonts";
import { Footer } from "@/components/Footer/Footer";

// Comments out the broadcast feature temporarily

interface IOptions {
  label: string;
  value: string;
}

// let socket: Socket | null;

export default function Home() {
  const [midiOptions, setMidiOptions] = useState<IOptions[]>([]);
  const [selectedMidiOption, setSelecteMidiOption] = useState<IOptions>({
    label: "",
    value: "",
  });
  const [playedNotes, setPlayedNotes] = useState<INote[]>([]);
  const [showLabel, setShowLabel] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isReceiveMode, setIsReceiveMode] = useState(false);
  // const [isBroadcastMode, setIsBroadcastMode] = useState(false);
  const [isMute, setIsMute] = useState(false);
  const [isSustain, setIsSustain] = useState(false);
  // const [showConnectionIdInput, setShowConnectionIdInput] = useState(false);
  const [liftedNotes, setLiftedNotes] = useState<string[]>(pianoNotes);
  // const [connectionId, setConnectionId] = useState("");
  // const [inputId, setInputId] = useState("");
  const [pianoSize, setPianoSize] = useState<IOptions>({
    label: localStorage.getItem("pianoKeys") || "88",
    value: localStorage.getItem("pianoKeys") || "88",
  });
  // const [isBroadcastLoading, setIsBroadcastLoading] = useState(false);
  // const [isReceiveLoading, setIsReceiveLoading] = useState(false);

  const [isSoundLoading, setIsSoundLoading] = useState(true);

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

    // return () => {
    //   disconnectSocket();
    // };
  }, []);

  // const joinRoom = () => {
  //   socket?.emit(
  //     "join-room",
  //     { room: `p-${socket?.id}`, isBroadcaster: true },
  //     (room: string, errMsg: string) => {
  //       if (!errMsg) {
  //         setIsBroadcastMode(true);
  //         setConnectionId(room);
  //         toast.success("Broadcast Started Successfully");
  //       } else {
  //         toast.error(errMsg);
  //         disconnectSocket();
  //       }
  //     }
  //   );
  // };

  // const initializeSocket = async (isBroadcast = false) => {
  //   if (socket?.id) disconnectSocket();
  //   socket = io(process.env.NEXT_PUBLIC_SOCKET || "wa", {
  //     reconnection: false,
  //   });
  //   socket?.on("connect", () => {
  //     if (isBroadcast) {
  //       joinRoom();
  //     } else setShowConnectionIdInput(true);
  //     // setIsBroadcastLoading(false);
  //     // setIsReceiveLoading(false);
  //   });
  //   socket?.on("connect_error", () => {
  //     toast.error("Something Went Wrong!");
  //     // setIsBroadcastLoading(false);
  //     // setIsReceiveLoading(false);
  //   });
  // };

  // const broadcastData = () => {
  //   setIsBroadcastLoading(true);
  //   setIsReceiveMode(false);
  //   setShowConnectionIdInput(false);
  //   initializeSocket(true);
  // };

  // const disconnectSocket = () => {
  //   socket?.disconnect();
  // };

  // const disconnectBroadcast = () => {
  //   setIsBroadcastMode(false);
  //   disconnectSocket();
  // };

  // const disconnectReceive = () => {
  //   setIsReceiveMode(false);
  //   setShowConnectionIdInput(false);
  //   setInputId("");
  //   setConnectionId("");
  //   disconnectSocket();
  // };

  // const recieveSocketData = (room: string) => {
  //   if (!socket) return;
  //   socket.on("receive-played-notes", (message: { playedNotes: INote[] }) => {
  //     setPlayedNotes(message?.playedNotes);
  //   });
  //   socket.on("receive-lifted-notes", (message: { liftedNotes: string[] }) => {
  //     setLiftedNotes(message?.liftedNotes);
  //   });
  //   socket.emit("request-sustain-toggle", room);
  //   socket.on("receive-sustain-toggle", (message: { isSustain: boolean }) => {
  //     setIsSustain(message?.isSustain);
  //   });
  //   socket.on("receive-disconnect-broadcast", () => {
  //     toast.error("Broadcaster Disconnected!");
  //     initializeSocket();
  //     setIsReceiveMode(false);
  //     setInputId("");
  //   });
  // };

  // const openRecievingInput = () => {
  //   initializeSocket();
  //   setConnectionId("");
  //   setInputId("");
  //   setShowConnectionIdInput(true);
  //   setIsBroadcastMode(false);
  // };

  // const copyConnectionId = () => {
  //   navigator.clipboard
  //     .writeText(connectionId)
  //     .then(() => {
  //       toast.success("Connection ID copied to clipboard");
  //     })
  //     .catch((err) => {
  //       toast.error("Error copying text to clipboard:", err);
  //     });
  // };

  // const pasteConnectionId = () => {
  //   navigator.clipboard.readText().then((res) => {
  //     setInputId(res);
  //   });
  // };

  // const connectToId: FormEventHandler<HTMLFormElement> = (e) => {
  //   e.preventDefault();
  //   if (inputId === connectionId) {
  //     toast.success("Already connected to the broadcaster!");
  //   } else {
  //     // setIsReceiveLoading(true);
  //     socket?.emit(
  //       "join-room",
  //       { room: inputId, isBroadcaster: false },
  //       (room: string, errMsg: string) => {
  //         if (!errMsg) {
  //           setIsReceiveMode(true);
  //           setIsBroadcastMode(false);
  //           setConnectionId(room);
  //           recieveSocketData(room);
  //           toast.success(`Connected To Broadcaster Successfully`);
  //         } else {
  //           toast.error(errMsg);
  //         }
  //         // setIsReceiveLoading(false);
  //       }
  //     );
  //   }
  // };

  // useEffect(() => {
  //   socket?.on("ask-sustain-toggle", () => {
  //     socket?.emit(
  //       "send-sustain-toggle",
  //       {
  //         isSustain,
  //       },
  //       connectionId
  //     );
  //   });
  // }, [socket, isSustain, isBroadcastMode]);

  const handleNotePlay = (note: string, velocity = 100) => {
    setLiftedNotes((prev) => {
      const notes = prev.filter((notes) => notes !== note);
      // isBroadcastMode &&
      //   socket?.emit(
      //     "send-lifted-notes",
      //     {
      //       liftedNotes: notes,
      //     },
      //     connectionId
      //   );
      return notes;
    });
    setPlayedNotes((prev) => {
      const notes = _.uniq([
        ...prev,
        { note: note, velocity: velocity as number },
      ]);
      // isBroadcastMode &&
      //   socket?.emit(
      //     "send-played-notes",
      //     {
      //       playedNotes: notes,
      //     },
      //     connectionId
      //   );
      playNoteAudio(notes);
      return notes;
    });
  };

  const handleNoteLift = (note: string) => {
    setLiftedNotes((prev) => {
      const notes = _.uniq([...prev, note]);
      // isBroadcastMode &&
      //   socket?.emit(
      //     "send-lifted-notes",
      //     {
      //       liftedNotes: notes,
      //     },
      //     connectionId
      //   );
      stopNoteAudio(notes);
      return notes;
    });
    setPlayedNotes((prev) => {
      const notes = prev.filter((notes) => notes.note !== note);
      // isBroadcastMode &&
      //   socket?.emit(
      //     "send-played-notes",
      //     {
      //       playedNotes: notes,
      //     },
      //     connectionId
      //   );
      return notes;
    });
  };

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
          handleNotePlay(e.note.identifier, e.rawVelocity);
        })
      : myInput?.removeListener("noteon");

    !isReceiveMode
      ? myInput?.addListener("noteoff", (e) => {
          handleNoteLift(e.note.identifier);
        })
      : myInput?.removeListener("noteoff");

    return () => {
      myInput?.removeListener("noteon");

      myInput?.removeListener("noteoff");
    };
  }, [
    myInput,
    isReceiveMode,
    // isBroadcastMode,
    liftedNotes,
    isMute,
    isSustain,
  ]);

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

  const handleKeyDown = (e: globalThis.KeyboardEvent) => {
    Object.keys(keyboardNoteMap).forEach((note) => {
      if (e.key === note)
        handleNotePlay(keyboardNoteMap[note as keyof typeof keyboardNoteMap]);
    });
  };

  const handleKeyUp = (e: globalThis.KeyboardEvent) => {
    Object.keys(keyboardNoteMap).forEach((note) => {
      if (e.key === note)
        handleNoteLift(keyboardNoteMap[note as keyof typeof keyboardNoteMap]);
    });
  };

  useEffect(() => {
    document.body.addEventListener("keydown", handleKeyDown);
    document.body.addEventListener("keyup", handleKeyUp);

    return () => {
      document.body.removeEventListener("keydown", handleKeyDown);
      document.body.removeEventListener("keyup", handleKeyUp);
    };
  }, [notesPlay]);

  useEffect(() => {
    pianoNotes.forEach((note) => {
      setIsSoundLoading(!notesPlay[note][1].sound);
    });
  }, [notesPlay]);

  if (isSoundLoading) {
    return (
      <Flex
        alignItems="center"
        flexDirection="column"
        gap="10px"
        className="loader-container"
      >
        <Loader
          size={40}
          color={variables.accentColorDark}
          className="loader"
        />
        <p>Loading Sounds...</p>
      </Flex>
    );
  }

  return (
    <>
      <Flex
        flexDirection="column"
        className="piano-container"
        alignItems="center"
      >
        <h1 className={montserratSub.className}>THE PIANO</h1>
        <Flex className="piano-controls-container" justifyContent="center">
          <Flex
            className="piano-controls"
            flexWrap={"wrap"}
            justifyContent="center"
            gap="20px"
          >
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
                // isBroadcastMode &&
                //   socket?.emit(
                //     "send-sustain-toggle",
                //     {
                //       isSustain: value,
                //     },
                //     connectionId
                //   );
              }}
              label="Sustain"
              alignItems="center"
              isDisabled={isReceiveMode}
            />
            <Switch value={showLabel} setValue={setShowLabel} label="Notes" />
            <Flex
              className="selector piano-size"
              flexDirection="column"
              gap="7px"
            >
              <Label htmlFor="piano-size-selector">Keys</Label>
              <Select
                placeholder="Size"
                borderRadius="20px"
                color={variables.accentColorDark}
                id="piano-size-selector"
                options={pianoSizes}
                onChange={(value) => {
                  value && setPianoSize(value as IOptions);
                  localStorage.setItem("pianoKeys", (value as IOptions).value);
                }}
                value={pianoSize}
              />
            </Flex>
            <Flex className="selector midi" flexDirection="column" gap="7px">
              <Label htmlFor="midi-selector">Select MIDI Input</Label>
              <Select
                placeholder="Select MIDI Input"
                borderRadius="20px"
                color={variables.accentColorDark}
                id="midi-selector"
                options={midiOptions}
                isDisabled={isReceiveMode}
                onChange={(value) => {
                  setSelecteMidiOption(value as IOptions);
                }}
                value={selectedMidiOption}
                DropIcon={<div>x</div>}
                isClearable
              />
            </Flex>
          </Flex>
        </Flex>
        <Piano
          playedNotes={playedNotes}
          handleNotePlay={handleNotePlay}
          handleNoteLift={handleNoteLift}
          showLabel={showLabel}
          pianoSize={pianoSize.value}
        />
        <Flex
          className="streaming-controls-container"
          flexDirection="column"
          alignItems="center"
          gap="20px"
        >
          {/* <Flex
            className="streaming-controls"
            justifyContent="center"
            gap="20px"
          >
            <Button
              onClose={disconnectBroadcast}
              onClick={broadcastData}
              isActive={isBroadcastMode}
              isLoading={isBroadcastLoading}
            >
              Broadcast
            </Button>
            <Button
              onClose={disconnectReceive}
              onClick={openRecievingInput}
              isActive={isReceiveMode || showConnectionIdInput}
              isLoading={isReceiveLoading}
            >
              Recieve
            </Button>
          </Flex> */}
          {/* {showConnectionIdInput && (
            <form id="connection-form" onSubmit={connectToId}>
              <Flex
                className="connection-input-container"
                justifyContent="center"
                gap="20px"
              >
                <Input
                  className="connection-input"
                  placeholder="Enter a Connection ID"
                  crossOrigin={"anonymus"}
                  value={inputId}
                  onChange={(e) => setInputId(e.target.value)}
                />
                {inputId ? (
                  <Button
                    type="submit"
                    disabled={!inputId}
                    form="connection-form"
                  >
                    Connect
                  </Button>
                ) : (
                  <Button onClick={pasteConnectionId}>Paste</Button>
                )}
              </Flex>
            </form>
          )} */}
          {/* {(isBroadcastMode || isReceiveMode) && (
            <Flex className="connection-msg" alignItems="center" gap="10px">
              <p>
                <span>Connection Id :</span> {connectionId}
              </p>
              <Button className="copy-btn" onClick={copyConnectionId}>
                COPY
              </Button>
            </Flex>
          )} */}
        </Flex>
        <Footer />
      </Flex>
      <Toaster />
    </>
  );
}
