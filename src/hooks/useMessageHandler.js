import { useState } from "react";
import axios from "axios";

function useMessageHandler(setMessages, webcamRef) {
  const [isTyping, setIsTyping] = useState(false);
  const apiUrl = process.env.REACT_APP_BACKEND_URL || "http://localhost:8000";

  const sendMessage = async (userMessage) => {
    if (!userMessage.trim()) return;

    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setIsTyping(true);

    try {
      let botRes;

      const storedKey = localStorage.getItem("MY_APP_API_KEY");

      if (!storedKey) {
        const res = await axios.post(`${apiUrl}/conversation`, { query: userMessage });
        botRes = res.data.response;
      } else {
        const classifyRes = await axios.post(`${apiUrl}/prompt_classify`, {
          query: userMessage,
        });
        const classification = classifyRes.data?.response;

        if (classification === "conversation") {
          const res = await axios.post(`${apiUrl}/conversation`, { query: userMessage });
          botRes = res.data.response;

        } else if (classification === "tool") {
          const res = await axios.post(`${apiUrl}/tool`, { query: userMessage });
          botRes = res.data.response;

        } else if (classification === "vision") {
          if (!webcamRef?.current) {
            botRes = "Could you please turn on your webcam";
          } else {
            const imageSrc = webcamRef.current.getScreenshot();

            const byteString = atob(imageSrc.split(",")[1]);
            const mimeString = imageSrc.split(",")[0].split(":")[1].split(";")[0];
            const ab = new ArrayBuffer(byteString.length);
            const ia = new Uint8Array(ab);
            for (let i = 0; i < byteString.length; i++) {
              ia[i] = byteString.charCodeAt(i);
            }
            const file = new File([ab], "webcam.jpg", { type: mimeString });

            const formData = new FormData();
            formData.append("query", userMessage);
            formData.append("file", file);

            const res = await axios.post(`${apiUrl}/vision`, formData, {
              headers: { "Content-Type": "multipart/form-data" },
            });
            botRes = res.data.response;
          }
        } else {
          botRes = "Sorry, I couldn't understand your request.";
        }
      }

      setMessages((prev) => [...prev, { role: "bot", content: botRes }]);

    } catch (err) {
      console.error("API error:", err);
      setMessages((prev) => [...prev, { role: "bot", content: "Sorry, something went wrong." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return { sendMessage, isTyping };
}


export default useMessageHandler;
