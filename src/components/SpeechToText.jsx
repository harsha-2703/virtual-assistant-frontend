import { useEffect, useRef } from "react";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";

const SpeechToText = ({ onResult, listening, isContinuous }) => {
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

  useEffect(() => {
    if (listening) {
      SpeechRecognition.startListening({
        continuous: isContinuous,
        language: "en-IN",
      });
    } else {
      SpeechRecognition.stopListening();
    }
  }, [listening, isContinuous]);

  useEffect(() => {
    const trimmed = transcript.trim();

    if (!listening && trimmed) {
      // Get the new text only (remove what was already sent)
      let newText = trimmed;
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
