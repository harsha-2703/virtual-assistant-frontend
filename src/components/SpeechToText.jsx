import { useEffect } from "react";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";

const SpeechToText = ({ onResult, listening, isContinuous, isSpeaking, autoStop }) => {
  const {
    transcript,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  if (!browserSupportsSpeechRecognition) {
    console.warn("Browser does not support speech recognition.");
    return null;
  }

  // 🎯 Only control mic in autoStop mode — browser needs gesture otherwise
  useEffect(() => {
    if (!autoStop) return;

    const shouldListen = listening && !isSpeaking;

    if (shouldListen) {
      console.log("🎤 AutoStart STT");
      SpeechRecognition.startListening({
        continuous: isContinuous,
        language: "en-US",
      });
    } else {
      console.log("🎤 AutoStop STT");
      SpeechRecognition.stopListening();
    }

    return () => {
      SpeechRecognition.abortListening();
    };
  }, [listening, isContinuous, isSpeaking, autoStop]);

  // 📤 Manual mode: submit when user stops
  useEffect(() => {
    if (!autoStop && !listening && transcript.trim() !== "") {
      onResult(transcript.trim());
      resetTranscript();
    }
  }, [listening, transcript, onResult, resetTranscript, autoStop]);

  // 🤖 Auto mode: debounce submit on pause
  useEffect(() => {
    if (autoStop && isContinuous && transcript.trim() !== "") {
      const debounce = setTimeout(() => {
        onResult(transcript.trim());
        resetTranscript();
      }, 1500);

      return () => clearTimeout(debounce);
    }
  }, [transcript, isContinuous, autoStop, onResult, resetTranscript]);

  return null; // invisible listener
};

export default SpeechToText;
