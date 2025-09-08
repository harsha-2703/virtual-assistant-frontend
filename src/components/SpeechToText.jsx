import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { useEffect } from "react";

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

  // Control STT start/stop
  useEffect(() => {
  const shouldListen = autoStop ? (listening && !isSpeaking) : listening;
  if (shouldListen) {
    console.log("🔊 Starting STT");
    SpeechRecognition.startListening({
      continuous: isContinuous,
      language: "en-US",
    });
  } else {
    console.log("🛑 Stopping STT");
    SpeechRecognition.stopListening();
  }

  // ❌ Remove this part completely
  // return () => {
  //   SpeechRecognition.abortListening();
  // };
}, [listening, isContinuous, isSpeaking, autoStop]);

// ✅ Add separate useEffect for cleanup ONLY on unmount
useEffect(() => {
  return () => {
    console.log("🧹 Component unmounted → abort STT");
    SpeechRecognition.abortListening();
  };
}, []);


  // Normal (manual) mode: submit when listening stops
  useEffect(() => {
    if (!listening && transcript.trim() !== "") {
      onResult(transcript.trim());
      resetTranscript();
    }
  }, [listening, transcript, onResult, resetTranscript]);

  // Auto mode: debounce submit on pause
  useEffect(() => {
    if (autoStop && isContinuous && transcript.trim() !== "") {
      const debounce = setTimeout(() => {
        onResult(transcript.trim());
        resetTranscript();
      }, 1500); // pause = end of speech

      return () => clearTimeout(debounce);
    }
  }, [transcript, isContinuous, autoStop, onResult, resetTranscript]);

  return null;
};

export default SpeechToText;
