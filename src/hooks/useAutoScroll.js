import { useEffect } from "react";

function useAutoScroll(messages, ref) {
  useEffect(() => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, ref]);
}

export default useAutoScroll;