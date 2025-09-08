import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import { useEffect } from "react";

const SpeechToText = ({ onResult, listening, isContinuous, isSpeaking, autoStop }) => {
  const {
    finalTranscript,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  if (!browserSupportsSpeechRecognition) {
    console.warn("Browser does not support speech recognition.");
    return null;
  }

  // Control STT start/stop
  useEffect(() => {
    const shouldListen = autoStop ? (listening && !isSpeaking) : listening;

    if (shouldListen) {
      SpeechRecognition.startListening({
        continuous: isContinuous,
        language: "en-US",
      });
    } else {
      SpeechRecognition.stopListening();
    }
  }, [listening, isContinuous, isSpeaking, autoStop]);

  // Manual mode: submit once when user stops
  useEffect(() => {
    if (!autoStop && !listening && finalTranscript.trim() !== "") {
      onResult(finalTranscript.trim());
      resetTranscript();
    }
  }, [listening, finalTranscript, onResult, resetTranscript, autoStop]);

  // Auto mode: submit once per pause
  useEffect(() => {
    if (autoStop && isContinuous && finalTranscript.trim() !== "") {
      const debounce = setTimeout(() => {
        onResult(finalTranscript.trim());
        resetTranscript();
      }, 1500);
      return () => clearTimeout(debounce);
    }
  }, [finalTranscript, isContinuous, autoStop, onResult, resetTranscript]);

  return null;
};

export default SpeechToText;
