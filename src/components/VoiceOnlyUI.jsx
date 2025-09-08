import { useRef, useState, useEffect } from "react";
import { FaStopCircle } from "react-icons/fa";
import { IoMicCircleSharp } from "react-icons/io5";
import ChatWindow from "./ChatWindow";
import SpeechToText from "./SpeechToText";
import useAutoScroll from "../hooks/useAutoScroll";
import useMessageHandler from "../hooks/useMessageHandler";
import SpeechRecognition from "react-speech-recognition";

function VoiceOnlyUI({ isOpen, autoStop, messages, setMessages, showWebCam, webcamRef }) {
  const [listening, setListening] = useState(autoStop || false);
  const messagesEndRef = useRef(null);
  const { sendMessage, isTyping } = useMessageHandler(setMessages, webcamRef);

  useAutoScroll(messages, messagesEndRef);

  useEffect(() => {
    setListening(autoStop);
  }, [autoStop]);

  // Explicitly start/stop listening when `listening` changes
  useEffect(() => {
    if (listening) {
      SpeechRecognition.startListening({ continuous: true, language: "en-IN" });
    } else {
      SpeechRecognition.stopListening();
    }
  }, [listening]);

  const handleSpeechResult = (text) => {
    if (text.trim()) {
      sendMessage(text);
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
        mode={"vo"}
      />

      <div className="mt-8 flex justify-center items-center gap-6">
        {!autoStop && (
          <button
            type="button"
            onClick={!isOpen ? () => setListening(!listening) : undefined}
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

        <SpeechToText
          onResult={handleSpeechResult}
          listening={listening}
          isContinuous={true}
        />
      </div>
    </>
  );
}

export default VoiceOnlyUI;