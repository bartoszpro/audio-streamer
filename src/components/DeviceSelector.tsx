import React from "react";

interface DeviceSelectorProps {
  devices: MediaDeviceInfo[];
  selectedDevice: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  label: string;
  error: boolean;
}

const DeviceSelector: React.FC<DeviceSelectorProps> = ({
  devices,
  selectedDevice,
  onChange,
  label,
  error,
}) => {
  return (
    <div className='mt-4'>
      <h4 className='text-white'>{label}</h4>
      <select
        value={selectedDevice}
        onChange={onChange}
        className={`text-black w-full ${
          error ? "border-red-500 border-2" : ""
        }`}
      >
        <option value=''>Select {label}</option>
        {devices.map((device) => (
          <option key={device.deviceId} value={device.deviceId}>
            {device.label || `${label} ${device.deviceId}`}
          </option>
        ))}
      </select>
      {error && <p className='text-red-500'>Please select a {label}</p>}{" "}
    </div>
  );
};

export default DeviceSelector;
