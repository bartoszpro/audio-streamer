"use client";
import React, { useEffect, useState, useRef } from "react";
import useWebRTC from "../hooks/useWebRTC";
import useMediaDevices from "../hooks/useMediaDevices";
import useAudioFilter from "../hooks/useAudioFilter";
import CallControls from "./CallControls";
import DeviceSelector from "./DeviceSelector";
import MuteButton from "./MuteButton";
import AudioVisualizer from "./AudioVisualizer";
import FilterButton from "./FilterButton";

const AudioStream = () => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [otherUserId, setOtherUserId] = useState<string | null>(null);
  const [showSignalData, setShowSignalData] = useState(false);
  const [inputDeviceError, setInputDeviceError] = useState(false);
  const [outputDeviceError, setOutputDeviceError] = useState(false);
  const localAudioRef = useRef<HTMLAudioElement>(null);

  const {
    peer,
    signalData,
    userId,
    remoteAudioRef,
    initiateCall,
    handleSignalData,
  } = useWebRTC(stream, otherUserId);

  const {
    inputDevices,
    outputDevices,
    selectedInputDevice,
    selectedOutputDevice,
    handleInputDeviceChange,
    handleOutputDeviceChange,
  } = useMediaDevices();

  const { filterEnabled, toggleFilter, setGain, applyFilter } =
    useAudioFilter();

  useEffect(() => {
    if (selectedInputDevice) {
      getNewMediaStream(selectedInputDevice);
    }
  }, [selectedInputDevice]);

  const getNewMediaStream = (deviceId: string) => {
    navigator.mediaDevices
      .getUserMedia({ audio: { deviceId } })
      .then((mediaStream) => {
        if (localAudioRef.current) {
          localAudioRef.current.srcObject = mediaStream;
        }

        if (peer && stream) {
          const oldTrack = stream.getAudioTracks()[0];
          const newTrack = mediaStream.getAudioTracks()[0];
          peer.removeTrack(oldTrack, stream);
          peer.addTrack(newTrack, mediaStream);
        }

        if (filterEnabled) {
          applyFilter(mediaStream);
        }

        if (isMuted) {
          mediaStream.getAudioTracks().forEach((track) => {
            track.enabled = false;
          });
        }

        setStream(mediaStream);
      })
      .catch((error) => {
        console.error("Error accessing microphone", error);
      });
  };

  const toggleMute = () => {
    if (stream) {
      stream.getAudioTracks().forEach((track) => {
        track.enabled = !track.enabled;
      });
      setIsMuted(!isMuted);
      setGain(!isMuted ? 0 : 0.75);
    }
  };

  const handleInitiateCall = (isInitiator: boolean) => {
    if (!selectedInputDevice || !selectedOutputDevice) {
      setInputDeviceError(!selectedInputDevice);
      setOutputDeviceError(!selectedOutputDevice);
      return;
    }
    initiateCall(isInitiator);
    setShowSignalData(true);
  };

  return (
    <div className='audio-stream'>
      <div className='text-center'>
        <h3 className='mb-2'>Your User ID: {userId || "Fetching..."}</h3>
      </div>
      <div className='grid justify-items-center mb-14'>
        <h3>Your Audio</h3>
        {stream ? (
          <>
            <audio ref={localAudioRef} muted autoPlay />
            <AudioVisualizer mediaStream={stream} />
          </>
        ) : (
          <p>No input selected</p>
        )}
      </div>

      {peer && (
        <div className='grid justify-items-center'>
          <h3 className='mb-2'>
            Other User ID: {otherUserId || "Waiting for Other User..."}
          </h3>{" "}
          <h3>Other User Audio</h3>
          <audio ref={remoteAudioRef} autoPlay />
          {peer && (
            <AudioVisualizer
              mediaStream={remoteAudioRef.current?.srcObject as MediaStream}
            />
          )}
        </div>
      )}
      <CallControls
        initiateCall={handleInitiateCall}
        otherUserId={otherUserId}
        setOtherUserId={setOtherUserId}
        handleSignalData={handleSignalData}
        signalData={signalData}
        selectedInputDevice={selectedInputDevice}
        selectedOutputDevice={selectedOutputDevice}
        setInputDeviceError={setInputDeviceError}
        setOutputDeviceError={setOutputDeviceError}
        inputDeviceError={inputDeviceError}
        outputDeviceError={outputDeviceError}
      />

      {showSignalData && (
        <textarea
          rows={5}
          cols={50}
          value={signalData}
          readOnly
          placeholder='Generated Signal Data will appear here'
          className='text-black mt-2 w-full' // Ensure it has full width
        />
      )}

      <DeviceSelector
        devices={inputDevices}
        selectedDevice={selectedInputDevice}
        onChange={handleInputDeviceChange}
        label='Input Device'
        error={inputDeviceError}
      />
      <DeviceSelector
        devices={outputDevices}
        selectedDevice={selectedOutputDevice}
        onChange={handleOutputDeviceChange}
        label='Output Device'
        error={outputDeviceError}
      />

      <div className='mt-4 flex space-x-4'>
        <MuteButton isMuted={isMuted} toggleMute={toggleMute} />
        <FilterButton
          isFilterEnabled={filterEnabled}
          onClick={() => {
            if (stream) {
              toggleFilter(stream);
            }
          }}
        />
      </div>
    </div>
  );
};

export default AudioStream;
