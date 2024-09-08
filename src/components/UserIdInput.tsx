import React from "react";

interface UserIdInputProps {
  otherUserId: string | null;
  setOtherUserId: (userId: string) => void;
}

const UserIdInput: React.FC<UserIdInputProps> = ({
  otherUserId,
  setOtherUserId,
}) => {
  return (
    <div>
      <input
        type='text'
        placeholder='Other User ID'
        value={otherUserId || ""}
        onChange={(e) => setOtherUserId(e.target.value)}
        className='text-black'
      />
    </div>
  );
};

export default UserIdInput;
