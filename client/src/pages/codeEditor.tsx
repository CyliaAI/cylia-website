import  { useState } from "react";
import Editor, {  loader } from "@monaco-editor/react";
import axios from "axios";

loader.init().then(monaco => {
  // You can configure themes, languages here if needed
    monaco.editor.setTheme("vs-dark");
    
});

type Language = "javascript" | "python" | "typescript" | "cpp";

function CodeEditor() {
  const [code, setCode] = useState<string>("");       // user code
  const [input, setInput] = useState<string>("");     // input for code
  const [language, setLanguage] = useState<Language>("javascript");
  const [output, setOutput] = useState<string>("");
    const getInput=()=>{
        // Fetch input from backend if needed
        console.log("Fetching input from backend...");
        return "try to find a way to use it or else remove it.But backend need input thing"
    }
    const handleRun = async () => {
    try {
      const response = await axios.post("http://localhost:8000/customNode/run-code", {
        userId: 4,
        codeName: "test1",
        input:" ",
      });

      setOutput(JSON.stringify(response.data.output));
    } catch (err: any) {
      console.error(err);
      setOutput("Error running code");
    }
  };

  const handleSave = async () => {
    try {
      const response = await axios.post("http://localhost:8000/customNode/save-code", {
        userId: 4,         // Example userId, replace dynamically
        codeName: "test1", // Example codeName, replace dynamically
        code,             // pass input to backend
      });
      console.log("Code saved successfully:", response.data);
      setOutput(JSON.stringify(response.data.customCode.code));
      handleRun();
    } catch  {
      
      setOutput( "Error running code");
    }
  };

  return (
    <div className="flex flex-col gap-4 p-4 bg-gray-900 h-200 text-white">
      {/* Language Selector */}
      <div className="flex items-center gap-2">
        <label htmlFor="language">Language:</label>
        <select
          id="language"
          value={language}
          onChange={(e) => setLanguage(e.target.value as Language)}
          className="bg-gray-800 text-white p-1 rounded"
        >
          <option value="javascript">JavaScript</option>
          <option value="typescript">TypeScript</option>
          <option value="python">Python</option>
          <option value="cpp">C++</option>
        </select>
      </div>

      {/* Monaco Editor */}
      <Editor
        height="400px"
        theme="vs-dark"
        language={language}
        value={code}
        onChange={(value) => setCode(value || "")}
        options={{
          fontSize: 16,
          minimap: { enabled: false },
          wordWrap: "on",
          automaticLayout: true,
        }}
      />

      {/* Input field for code */}
      <textarea
        placeholder={getInput()}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="p-2 bg-gray-800 text-white rounded resize-none"
        rows={3}
      />

      {/* Run button */}
      <button
        onClick={handleSave}
        className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 px-4 rounded"
      >
        Save
      </button>

      {/* Output display */}
      <div className="bg-gray-800 p-2 rounded min-h-[50px]">
        <strong>Output:</strong>
        <pre>{output}</pre>
      </div>
    </div>
  );
}

export default CodeEditor;
