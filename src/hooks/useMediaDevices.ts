import { useEffect, useState } from "react";

interface MediaDevice {
  inputDevices: MediaDeviceInfo[];
  outputDevices: MediaDeviceInfo[];
  selectedInputDevice: string;
  selectedOutputDevice: string;
  handleInputDeviceChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  handleOutputDeviceChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const useMediaDevices = (): MediaDevice => {
  const [inputDevices, setInputDevices] = useState<MediaDeviceInfo[]>([]);
  const [outputDevices, setOutputDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedInputDevice, setSelectedInputDevice] = useState<string>("");
  const [selectedOutputDevice, setSelectedOutputDevice] = useState<string>("");

  // get inputs and outputs
  useEffect(() => {
    navigator.mediaDevices.enumerateDevices().then((devices) => {
      const audioInputDevices = devices.filter(
        (device) => device.kind === "audioinput"
      );
      const audioOutputDevices = devices.filter(
        (device) => device.kind === "audiooutput"
      );

      setInputDevices(audioInputDevices);
      setOutputDevices(audioOutputDevices);
    });
  }, []);

  // input device selection
  const handleInputDeviceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedInputDevice(e.target.value);
  };

  // output device selection
  const handleOutputDeviceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedOutputDevice(e.target.value);
  };

  return {
    inputDevices,
    outputDevices,
    selectedInputDevice,
    selectedOutputDevice,
    handleInputDeviceChange,
    handleOutputDeviceChange,
  };
};

export default useMediaDevices;