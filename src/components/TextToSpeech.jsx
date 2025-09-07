import { useEffect, useState } from "react";

export default function TextToSpeech({ text, setIsSpeaking }) {
  const [voices, setVoices] = useState([]);

  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }, []);

  useEffect(() => {
    if (text && voices.length > 0) {
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-US";
      utterance.rate = 1;
      utterance.pitch = 1;
      utterance.volume = 1;

      const selectedVoice = voices.find(
        (v) => v.name.includes("Female") || v.name.includes("Zira")
      );
      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }

      setIsSpeaking?.(true);

      utterance.onend = () => setIsSpeaking?.(false);
      utterance.onerror = () => setIsSpeaking?.(false);
      window.speechSynthesis.speak(utterance);
    }
  }, [text, voices, setIsSpeaking]);

  return null;
}
