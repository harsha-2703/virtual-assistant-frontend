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
    console.warn("Browser does not support speech recognition.");
    return null;
  }

  // Only send new transcripts when listening stops
  useEffect(() => {
    const trimmed = transcript.trim();

    if (!listening && trimmed) {
      let newText = trimmed;

      // Remove text already submitted
      if (trimmed.startsWith(lastSubmittedRef.current)) {
        newText = trimmed.slice(lastSubmittedRef.current.length).trim();
      }

      if (newText) {
        onResult(newText);
        lastSubmittedRef.current = trimmed;
      }

      resetTranscript();
    }
  }, [listening, transcript, onResult, resetTranscript]);

  return null;
};

export default SpeechToText;
