import React from "react";

interface SignalInputProps {
  signalData: string;
  handleSignalData: (signalData: string) => void;
}

const SignalInput: React.FC<SignalInputProps> = ({
  signalData,
  handleSignalData,
}) => {
  return (
    <div>
      <textarea
        rows={5}
        cols={50}
        value={signalData}
        readOnly
        placeholder='Generated Signal Data will appear here'
        className='text-black'
      />
      <div>
        <input
          type='text'
          placeholder='Enter Signal Data'
          onChange={(e) => handleSignalData(e.target.value)}
          className='text-black'
        />
      </div>
    </div>
  );
};

export default SignalInput;
