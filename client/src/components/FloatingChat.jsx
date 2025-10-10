import { useState } from "react";
import { MessageCircle, X } from "lucide-react";

export default function FloatingChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:3000/api/v1/query/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: input }),
      });

      const data = await res.json();
      const aiMessage = {
        sender: "ai",
        text: data.response?.summary || data.error || "No response received.",
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { sender: "ai", text: "Sorry, something went wrong." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !loading) handleSend();
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 bg-green-600 text-white p-4 rounded-full shadow-lg hover:bg-green-700 transition-all"
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-20 right-6 w-80 bg-white border border-gray-300 rounded-2xl shadow-2xl flex flex-col h-[70vh] z-50">
          <div className="bg-green-700 text-white p-3 rounded-t-2xl flex justify-between items-center">
            <span className="font-semibold">🌾 Farming Assistant</span>
            <button onClick={() => setIsOpen(false)} className="text-white">
              <X size={18} />
            </button>
          </div>

          <div className="flex-1 p-3 overflow-y-auto space-y-3 bg-gray-50">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`p-3 rounded-2xl max-w-[75%] ${
                  msg.sender === "user"
                    ? "ml-auto bg-green-600 text-white"
                    : "bg-white text-gray-800 border border-gray-200"
                }`}
              >
                {msg.text}
              </div>
            ))}
            {loading && (
              <div className="italic text-gray-500 text-sm">Thinking...</div>
            )}
          </div>

          <div className="p-3 border-t flex items-center space-x-2 bg-white rounded-b-2xl">
            <input
              type="text"
              className="flex-1 border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Ask your question..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              disabled={loading}
            />
            <button
              onClick={handleSend}
              disabled={loading}
              className="bg-green-700 text-white px-3 py-2 rounded-xl hover:bg-green-800 disabled:opacity-50"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
}
