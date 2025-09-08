import React from "react";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";

function SpeechToText() {
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();

  if (!browserSupportsSpeechRecognition) {
    return <span>Your browser does not support speech recognition.</span>;
  }

  const startListening = () =>
    SpeechRecognition.startListening({ continuous: true, language: "en-IN" });

  return (
    <div className="p-4 space-y-3">
      <h2 className="text-xl font-semibold">React Speech Recognition Demo</h2>
      <p className="text-gray-600">
        Microphone: {listening ? "🎙️ Listening..." : "❌ Off"}
      </p>

      <div className="space-x-2">
        <button
          onClick={startListening}
          className="px-3 py-2 bg-green-500 text-white rounded"
        >
          Start
        </button>
        <button
          onClick={SpeechRecognition.stopListening}
          className="px-3 py-2 bg-red-500 text-white rounded"
        >
          Stop
        </button>
        <button
          onClick={resetTranscript}
          className="px-3 py-2 bg-gray-500 text-white rounded"
        >
          Reset
        </button>
      </div>

      <div className="mt-4 p-3 border rounded bg-gray-100">
        <p className="font-mono">{transcript || "Say something..."}</p>
      </div>
    </div>
  );
}

export default SpeechToText;