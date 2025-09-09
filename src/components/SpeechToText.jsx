import { useSpeechRecognition } from "react-speech-recognition";

function SpeechToText({ listening }) {
  const {
    transcript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  if (!browserSupportsSpeechRecognition) {
    return <span>Your browser does not support speech recognition.</span>;
  }

  return (
    <div className="p-4 space-y-3">
      <p className="text-gray-600">
        Microphone: {listening ? "🎙️ Listening..." : "❌ Off"}
      </p>

      <div className="mt-4 p-3 border rounded bg-gray-100">
        <p className="font-mono">{transcript || "Say something..."}</p>
      </div>
    </div>
  );
}

export default SpeechToText;
