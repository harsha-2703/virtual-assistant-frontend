import { useRef, useState, useEffect } from "react";
import { FaStopCircle } from "react-icons/fa";
import { IoMicCircleSharp } from "react-icons/io5";
import ChatWindow from "./ChatWindow";
import useAutoScroll from "../hooks/useAutoScroll";
import useMessageHandler from "../hooks/useMessageHandler";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";

function VoiceOnlyUI({ isOpen, autoStop, messages, setMessages, showWebCam, webcamRef }) {
  const [listening, setListening] = useState(false);
  const messagesEndRef = useRef(null);
  const { sendMessage, isTyping } = useMessageHandler(setMessages, webcamRef);

  const { transcript, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();

  useAutoScroll(messages, messagesEndRef);

  // 🔍 Log browser support on mount
  useEffect(() => {
    if (!browserSupportsSpeechRecognition) {
      console.error("❌ Browser does NOT support Speech Recognition API.");
    } else {
      console.log("✅ Browser supports Speech Recognition API.");
    }
  }, [browserSupportsSpeechRecognition]);

  // 🔍 Attach global error listener
  useEffect(() => {
    if ("webkitSpeechRecognition" in window) {
      const recognition = new window.webkitSpeechRecognition();
      recognition.onerror = (e) => {
        console.error("⚠️ SpeechRecognition error:", e.error);
      };
    }
  }, []);

  const handleMicToggle = async () => {
    if (!listening) {
      console.log("🎙️ Requesting microphone access...");
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true }); // ensures permission prompt
        console.log("✅ Microphone permission granted.");

        resetTranscript();
        console.log("🎙️ Starting listening...");
        SpeechRecognition.startListening({ continuous: true, language: "en-IN" });
        setListening(true);
      } catch (err) {
        console.error("❌ Microphone permission denied or error:", err);
      }
    } else {
      handleStop();
    }
  };

  const handleStop = () => {
    console.log("🛑 Stopping listening...");
    SpeechRecognition.stopListening();
    setListening(false);

    if (transcript.trim()) {
      console.log("📝 Final transcript sent:", transcript);
      sendMessage(transcript.trim());
      resetTranscript();
    } else {
      console.log("ℹ️ No transcript captured.");
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
      </div>
    </>
  );
}

export default VoiceOnlyUI;
