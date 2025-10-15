import { useState, useEffect } from 'react';

interface SchedulePickerProps {
  nodeLabel?: string;
  onValueChange?: (label: string, value: { date: string; time: string }) => void;
}

export default function SchedulePicker({ nodeLabel, onValueChange }: SchedulePickerProps) {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');

  useEffect(() => {
    if (nodeLabel && onValueChange && date && time) {
      onValueChange(nodeLabel, { date, time });
    }
  }, [date, time]);

  return (
    <div className="flex flex-col gap-1">
      <div className="text-[6px] text-gray-400 font-semibold">
        This will perform the operation at the scheduled time
      </div>
      <input
        type="time"
        value={time}
        onChange={(e) => setTime(e.target.value)}
        className="text-[6px] text-gray-400"
      />
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className="text-[6px] text-gray-400"
      />
    </div>
  );
}
