import { useEffect } from "react";
import { useSpeechRecognition } from "react-speech-recognition";

const SpeechToText = ({ onResult, listening, autoStop, isSpeaking }) => {
  const { transcript, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();

  if (!browserSupportsSpeechRecognition) {
    console.warn("Browser does not support speech recognition.");
    return null;
  }

  // Manual mode: submit when listening stops
  useEffect(() => {
    if (!listening && transcript.trim() !== "") {
      onResult(transcript.trim());
      resetTranscript();
    }
  }, [listening, transcript, onResult, resetTranscript]);

  // Auto mode: debounce submit on pause
  useEffect(() => {
    if (autoStop && transcript.trim() !== "" && !isSpeaking) {
      const debounce = setTimeout(() => {
        onResult(transcript.trim());
        resetTranscript();
      }, 1500);

      return () => clearTimeout(debounce);
    }
  }, [transcript, autoStop, isSpeaking, onResult, resetTranscript]);

  return null;
};

export default SpeechToText;
