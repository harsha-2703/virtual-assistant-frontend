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
  console.log("SpeechToText: useEffect triggered. shouldListen:", shouldListen, "listening:", listening, "isSpeaking:", isSpeaking);

  if (shouldListen) {
    console.log("Calling SpeechRecognition.startListening");
    SpeechRecognition.startListening({
      continuous: isContinuous,
      language: "en-US",
    });
  } else {
    console.log("Calling SpeechRecognition.stopListening");
    SpeechRecognition.stopListening();
  }

  return () => {
    console.log("Aborting listening");
    SpeechRecognition.abortListening();
  };
}, [listening, isContinuous, isSpeaking, autoStop]);

// Normal (manual) mode
useEffect(() => {
  if (!listening && transcript.trim() !== "") {
    console.log("Manual mode: sending transcript:", transcript.trim());
    onResult(transcript.trim());
    resetTranscript();
  }
}, [listening, transcript, onResult, resetTranscript]);

// Auto mode
useEffect(() => {
  if (autoStop && isContinuous && transcript.trim() !== "") {
    console.log("Auto mode: detected transcript, starting debounce:", transcript.trim());
    const debounce = setTimeout(() => {
      console.log("Auto mode: sending transcript after pause:", transcript.trim());
      onResult(transcript.trim());
      resetTranscript();
    }, 1500);

    return () => {
      console.log("Clearing debounce");
      clearTimeout(debounce);
    };
  }
}, [transcript, isContinuous, autoStop, onResult, resetTranscript]);


  return null;
};

export default SpeechToText;
