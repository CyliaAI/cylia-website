import { useState } from "react";

interface RAGProps {
  nodeLabel?: string;
  onValueChange?: (label: string, value: string) => void;
}

export default function RAGInput({ nodeLabel, onValueChange }: RAGProps) {
  const [query, setQuery] = useState('');

  const handleBlur = () => {
    if (nodeLabel && onValueChange) {
      onValueChange(nodeLabel, query);
    }
  };

  return (
    <div className="flex flex-col gap-1">
      <div className="text-[6px] text-gray-400 font-semibold">
        This will send the data to the RAG Model.
      </div>
      <input
        type="text"
        placeholder="Summary"
        value={query}
        onChange={e => setQuery(e.target.value)}
        onBlur={handleBlur}
        className="text-[8px]"
      />
    </div>
  );
}
