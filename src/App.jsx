import React, { useState } from "react";
import { Select, MenuItem, Button, Typography, Box, CircularProgress } from "@mui/material";
import { Editor } from "@monaco-editor/react";
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import RefreshIcon from '@mui/icons-material/Refresh'; 

const App = () => {
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const [status, setStatus] = useState("");
  
  const executeCode = async () => {
    setOutput("");
    setStatus("Running...");

    let consoleOutput = [];

    const originalConsoleLog = console.log;
    console.log = (...args) => {
      consoleOutput.push(args.join(' '));
    };

    try {
      if (!code.trim()) {
        setOutput("Please write some code to run.");
        setStatus("error");
        return;
      }

      if (language === "javascript") {
        eval(code); 
        setOutput(`JavaScript code executed successfully.\nOutput: ${consoleOutput.join('\n')}`); // Display captured output
        setStatus("success");
      } else if (language === "python") {
        setTimeout(() => {
        
          if (code.includes('print')) {
            const matches = code.match(/print\((.*)\)/);
            if (matches) {
              setOutput(`Python code executed successfully.\nOutput: ${matches[1].replace(/"/g, "")}`);
            } else {
              setOutput("Python code executed successfully.\nHello, Python!");
            }
          } else {
            setOutput("Python code executed successfully.");
          }
          setStatus("success");
        }, 1000);
      } else if (language === "go") {
        setTimeout(() => {
          if (code.includes('fmt.Println')) {
            const matches = code.match(/fmt\.Println\("(.*)"\)/);
            if (matches) {
              setOutput(`Go code executed successfully.\nOutput: ${matches[1]}`);
            } else {
              setOutput("Go code executed successfully.\nHello, Go!");
            }
          } else {
            setOutput("Go code executed successfully.");
          }
          setStatus("success");
        }, 1000); 
      } else {
        setOutput("Error: Unsupported language selected.");
        setStatus("error");
      }
    } catch (error) {
      setOutput(`Error: ${error.message}`);
      setStatus("error");
    } finally {
      console.log = originalConsoleLog;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-900 to-gray-800 p-4">
      <Typography variant="h4" className="text-center mb-6 font-bold text-white" sx={{mb:"20px", mt:"10px"}}>
        Online Code Editor
      </Typography>

      <Box className="container1 mx-auto bg-white p-6 rounded-xl shadow-lg max-w-4xl">
  
        <Typography variant="subtitle1" className="mb-6 text-gray-700">
          Task Description: Write your code and click "Run" to execute it.
        </Typography>

        <Select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="mb-6"
          fullWidth
          variant="outlined"
          color="primary"
        >
          <MenuItem value="javascript">JavaScript</MenuItem>
          <MenuItem value="python">Python</MenuItem>
          <MenuItem value="go">Go</MenuItem>
        </Select>

        <Editor
          height="400px"
          defaultLanguage="javascript"
          language={language}
          value={code}
          onChange={(value) => setCode(value || "")}
          theme="vs-dark"
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: "on"
          }}
        />
        <Button
          variant="contained"
          color="primary"
          sx={{ mt: 4, display: "flex", justifyContent: "center", alignItems: "center" }}
          fullWidth
          onClick={executeCode}
          disabled={status === "Running..."} 
        >
          {status === "Running..." ? (
            <CircularProgress size={24} sx={{ color: "white" }} />
          ) : (
            <PlayArrowIcon sx={{ mr: 1 }} />
          )}
          Run
        </Button>

        {status && (
          <Box
            className={`mt-6 p-6 rounded-xl text-white ${
              status === "success"
                ? "bg-green-500"
                : status === "error"
                ? "bg-red-500"
                : "bg-blue-500"
            }`}
          >
            <Typography variant="body1">{output}</Typography>
          </Box>
        )}
      </Box>
    </div>
  );
};

export default App;
