import React from "react";

interface FilterButtonProps {
  isFilterEnabled: boolean;
  onClick: () => void;
}

const FilterButton: React.FC<FilterButtonProps> = ({
  isFilterEnabled,
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded ${
        isFilterEnabled ? "bg-green-500 text-white" : "bg-gray-200 text-black"
      }`}
    >
      {isFilterEnabled ? "Filter Enabled" : "Enable Filter"}
    </button>
  );
};

export default FilterButton;
