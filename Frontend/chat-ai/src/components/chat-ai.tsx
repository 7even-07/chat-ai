"use client";
import React, { useState } from "react";
import config from "../includes/config";



function ChatAI() {
  const [userMessage, setUserMessage] = useState("");
  const [chatLog, setChatLog] = useState([]);

  const handleSend = async () => {
    if (!userMessage.trim()) return;

    const userEntry = { sender: "user", text: userMessage };
    setChatLog((prev) => [...prev, userEntry]);

    try {
      const res = await fetch(config.BACKENDSITEURL + "/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage }),
      });

      const data = await res.json();
      const botEntry = {
        sender: "bot",
        text: data.reply_text,
        audio: config.BACKENDSITEURL + data.audio_url,
      };

      setChatLog((prev) => [...prev, botEntry]);

      // play the audio
      const audio = new Audio(botEntry.audio);
      audio.play();
    } catch (err) {
      console.error("API Error : ", err);
      alert("Error reaching the backend");
    }

    setUserMessage("");
  };
  return (
    <div style={{ padding: 20, maxWidth: 600, margin: "auto" }}>
      <h2>Chat With Your Fav Character</h2>
      <div style={{ marginBottom: 20 }}>
        {chatLog.map((entry, idx) => (
          <div key={idx} style={{ marginBottom: 10 }}>
            <b>{entry.sender === "user" ? "You" : "Bot"}</b> {entry.text}
            {entry.audio && (
              <div>
                <audio controls src={entry.audio} style={{ marginTop: 5 }} />
              </div>
            )}
          </div>
        ))}
      </div>

      <input
        type="text"
        placeholder="Type a message"
        value={userMessage}
        onChange={(e) => setUserMessage(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSend()}
        style={{ width: "80%", padding: 8 }}
      />
      <button onClick={handleSend} style={{ padding: 8, marginLeft: 10 }}>
        Send
      </button>
    </div>
  );
}

export default ChatAI;
