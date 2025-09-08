import { useRef, useState, useEffect } from "react";
import { FaStopCircle } from "react-icons/fa";
import { IoMicCircleSharp } from "react-icons/io5";
import ChatWindow from "./ChatWindow";
import SpeechToText from "./SpeechToText";
import useAutoScroll from "../hooks/useAutoScroll";
import useMessageHandler from "../hooks/useMessageHandler";
import SpeechRecognition from "react-speech-recognition"; // 🆕 Import this here

function VoiceOnlyUI({ isOpen, autoStop, messages, setMessages, showWebCam, webcamRef }) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [listening, setListening] = useState(autoStop || false);
  const messagesEndRef = useRef(null);
  const { sendMessage, isTyping } = useMessageHandler(setMessages, webcamRef);

  useAutoScroll(messages, messagesEndRef);

  useEffect(() => {
    setListening(autoStop);
  }, [autoStop]);

  const handleSpeechResult = (text) => {
    if (text.trim()) {
      sendMessage(text);
    }
  };

  // 🧠 START/STOP listening directly inside button click (respects user gesture)
  const toggleListening = () => {
    if (listening) {
      console.log("🛑 Stopping STT");
      SpeechRecognition.stopListening();
      setListening(false);
    } else {
      console.log("🔊 Starting STT");
      SpeechRecognition.startListening({ continuous: true, language: "en-US" });
      setListening(true);
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
        setIsSpeaking={setIsSpeaking}
      />

      <div className="mt-8 flex justify-center items-center gap-6">
        {!autoStop && (
          <button
            type="button"
            onClick={!isOpen ? toggleListening : undefined}
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
          isSpeaking={isSpeaking}
          autoStop={autoStop}
        />
      </div>
    </>
  );
}

export default VoiceOnlyUI;
