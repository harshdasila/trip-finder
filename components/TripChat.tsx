"use client";

import { useState, useRef, useEffect } from "react";
import { useSupabaseChat } from "@/hooks/useSupabaseChat";

interface CurrentUser {
  user_id: string;
  user_name: string;
  user_image: string | null;
}

interface TripChatProps {
  tripID: string;
  currentUser: CurrentUser;
}

// --- helper functions ---
function getInitials(name: string): string {
  if (!name) return "";
  const parts = name.trim().split(" ");
  const first = parts[0]?.[0]?.toUpperCase() || "";
  const second = parts[1]?.[0]?.toUpperCase() || "";
  return first + second || first;
}

function getRandomColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return `hsl(${hash % 360}, 70%, 60%)`;
}

export function TripChat({ tripID, currentUser }: TripChatProps) {
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const {
    messages,
    loading,
    onlineUsers,
    typingUsers,
    sendMessage,
    sendTypingIndicator,
  } = useSupabaseChat(tripID, currentUser);
  console.log(messages, "messages");
  const grouped = groupMessagesByDate(messages);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    try {
      await sendMessage(inputMessage);
      setInputMessage("");

      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      sendTypingIndicator(false);
      setIsTyping(false);
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputMessage(e.target.value);

    if (!isTyping && e.target.value.trim()) {
      setIsTyping(true);
      sendTypingIndicator(true);
    }

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      sendTypingIndicator(false);
    }, 2000);
  };

  function groupMessagesByDate(messages: any[]) {
    const groups: Record<string, any[]> = {};

    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    const isSameDay = (d1: Date, d2: Date) =>
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate();

    for (const msg of messages) {
      const msgDate = new Date(msg.created_at);
      let label = "";

      if (isSameDay(msgDate, today)) {
        label = "Today";
      } else if (isSameDay(msgDate, yesterday)) {
        label = "Yesterday";
      } else {
        label = msgDate.toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        });
      }

      if (!groups[label]) groups[label] = [];
      groups[label].push(msg);
    }

    return groups;
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-md border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <button
                onClick={() => window.history.back()}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                title="Go back"
              >
                <svg
                  className="w-6 h-6 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              <div>
                <h3 className="font-bold text-xl text-gray-800">Trip Chat</h3>
                <p className="text-sm text-gray-500 mt-0.5">
                  Plan your adventure together
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-green-50 px-4 py-2 rounded-full">
              <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-green-700">
                {onlineUsers.length} online
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto px-6 py-6 space-y-4">
          {/* ✅ No messages */}
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-20">
              <div className="bg-white rounded-full p-6 shadow-lg mb-4">
                <svg
                  className="w-16 h-16 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </div>

              <h4 className="text-xl font-semibold text-gray-700 mb-2">
                No messages yet
              </h4>
              <p className="text-gray-500">
                Start the conversation and plan your trip!
              </p>
            </div>
          ) : (
            /* ✅ Grouped Messages Section */
            Object.entries(groupMessagesByDate(messages)).map(
              ([dateLabel, msgs]) => (
                <div key={dateLabel}>
                  {/* ✅ Date Separator */}
                  <div className="flex justify-center my-4">
                    <span className="bg-white shadow px-4 py-1 rounded-full text-gray-600 text-sm">
                      {dateLabel}
                    </span>
                  </div>

                  {/* ✅ Messages inside this date */}
                  {msgs.map((message: any) => {
                    const initials = getInitials(message.sender_name);
                    const bgColor = getRandomColor(message.sender_name);

                    return (
                      <div
                        key={message.id}
                        className={`flex ${
                          message.sender_id === currentUser.user_id
                            ? "justify-end"
                            : "justify-start"
                        }`}
                      >
                        <div
                          className={`flex max-w-[70%] gap-3 ${
                            message.sender_id === currentUser.user_id
                              ? "flex-row-reverse"
                              : "flex-row"
                          }`}
                        >
                          {/* ✅ Avatar section */}
                          {message.sender_id !== currentUser.user_id &&
                            (message.sender_image ? (
                              <img
                                src={message.sender_image}
                                alt={message.sender_name}
                                className="w-10 h-10 rounded-full object-cover shadow-md ring-2 ring-white"
                              />
                            ) : (
                              <div
                                style={{ backgroundColor: bgColor }}
                                className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold shadow-md ring-2 ring-white"
                              >
                                {initials}
                              </div>
                            ))}

                          <div
                            className={
                              message.sender_id === currentUser.user_id
                                ? "items-end"
                                : "items-start"
                            }
                          >
                            {message.sender_id !== currentUser.user_id && (
                              <p className="text-xs font-medium text-gray-600 mb-1 px-1">
                                {message.sender_name}
                              </p>
                            )}

                            <div
                              className={`px-5 py-3 rounded-3xl shadow-sm ${
                                message.sender_id === currentUser.user_id
                                  ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-br-md"
                                  : "bg-white text-gray-800 rounded-bl-md"
                              }`}
                            >
                              <p className="break-words leading-relaxed">
                                {message.content}
                              </p>

                              <p
                                className={`text-xs mt-1.5 ${
                                  message.sender_id === currentUser.user_id
                                    ? "text-blue-100"
                                    : "text-gray-400"
                                }`}
                              >
                                {new Date(
                                  message.created_at
                                ).toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )
            )
          )}

          {/* ✅ Typing Indicators */}
          {typingUsers.length > 0 && (
            <div className="flex items-center gap-3 pl-2">
              <div className="flex space-x-1.5 bg-white px-4 py-3 rounded-3xl shadow-sm">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0.1s" }}
                ></div>
                <div
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                ></div>
              </div>
              <span className="text-sm text-gray-500 italic">
                {typingUsers.length === 1
                  ? "Someone is typing..."
                  : `${typingUsers.length} people are typing...`}
              </span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-gray-200 shadow-lg">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <form onSubmit={handleSubmit} className="flex items-center gap-3">
            <input
              type="text"
              value={inputMessage}
              onChange={handleTyping}
              placeholder="Type your message..."
              className="flex-1 px-5 py-3 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all duration-200 text-gray-800 placeholder-gray-400"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim()}
              className="flex-shrink-0 w-24 h-10 px-3 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium rounded-full hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md flex items-center justify-center gap-2"
            >
              <span className="text-sm">Send</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
