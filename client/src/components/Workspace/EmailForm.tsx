import { useState, useEffect } from "react";

interface EmailFormProps {
  nodeLabel?: string;
  onValueChange?: (label: string, value: [string, string]) => void;
}

export default function EmailForm({ nodeLabel, onValueChange }: EmailFormProps) {
  const [email, setEmail] = useState('');
  const [emailFinale, setEmailFinale] = useState('');
  const [subject, setSubject] = useState('');
  const [subjectFinale, setSubjectFinale] = useState('');

  useEffect(() => {
    if (nodeLabel && onValueChange) {
      onValueChange(nodeLabel, [emailFinale, subjectFinale]);
    }
  }, [emailFinale, subjectFinale]);

  return (
    <div className="flex flex-col gap-1">
      <div className="text-[6px] text-gray-400 font-semibold">
        This will send an email to the specified address
      </div>
      <input
        type="text"
        placeholder="Email"
        value={email}
        onBlur={e => setEmailFinale(e.target.value)}
        onChange={e => setEmail(e.target.value)}
      />
      <input
        type="text"
        placeholder="Subject"
        value={subject}
        onBlur={e => setSubjectFinale(e.target.value)}
        onChange={e => setSubject(e.target.value)}
      />
    </div>
  );
}
