import { useState, useEffect, useRef } from "react";
import { Send, X, MinusCircle, MessageSquare } from "lucide-react";
import axios from "axios";
import { io, Socket } from "socket.io-client";

const socket: Socket = io(import.meta.env.VITE_SOCKET_IO_URL); // Define this in your `.env` like VITE_SOCKET_IO_URL=http://localhost:5000

interface Message {
  id: string;
  sender: string;
  senderName: string;
  content: string;
  timestamp: string;
}

interface ChatRoomProps {
  rideId: string;
  rideName: string;
  currentUser: {
    email: string;
    fullName: string;
  };
  onClose: () => void;
  isOpen: boolean;
}

function ChatRoom({
  rideId,
  rideName,
  currentUser,
  onClose,
  isOpen,
}: ChatRoomProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      socket.emit("join-room", rideId); // Join room with rideId

      socket.on("receive-message", (message: Message) => {
        setMessages((prev) => [...prev, message]);
      });

      fetchMessages(); // Still get old messages once

      return () => {
        socket.emit("leaveRoom", rideId);
        socket.off("receive-message");
      };
    }
  }, [isOpen, rideId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchMessages = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/chat/${rideId}`
      );
      if (response.data.success) {
        setMessages(response.data.messages);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const messageData = {
      rideId,
      sender: currentUser.email,
      senderName: currentUser.fullName,
      content: newMessage,
    };

    // emit to socket
    socket.emit("send-message", messageData);

    // Optionally persist to DB
    // try {
    //   await axios.post(
    //     `${import.meta.env.VITE_API_BASE_URL}/chat/send`,
    //     messageData
    //   );
    // } catch (err) {
    //   console.error("Error saving message:", err);
    // }
    setNewMessage("");
  };

  if (!isOpen) return null;

  return (
    <div
      className={`fixed right-0 top-0 h-full w-80 bg-white dark:bg-gray-800 shadow-lg flex flex-col transform transition-transform duration-300 ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      {/* Chat Header */}
      <div className="p-4 border-b dark:border-gray-700 bg-indigo-50 dark:bg-gray-900">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <MessageSquare className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h3 className="font-semibold text-gray-800 dark:text-gray-200">
              {rideName}
            </h3>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <MinusCircle className="w-5 h-5" />
            </button>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      {!isMinimized && (
        <>
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex flex-col ${
                  message.sender === currentUser.email
                    ? "items-end"
                    : "items-start"
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.sender === currentUser.email
                      ? "bg-indigo-500 text-white"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                  }`}
                >
                  <p className="text-sm font-medium mb-1">
                    {message.sender === currentUser.email
                      ? "You"
                      : message.senderName}
                  </p>
                  <p className="text-sm">{message.content}</p>
                  <p className="text-xs mt-1 opacity-70">
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <form
            onSubmit={handleSendMessage}
            className="p-4 border-t dark:border-gray-700"
          >
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 px-4 py-2 rounded-full border dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="submit"
                disabled={isLoading}
                className={`p-2 rounded-full ${
                  isLoading
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-indigo-500 hover:bg-indigo-600"
                } text-white`}
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
}

export default ChatRoom;
