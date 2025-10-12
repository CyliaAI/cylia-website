import { useState } from "react";

interface EmailFormProps {
  nodeLabel?: string;
  onValueChange?: (label: string, value: [string, string]) => void;
}

export default function EmailForm({ nodeLabel, onValueChange }: EmailFormProps) {
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');

  const handleBlur = () => {
    if (nodeLabel && onValueChange) {
      onValueChange(nodeLabel, [email, subject]);
    }
  };

  return (
    <div className="flex flex-col gap-1">
      <div className="text-[6px] text-gray-400 font-semibold">
        This will send an email to the specified address
      </div>
      <input
        type="text"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        onBlur={handleBlur}
        className="text-[8px]"
      />
      <input
        type="text"
        placeholder="Subject"
        value={subject}
        onChange={e => setSubject(e.target.value)}
        onBlur={handleBlur}
        className="text-[8px]"
      />
    </div>
  );
}
