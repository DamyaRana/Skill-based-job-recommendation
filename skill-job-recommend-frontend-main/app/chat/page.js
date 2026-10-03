"use client";
import { useState } from "react";

export default function ChatPage() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);

  async function sendMessage() {
    const res = await fetch("https://skill-job-backend.onrender.com/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: input })
    });

    const data = await res.json();

    setMessages(prev => [...prev, { role: "user", text: input }]);
    setMessages(prev => [...prev, { role: "bot", text: data.reply }]);
    setInput("");
  }

  return (
    <div style={{ padding: 50 }}>
      <h2>Chatbot</h2>
      <input
        placeholder="Type here"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button onClick={sendMessage}>Send</button>

      <div style={{ marginTop: 20 }}>
        {messages.map((m, i) => (
          <div key={i}>
            <strong>{m.role}:</strong> {m.text}
          </div>
        ))}
      </div>
    </div>
  );
}
