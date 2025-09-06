import { useState, useEffect, useMemo } from "react";
import Editor from "@monaco-editor/react";
import { saveSnippet, fetchSnippets } from "./api";
import io from "socket.io-client";
// ✅ use the "common" build so languages are already registered
import hljs from "highlight.js/lib/common";

const socket = io("http://localhost:5000");

// Map Highlight.js language names -> Monaco language ids
const HLJS_TO_MONACO = {
  javascript: "javascript",
  typescript: "typescript",
  js: "javascript",
  ts: "typescript",
  python: "python",
  py: "python",
  java: "java",
  c: "c",
  "c++": "cpp",
  cpp: "cpp",
  csharp: "csharp",
  cs: "csharp",
  php: "php",
  ruby: "ruby",
  go: "go",
  rust: "rust",
  swift: "swift",
  kotlin: "kotlin",
  sql: "sql",
  json: "json",
  css: "css",
  scss: "scss",
  less: "less",
  // HLJS often detects HTML as 'xml' — map to Monaco 'html'
  html: "html",
  xml: "html",
  markdown: "markdown",
  bash: "shell",
  shell: "shell",
  sh: "shell",
  plaintext: "plaintext",
};

function App() {
  const [code, setCode] = useState("// Start coding...");
  const [title, setTitle] = useState("");
  const [snippets, setSnippets] = useState([]);
  const [language, setLanguage] = useState("javascript");

  useEffect(() => {
    fetchSnippets().then(setSnippets);
  }, []);

  // Receive updates from others
  useEffect(() => {
    const handler = (data) => {
      setCode(data);
      autoDetectLanguage(data);
    };
    socket.on("codeUpdate", handler);
    return () => socket.off("codeUpdate", handler);
  }, []);

  const autoDetectLanguage = (text) => {
    const sample = (text || "").trim();
    if (sample.length < 2) {
      // keep current language if very short text (HLJS confidence is poor on tiny snippets)
      return;
    }
    const { language: hlName } = hljs.highlightAuto(sample);
    const monacoLang = HLJS_TO_MONACO[hlName] || "plaintext";
    setLanguage(monacoLang);
  };

  const handleCodeChange = (value) => {
    const next = value ?? "";
    setCode(next);
    autoDetectLanguage(next);
    socket.emit("codeChange", next);
  };

  const handleSave = async () => {
    const snippet = { title, language, code };
    const result = await saveSnippet(snippet);
    alert(result.message || "Snippet saved!");
    setSnippets((prev) => [...prev, snippet]);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Real-Time Online Code Editor</h2>

      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <input
          type="text"
          placeholder="Snippet Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ marginBottom: "10px", padding: "5px", flex: 1 }}
        />
        <span
          style={{
            padding: "6px 10px",
            borderRadius: 8,
            border: "1px solid #555",
            fontSize: 12,
            color: "#ddd",
          }}
          title="Detected language"
        >
          Detected: {language}
        </span>
      </div>

      <Editor
        height="60vh"
        width="90vw"
        // ❗ drive Monaco with detected language; don't pass defaultLanguage
        language={language}
        theme="vs-dark"
        value={code}
        onChange={handleCodeChange}
        options={{
          fontSize: 16,
          minimap: { enabled: false },
          automaticLayout: true,
          suggestOnTriggerCharacters: true,
          quickSuggestions: true,
        }}
      />

      <button onClick={handleSave} style={{ marginTop: "10px" }}>
        Save Snippet
      </button>

      <h3>Saved Snippets:</h3>
      <ul>
        {snippets.map((s, index) => (
          <li key={index}>
            {s.title} <small>({s.language})</small>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
