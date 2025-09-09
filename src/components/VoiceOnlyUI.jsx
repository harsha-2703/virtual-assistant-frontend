import { useRef, useState, useEffect } from "react";
import ChatWindow from "./ChatWindow";
import useAutoScroll from "../hooks/useAutoScroll";
import useMessageHandler from "../hooks/useMessageHandler";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import { FaStopCircle } from "react-icons/fa";
import { IoMicCircleSharp } from "react-icons/io5";

function VoiceOnlyUI({ isOpen, autoStop, messages, setMessages, showWebCam, webcamRef }) {
  const [listening, setListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const messagesEndRef = useRef(null);
  const { sendMessage, isTyping } = useMessageHandler(setMessages, webcamRef);

  const {
    transcript,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  useAutoScroll(messages, messagesEndRef);

  const isContinuous = autoStop; // toggle between manual & continuous

  // ✅ Check browser support
  useEffect(() => {
    if (!browserSupportsSpeechRecognition) {
      console.error("❌ Browser does NOT support Speech Recognition API.");
    } else {
      console.log("✅ Browser supports Speech Recognition API.");
    }
  }, [browserSupportsSpeechRecognition]);

  // ✅ Global error listener
  useEffect(() => {
    if ("webkitSpeechRecognition" in window) {
      const recognition = new window.webkitSpeechRecognition();
      recognition.onerror = (e) => console.error("⚠️ SpeechRecognition error:", e.error);
    }
  }, []);

  // 🔄 Continuous mode: start listening automatically and restart on end
  useEffect(() => {
    if (!isContinuous || isOpen) return;

    const handleEnd = () => {
      if (!isSpeaking) {
        console.log("🔄 Restarting STT after end");
        SpeechRecognition.startListening({
          continuous: true,
          language: "en-IN",
          onEnd: handleEnd,
        });
        setListening(true);
      }
    };

    const startContinuous = async () => {
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true }); // one-time mic request
        resetTranscript();
        SpeechRecognition.startListening({
          continuous: true,
          language: "en-IN",
          onEnd: handleEnd,
        });
        setListening(true);
        console.log("🎙️ Continuous STT started");
      } catch (err) {
        console.error("❌ Mic permission error", err);
      }
    };

    startContinuous();
  }, [isContinuous, isOpen, isSpeaking, resetTranscript]);

  // ⏱ Auto-submit transcript on pause (debounce)
  useEffect(() => {
    if (!isContinuous || !listening || transcript.trim() === "") return;

    if (isSpeaking) return; // pause STT while TTS is speaking

    const debounce = setTimeout(() => {
      sendMessage(transcript.trim());
      resetTranscript();
    }, 1500); // 1.5s pause = end of speech

    return () => clearTimeout(debounce);
  }, [transcript, isContinuous, listening, isSpeaking, sendMessage, resetTranscript]);

  // 🔘 Manual mic toggle
  const handleMicToggle = async () => {
    if (!listening) {
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true });
        resetTranscript();
        SpeechRecognition.startListening({ continuous: true, language: "en-IN" });
        setListening(true);
      } catch (err) {
        console.error("❌ Mic error:", err);
      }
    } else {
      handleStop();
    }
  };

  const handleStop = () => {
    SpeechRecognition.stopListening();
    setListening(false);
    if (transcript.trim()) {
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
        setIsSpeaking={setIsSpeaking} // allow ChatWindow/TTS to pause STT
      />

      {/* Show mic button only in manual mode */}
      {!isContinuous && (
        <div className="mt-8 flex justify-center items-center gap-6">
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
        </div>
      )}
    </>
  );
}

export default VoiceOnlyUI;
