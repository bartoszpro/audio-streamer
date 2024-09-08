import React from "react";

interface MuteButtonProps {
  isMuted: boolean;
  toggleMute: () => void;
}

const MuteButton: React.FC<MuteButtonProps> = ({ isMuted, toggleMute }) => {
  return (
    <button
      onClick={toggleMute}
      className={`px-4 py-2 rounded ${
        isMuted ? "bg-red-500 text-white" : "bg-gray-200 text-black"
      }`}
    >
      {isMuted ? "Muted" : "Mute"}
    </button>
  );
};

export default MuteButton;
