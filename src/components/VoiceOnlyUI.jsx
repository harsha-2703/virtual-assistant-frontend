import { useRef, useState } from "react";
import { FaStopCircle } from "react-icons/fa";
import { IoMicCircleSharp } from "react-icons/io5";
import ChatWindow from "./ChatWindow";
import useAutoScroll from "../hooks/useAutoScroll";
import useMessageHandler from "../hooks/useMessageHandler";
import SpeechToText from "./SpeechToText";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";

function VoiceOnlyUI({ isOpen, autoStop, messages, setMessages, showWebCam, webcamRef }) {
  const [listening, setListening] = useState(false);
  const messagesEndRef = useRef(null);
  const { sendMessage, isTyping } = useMessageHandler(setMessages, webcamRef);

  const { transcript, resetTranscript } = useSpeechRecognition();

  useAutoScroll(messages, messagesEndRef);

  const handleMicToggle = () => {
    if (!listening) {
      console.log("🎙️ Starting listening...");
      resetTranscript(); // clear old transcript
      SpeechRecognition.startListening({ continuous: true, language: "en-IN" });
      setListening(true);
    } else {
      handleStop();
    }
  };

  const handleStop = () => {
    console.log("🛑 Stopping listening...");
    SpeechRecognition.stopListening();
    setListening(false);

    // ✅ Only send when user presses Stop
    if (transcript.trim()) {
      console.log("📝 Final transcript sent:", transcript);
      sendMessage(transcript.trim());
      resetTranscript();
    }
  };

  return (
    <>
      <ChatWindow
        messages={messages}
        isOpen={isOpen}
        messagesEndRef={messagesEndRef}
        isTyping={isTyping}
        showWebCam={showWebCam}
        mode="vo"
      />

      <div className="mt-8 flex justify-center items-center gap-6">
        {!autoStop && (
          <button
            type="button"
            onClick={!isOpen ? handleMicToggle : undefined}
            disabled={isOpen}
            aria-label={listening ? "Stop listening" : "Start listening"}
            className="transition-transform hover:scale-105 focus:outline-none disabled:opacity-60"
          >
            {listening ? (
              <FaStopCircle className="size-14 text-red-600 cursor-pointer" />
            ) : (
              <IoMicCircleSharp className="size-16 text-gray-700 cursor-pointer" />
            )}
          </button>
        )}

        <SpeechToText listening={listening} />
      </div>
    </>
  );
}

export default VoiceOnlyUI;
