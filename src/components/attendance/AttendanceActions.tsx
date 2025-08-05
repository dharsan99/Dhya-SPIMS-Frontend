import React from 'react';
import Button from '../ui/button'; // ✅ correct import for lowercase filename

interface Props {
  onAutofillInTime: () => void;
  onAutofillOutTime: () => void;
  onClearAll: () => void;
  onCopyPreviousDay: () => void;
}

const AttendanceActions: React.FC<Props> = ({
  onAutofillInTime,
  onAutofillOutTime,
  onClearAll,
  onCopyPreviousDay,
}) => {
  return (
    <div className="flex flex-wrap gap-2 justify-end mb-4">
      <Button onClick={onAutofillInTime} className="bg-blue-500 hover:bg-blue-600 text-white">
        Autofill In-Time
      </Button>
      <Button onClick={onAutofillOutTime} className="bg-blue-500 hover:bg-blue-600 text-white">
        Autofill Out-Time
      </Button>
      <Button onClick={onCopyPreviousDay} className="bg-green-500 hover:bg-green-600 text-white">
        Copy Previous Day
      </Button>
      <Button onClick={onClearAll} className="bg-red-500 hover:bg-red-600 text-white">
        Clear All
      </Button>
    </div>
  );
};

export default AttendanceActions;