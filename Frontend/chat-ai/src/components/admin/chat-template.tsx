"use client";
import React, { useState, useEffect, useRef } from "react";
import config from "@/includes/config";
import { getCharacterById } from "@/services/charactersAPI";
import { useAuth } from "../AuthContext";

interface ChatAppProps {
  characterId: string;
}

const ChatApp: React.FC<ChatAppProps> = ({ characterId }) => {
  const [userMessage, setUserMessage] = useState("");
  const [chatLog, setChatLog] = useState<any[]>([]);
  const [avatarPreview, setAvatarPreview] = useState(
    "https://placehold.co/200x/ffa8e4/ffffff.svg?text=ʕ•́ᴥ•̀ʔ"
  );
  const { member } = useAuth();
  const chatEndRef = useRef<HTMLDivElement | null>(null);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatLog]);

  useEffect(() => {
    if (characterId) {
      const load = async () => {
        const data = await getCharacterById(Number(characterId));
        setAvatarPreview(
          `${config.BACKENDSITEURL}/uploads/characters/avatar-img/` +
            data.character_avatar_url
        );
      };
      load();
    }
  }, [characterId]);

  useEffect(() => {
    async function loadHistory() {
      const res = await fetch(
        `${config.BACKENDSITEURL}/chat/history?member_id=${member?.id}&character_id=${characterId}`
      );
      const data = await res.json();

      if (data.response_code === 1 && data.response_data) {
        setChatLog(data.response_data); // <-- use response_data
      }
    }

    if (member?.id && characterId) {
      loadHistory();
    }
  }, [member?.id, characterId]);

  const handleSend = async () => {
    if (!userMessage.trim()) return;

    const userEntry = { sender: "user", text: userMessage };
    setChatLog((prev) => [...prev, userEntry]);

    setIsTyping(true); 
    try {
      const res = await fetch(config.BACKENDSITEURL + "/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage,
          characterId: Number(characterId),
          memberId: Number(member?.id),
        }),
      });

      const data = await res.json();
      const botEntry = {
        sender: "bot",
        text: data.reply_text,
        audio: config.BACKENDSITEURL + data.audio_url,
      };

      setChatLog((prev) => [...prev, botEntry]);

      // play the audio
      if (botEntry.audio) {
        const audio = new Audio(botEntry.audio);
        audio.play();
      }
    } catch (err) {
      console.error("API error", err);
      alert("Error reaching backend");
    } finally {
      setIsTyping(false);
    }
    setUserMessage("");
  };

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target as Node)
      ) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <div className="h-screen flex flex-col">
      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 pb-36">
        {chatLog.map((msg, idx) => (
          <div
            key={idx}
            className={`flex mb-4 ${
              msg.sender === "user" ? "justify-end" : ""
            }`}
          >
            {msg.sender === "bot" && (
              <div className="w-9 h-9 rounded-full flex items-center justify-center mr-2">
                <img
                  src={avatarPreview}
                  alt="Bot Avatar"
                  className="w-8 h-8 rounded-full"
                />
              </div>
            )}

            <div
              className={`flex max-w-96 rounded-lg p-3 gap-3 ${
                msg.sender === "user"
                  ? "bg-indigo-500 text-white"
                  : "bg-white text-gray-700"
              }`}
            >
              <p>{msg.text}</p>
            </div>

            {msg.sender === "user" && (
              <div className="w-9 h-9 rounded-full flex items-center justify-center ml-2">
                <img
                  src="https://placehold.co/200x/b7a8ff/ffffff.svg?text=ʕ•́ᴥ•̀ʔ"
                  alt="User Avatar"
                  className="w-8 h-8 rounded-full"
                />
              </div>
            )}
          </div>
        ))}
        {isTyping && (
          <div className="flex mb-4">
            <div className="w-9 h-9 rounded-full flex items-center justify-center mr-2">
              <img
                src={avatarPreview}
                alt="Bot Avatar"
                className="w-8 h-8 rounded-full animate-pulse"
              />
            </div>
            <div className="flex max-w-96 rounded-lg p-3 gap-3 bg-white text-gray-700">
              <p>Typing...</p>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Chat Input */}
      <footer className="bg-white border-t border-gray-300 p-4">
        <div className="flex items-center">
          <input
            type="text"
            value={userMessage}
            onChange={(e) => setUserMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder={`Message ${characterId}...`}
            className="w-full p-2 rounded-md border border-gray-400 focus:outline-none focus:border-blue-500"
          />
          <button
            onClick={handleSend}
            className="bg-indigo-500 text-white px-4 py-2 rounded-md ml-2"
          >
            Send
          </button>
        </div>
      </footer>
    </div>
  );
};

export default ChatApp;
