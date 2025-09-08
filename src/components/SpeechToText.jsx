import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import { useEffect } from "react";
const SpeechToText = ({ onResult, autoStop, isSpeaking }) => {
  const { finalTranscript, resetTranscript, listening, browserSupportsSpeechRecognition } =
    useSpeechRecognition();

  if (!browserSupportsSpeechRecognition) {
    console.warn("Browser does not support speech recognition.");
    return null;
  }

  const startListening = () => {
    SpeechRecognition.startListening({
      continuous: true,
      language: "en-US",
    });
  };

  const stopListening = () => {
    SpeechRecognition.stopListening();
  };

  // Watch finalTranscript and submit if needed
  useEffect(() => {
    if (finalTranscript.trim() !== "") {
      if (!autoStop && !listening) {
        onResult(finalTranscript.trim());
        resetTranscript();
      }
      if (autoStop && !isSpeaking) {
        const debounce = setTimeout(() => {
          onResult(finalTranscript.trim());
          resetTranscript();
        }, 1500);
        return () => clearTimeout(debounce);
      }
    }
  }, [finalTranscript, autoStop, isSpeaking, listening, onResult, resetTranscript]);

  return (
    <div>
      <button onClick={startListening}>Start</button>
      <button onClick={stopListening}>Stop</button>
    </div>
  );
};

export default SpeechToText;
