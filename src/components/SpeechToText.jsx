import { useEffect, useRef } from "react";
import { useSpeechRecognition } from "react-speech-recognition";

const SpeechToText = ({ onResult, listening }) => {
  const {
    transcript,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  const lastSubmittedRef = useRef("");
  console.log("🎤 Transcript:", transcript);

  useEffect(() => {
    if (!listening) return;

    const interval = setInterval(() => {
      const trimmed = transcript.trim();

      // Only send new data
      if (
        trimmed &&
        trimmed !== lastSubmittedRef.current
      ) {
        const newText = trimmed.slice(lastSubmittedRef.current.length).trim();
        if (newText) {
          onResult(newText);
          lastSubmittedRef.current = trimmed;
        }
        resetTranscript(); // Clear the transcript to avoid buildup
      }
    }, 1500);

    return () => clearInterval(interval);
  }, [transcript, listening, onResult, resetTranscript]);

  if (!browserSupportsSpeechRecognition) {
    console.warn("Speech recognition not supported.");
    return null;
  }

  return null; // no UI
};

export default SpeechToText;
