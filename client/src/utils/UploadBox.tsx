//it it the sample upload box component with tailwind css 
//upload url should be passed as prop
//example usage of this component in frontend <UploadBox uploadUrl="http://localhost:8000/upload" />
import React, { useState } from "react";
import { selectAndUploadFile } from "./FileUpload";

interface UploadBoxProps {
  uploadUrl: string;
}

export const UploadBox: React.FC<UploadBoxProps> = ({ uploadUrl }) => {
  const [status, setStatus] = useState<"idle" | "uploading" | "success" | "error">("idle");
  const [fileName, setFileName] = useState<string | null>(null);

  const handleUpload = async () => {
    setStatus("uploading");
    const result = await selectAndUploadFile(uploadUrl);

    if (result.success) {
      setStatus("success");
      setFileName(result.fileName || null);
    } else {
      setStatus("error");
      setFileName(result.error || null);
    }
  };

  return (
    <div
      onClick={handleUpload}
      className={`border-2 border-dashed rounded-2xl p-6 cursor-pointer flex flex-col items-center justify-center text-center transition
        ${
          status === "uploading"
            ? "border-blue-400 text-blue-400 animate-pulse"
            : status === "success"
            ? "border-green-500 text-green-500"
            : status === "error"
            ? "border-red-500 text-red-500"
            : "border-gray-400 hover:border-blue-400 hover:text-blue-400"
        }`}
    >
      {status === "uploading" && <p>⏳ Uploading...</p>}
      {status === "success" && <p>✅ Uploaded: {fileName}</p>}
      {status === "error" && <p>❌ Failed: {fileName}</p>}
      {status === "idle" && <p>📤 Click here to upload a file</p>}
    </div>
  );
};
