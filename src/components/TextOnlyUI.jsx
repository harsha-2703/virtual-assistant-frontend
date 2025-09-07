import { useRef, useState } from "react";
import { IoMdSend } from "react-icons/io";
import ChatWindow from "./ChatWindow";
import useAutoScroll from "../hooks/useAutoScroll";
import useMessageHandler from "../hooks/useMessageHandler";

function TextOnlyUI({ isOpen, messages, setMessages, showWebCam, webcamRef }) {
  const messagesEndRef = useRef(null);
  const [inputValue, setInputValue] = useState("");
  const { sendMessage, isTyping } = useMessageHandler(setMessages, webcamRef);

  useAutoScroll(messages, messagesEndRef);

  const handleSend = () => {
    if (!isOpen && inputValue.trim()) {
      sendMessage(inputValue);
      setInputValue("");
    }
  };

  return (
    <>
      <ChatWindow messages={messages} isOpen={isOpen} messagesEndRef={messagesEndRef} isTyping={isTyping} showWebCam={showWebCam} mode={"to"} />

      <div className="mt-12">
        <form
          className="flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
        >
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="flex-1 border rounded-md px-3 py-2 bg-gray-50 disabled:opacity-60"
            placeholder={isOpen ? "Unlock with API key to send messages" : "Type a message..."}
            disabled={isOpen}
          />
          <button
            type="submit"
            className="px-4 py-2 rounded-md bg-black text-white disabled:opacity-60 cursor-pointer"
            disabled={isOpen}
          >
            <IoMdSend className="size-6" />
          </button>
        </form>
      </div>
    </>
  );
}

export default TextOnlyUI;