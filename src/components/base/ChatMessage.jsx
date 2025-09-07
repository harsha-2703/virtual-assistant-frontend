import { FaRobot, FaUser } from "react-icons/fa";

function ChatMessage({ message, role }) {
  const isBot = role === "bot";

  return (
    <div
      className={`flex items-center ${isBot ? "space-x-2" : "justify-end space-x-reverse space-x-2"}`}
    >
      {isBot && <FaRobot className="w-6 h-6 mt-1 text-gray-700" />}
      
      <div
        className={`rounded-lg px-3 py-2 max-w-[60%] ${
          isBot
            ? "bg-gray-200 text-left"
            : "bg-blue-500 text-white text-right"
        }`}
      >
        {message}
      </div>

      {!isBot && <FaUser className="w-6 h-6 mt-1 ml-2 text-gray-700" />}
    </div>
  );
}

export default ChatMessage;