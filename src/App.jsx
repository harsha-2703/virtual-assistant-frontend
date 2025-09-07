import { useEffect, useState, useRef } from "react";
import BlurDialog from "./components/BlurDialog";
import Header from "./components/Header";
import TextOnlyUI from "./components/TextOnlyUI";
import VoiceOnlyUI from "./components/VoiceOnlyUI";
import WebcamCapture from "./components/WebcamCapture";
import axios from "axios";

function App() {
  const apiUrl = process.env.REACT_APP_BACKEND_URL || "http://localhost:8000";
  const [apiKey, setApiKey] = useState("");
  const [loadingApiKey, setLoadingApiKey] = useState(false);
  const [isOpen, setIsOpen] = useState(true);
  const [error, setError] = useState("");
  const [mode, setMode] = useState("vo");
  const [autoStop, setAutoStop] = useState(false);
  const [showWebcam, setShowWebcam] = useState(false);
  const webcamRef = useRef(null);
  const [messages, setMessages] = useState([
    {
      role: "bot",
      content: "Hello! I am your Virtual Assistant.",
    },
  ]);

  useEffect(() => {
    const saved = localStorage.getItem("MY_APP_API_KEY");
    if (saved) {
      setApiKey(saved);
      setIsOpen(false);
    }
  }, []);

  function validateKey(key) {
    return key && key.trim().length >= 10;
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!validateKey(apiKey)) {
      setError("Please enter a valid API key");
      return;
    }

    setError("");
    setLoadingApiKey(true);

    try {
      const response = await axios.post(`${apiUrl}/set_key`, {
        key: apiKey.trim(),
      });

      localStorage.setItem("MY_APP_API_KEY", apiKey.trim());
      setIsOpen(false);

    } catch (error) {
      if (error.response && error.response.data && error.response.data.detail) {
        setError(error.response.data.detail);
      } else {
        setError("Failed to validate API key. Please try again.");
      }
    }
    finally {
      setLoadingApiKey(false);
    }
  }


  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header 
        onChangeKey={() => setIsOpen(true)}
        screenMode={mode}
        autoStop={autoStop}
        setAutoStop={setAutoStop}
        showWebcam={showWebcam}
        setShowWebcam={setShowWebcam}
      />

      <main className="flex-1 flex items-start justify-center p-6">
        <div className="relative w-full max-w-4xl h-[75vh] border rounded-2xl bg-white shadow-md p-6">
          
          {showWebcam && (
            <div className="absolute top-0 z-10 bg-white w-[95%] p-4 rounded-xl">
              <WebcamCapture ref={webcamRef} isVisible={showWebcam}/>
            </div>
          )}

          {mode === "to" ? (
            <TextOnlyUI 
              isOpen={isOpen}
              messages={messages}
              setMessages={setMessages}
              showWebCam={showWebcam}
              webcamRef={webcamRef}
            />
           ) : (
           <VoiceOnlyUI 
            isOpen={isOpen}
            autoStop={autoStop}
            messages={messages}
            setMessages={setMessages}
            showWebCam={showWebcam}
            webcamRef={webcamRef}
           />
          )}
        </div>
      </main>

      <BlurDialog
        isOpen={isOpen}
        apiKey={apiKey}
        setApiKey={setApiKey}
        error={error}
        setError={setError}
        onSubmit={handleSubmit}
        onClose={() => setIsOpen(false)}
        mode={mode}
        setMode={setMode}
        loadingApiKey={loadingApiKey}
      />
    </div>
  );
}

export default App;