import { useRef, useState } from "react";

const gainValue = 0.75;
const frequencyRange = 200;

interface AudioFilter {
  applyFilter: (mediaStream: MediaStream) => void;
  removeFilter: () => void;
  filterEnabled: boolean;
  toggleFilter: (mediaStream: MediaStream) => void;
  setGain: (value: number) => void;
}

const useAudioFilter = (): AudioFilter => {
  const audioContextRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const filterNodeRef = useRef<BiquadFilterNode | null>(null);
  const [filterEnabled, setFilterEnabled] = useState(false);

  const applyFilter = (mediaStream: MediaStream) => {
    if (!audioContextRef.current) {
      const audioContext = new AudioContext();
      const source = audioContext.createMediaStreamSource(mediaStream);
      const gainNode = audioContext.createGain();
      const filterNode = audioContext.createBiquadFilter();

      gainNode.gain.setValueAtTime(gainValue, audioContext.currentTime);
      filterNode.type = "lowpass";
      filterNode.frequency.setValueAtTime(frequencyRange, audioContext.currentTime);

      source.connect(filterNode);
      filterNode.connect(gainNode);
      gainNode.connect(audioContext.destination);

      audioContextRef.current = audioContext;
      gainNodeRef.current = gainNode;
      filterNodeRef.current = filterNode;
    }
  };

  const removeFilter = () => {
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
      gainNodeRef.current = null;
      filterNodeRef.current = null;
    }
  };

  const setGain = (value: number) => {
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.setValueAtTime(value, audioContextRef.current!.currentTime);
    }
  };

  const toggleFilter = (mediaStream: MediaStream) => {
    if (filterEnabled) {
      removeFilter();
    } else {
      applyFilter(mediaStream);
    }
    setFilterEnabled(!filterEnabled);
  };

  return { applyFilter, removeFilter, filterEnabled, toggleFilter, setGain };
};

export default useAudioFilter;
