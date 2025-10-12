import { useState, useEffect } from "react";

interface UploadBoxProps {
  nodeLabel?: string;
  onValueChange?: (label: string, value: File) => void; // No nulls
}

export default function UploadBox({ nodeLabel, onValueChange }: UploadBoxProps) {
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const selectedFile = e.target.files[0];
    setFile(selectedFile);

    if (nodeLabel && onValueChange) {
      onValueChange(nodeLabel, selectedFile);
    }
  };

  return (
    <div className="flex flex-col gap-2 text-[6px] text-gray-400">
      <label
        htmlFor={`upload-${nodeLabel}`}
        className="cursor-pointer px-3 py-1 bg-white/90 backdrop-blur-md border border-gray-300 rounded-sm shadow-sm text-gray-700 hover:bg-cyan-100 hover:text-cyan-700 transition-all duration-200"
      >
        {file ? file.name : "Upload File"}
      </label>

      <input
        id={`upload-${nodeLabel}`}
        type="file"
        onChange={handleFileChange}
        className="hidden"
      />

      {file && (
        <div className="text-[5px] pl-2">
          {file.name} ({Math.round(file.size / 1024)} KB)
        </div>
      )}
    </div>
  );
}
