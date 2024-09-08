import React, { useState } from "react";

interface CallControlsProps {
  initiateCall: (isInitiator: boolean) => void;
  otherUserId: string | null;
  setOtherUserId: (id: string) => void;
  handleSignalData: (signalData: string) => void;
  signalData: string;
  selectedInputDevice: string;
  selectedOutputDevice: string;
  setInputDeviceError: (error: boolean) => void;
  setOutputDeviceError: (error: boolean) => void;
  inputDeviceError: boolean;
  outputDeviceError: boolean;
}

const CallControls: React.FC<CallControlsProps> = ({
  initiateCall,
  otherUserId,
  setOtherUserId,
  selectedInputDevice,
  selectedOutputDevice,
  setInputDeviceError,
  setOutputDeviceError,
}) => {
  const [showStartInputs, setShowStartInputs] = useState(false);
  const [showJoinInputs, setShowJoinInputs] = useState(false);
  const [callInitiated, setCallInitiated] = useState(false);
  const [signalDataInput, setSignalDataInput] = useState("");
  const [otherUserIdError, setOtherUserIdError] = useState(false);
  const [signalDataError, setSignalDataError] = useState(false);

  const handleStartCall = () => {
    if (!selectedInputDevice || !selectedOutputDevice) {
      setInputDeviceError(!selectedInputDevice);
      setOutputDeviceError(!selectedOutputDevice);
    } else {
      setInputDeviceError(false);
      setOutputDeviceError(false);
      setShowStartInputs((prev) => !prev); // start call visibility
    }
  };

  const handleJoinCall = () => {
    if (!selectedInputDevice || !selectedOutputDevice) {
      setInputDeviceError(!selectedInputDevice);
      setOutputDeviceError(!selectedOutputDevice);
    } else {
      setInputDeviceError(false);
      setOutputDeviceError(false);
      setShowJoinInputs((prev) => !prev); // join call visibility
    }
  };

  const handleInitiateStartCall = () => {
    if (!otherUserId) {
      setOtherUserIdError(true);
      return;
    }
    setOtherUserIdError(false);
    initiateCall(true);
    setCallInitiated(true);
  };

  const handleInitiateJoinCall = () => {
    if (!signalDataInput || !otherUserId) {
      // show error if signal data empty or other user id empty
      setSignalDataError(!signalDataInput);
      setOtherUserIdError(!otherUserId);
      return;
    }
    // clear if both valid
    setSignalDataError(false);
    setOtherUserIdError(false);
    initiateCall(false);
    setCallInitiated(true);
  };

  return (
    <>
      {!callInitiated && (
        <div>
          <div className='grid'>
            <button onClick={handleStartCall}>Start Call</button>
            {showStartInputs && (
              <>
                <input
                  type='text'
                  placeholder='Other User ID'
                  value={otherUserId || ""}
                  onChange={(e) => setOtherUserId(e.target.value)}
                  className={`text-black ${
                    otherUserIdError ? "border-red-500 border-2" : ""
                  }`}
                />
                {otherUserIdError && (
                  <p className='text-red-500'>Please enter Other User ID</p>
                )}
                <button className='mt-2' onClick={handleInitiateStartCall}>
                  Initiate Start Call
                </button>
              </>
            )}
          </div>

          <div className='grid mb-14'>
            <button onClick={handleJoinCall}>Join Call</button>
            {showJoinInputs && (
              <>
                <input
                  type='text'
                  placeholder='Enter Signal Data'
                  value={signalDataInput}
                  onChange={(e) => setSignalDataInput(e.target.value)}
                  className={`text-black ${
                    signalDataError ? "border-red-500 border-2" : ""
                  }`}
                />
                {signalDataError && (
                  <p className='text-red-500'>Please enter Signal Data</p>
                )}
                <input
                  type='text'
                  placeholder='Other User ID'
                  value={otherUserId || ""}
                  onChange={(e) => setOtherUserId(e.target.value)}
                  className={`text-black ${
                    otherUserIdError ? "border-red-500 border-2" : ""
                  }`}
                />
                {otherUserIdError && (
                  <p className='text-red-500'>Please enter Other User ID</p>
                )}
                <button className='mt-2' onClick={handleInitiateJoinCall}>
                  Initiate Join Call
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default CallControls;
