import { useEffect, useRef } from "react";
import { useSpeechRecognition } from "react-speech-recognition";

const SpeechToText = ({ onResult, listening }) => {
  const {
    transcript,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  const lastSubmittedRef = useRef("");

  if (!browserSupportsSpeechRecognition) {
    console.warn("🚫 Browser does not support speech recognition.");
    return null;
  }

  useEffect(() => {
    const trimmed = transcript.trim();
    console.log("🧠 Live transcript:", trimmed);

    if (!listening && trimmed) {
      let newText = trimmed;

      if (trimmed.startsWith(lastSubmittedRef.current)) {
        newText = trimmed.slice(lastSubmittedRef.current.length).trim();
      }

      if (newText) {
        onResult(newText);
        lastSubmittedRef.current = trimmed;
        resetTranscript();
      }
    }
  }, [listening, transcript, onResult, resetTranscript]);

  return null;
};

export default SpeechToText;
