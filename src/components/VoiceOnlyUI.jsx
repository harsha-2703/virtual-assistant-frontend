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

  const isContinuous = autoStop;

  if (!browserSupportsSpeechRecognition) {
    alert("Your browser does not support speech recognition. Please use Chrome or Edge.");
  }

  // Continuous mode: start listening automatically and restart on end
  useEffect(() => {
    if (!isContinuous || isOpen) return;

    const handleEnd = () => {
      if (!isSpeaking) {
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
      } catch (err) {
        console.error("Mic permission error", err);
      }
    };

    startContinuous();
  }, [isContinuous, isOpen, isSpeaking, resetTranscript]);

  useEffect(() => {
    if (!isContinuous || !listening || transcript.trim() === "") return;

    if (isSpeaking) return; // pause STT while TTS is speaking

    const debounce = setTimeout(() => {
      sendMessage(transcript.trim());
      resetTranscript();
    }, 1500); // 1.5s pause = end of speech

    return () => clearTimeout(debounce);
  }, [transcript, isContinuous, listening, isSpeaking, sendMessage, resetTranscript]);

  const handleMicToggle = async () => {
    if (!listening) {
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true });
        resetTranscript();
        SpeechRecognition.startListening({ continuous: true, language: "en-IN" });
        setListening(true);
      } catch (err) {
        console.error("Mic error:", err);
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
        setIsSpeaking={setIsSpeaking}
      />

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
