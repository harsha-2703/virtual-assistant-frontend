import ChatMessage from "./base/ChatMessage";
import TextToSpeech from "./TextToSpeech";

function ChatWindow({ messages, isOpen, messagesEndRef, isTyping, showWebCam, mode, setIsSpeaking }) {
    return (
        <div className="flex flex-col h-full">
            <div className={`flex-1 overflow-auto p-4 hide-scrollbar ${isOpen ? "opacity-60 pointer-events-none" : ""}`}>
                <div className="flex flex-col gap-4">
                    {showWebCam && <div className="h-[220px] shrink-0" />} 
                    {messages.map((msg, index) => (
                        <ChatMessage key={index} message={msg.content} role={msg.role} />
                    ))}

                    {mode === "vo" &&
                        messages.length > 0 &&
                        messages[messages.length - 1].role === "bot" && (
                        <TextToSpeech text={messages[messages.length - 1].content} setIsSpeaking={setIsSpeaking}/>
                    )}
                    
                    {isTyping && (
                        <div className="self-start bg-gray-200 text-gray-800 px-4 py-2 rounded-2xl max-w-[80%]">
                        <img src="/typing-dots.gif" alt="Typing..." className="w-12 h-6" />
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
            </div>
        </div>
    );
}

export default ChatWindow;