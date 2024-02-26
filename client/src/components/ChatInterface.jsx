import { useState, useEffect, useRef } from "react";
import { FaUser } from "react-icons/fa";
import { RiSendPlane2Line } from "react-icons/ri";
import messageSound from "../assets/ring.wav";
import Message from "./Message";

const ChatInterface = ({ socket, username, users }) => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    socket.on("chat-message", (data) => {
      if (data.name !== username) {
        const audio = new Audio(messageSound);
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: data.message, sender: data.name },
        ]);
        audio
          .play()
          .catch((error) => console.error("Error playing audio:", error));
      }
    });

    return () => {
      socket.off("chat-message");
    };
  }, [socket, username]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleMessageSend = () => {
    if (inputText.trim() !== "") {
      socket.emit("send-chat-message", inputText);
      setMessages([...messages, { text: inputText, sender: "user" }]);
      setInputText("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleMessageSend();
    }
  };

  return (
    <div className="flex  h-[600px] lg:w-[900px] md:w-[700px] sm:w-[400px] ">
      <div className="w-1/4 bg-gray-300 p-4">
        <div className="relative">
          <h2 className="pl-6 text-lg font-bold mb-4">All Active Users</h2>
          <div className="absolute top-0 right-0 pr-4">
            <div className="animate-ping w-3 h-3  rounded-full bg-sky-600"></div>
          </div>
        </div>

        <ul>
          {users.map((user, index) => (
            <li
              key={index}
              className="p-2 cursor-pointer border-2 border-black  rounded-md hover:bg-gray-300 flex items-center flex-col my-2 sm:flex-row"
            >
              <FaUser className="mr-2" />
              {user}
              <div className=" w-2 h-2 ml-0.5 mb-3 rounded-full bg-green-600"></div>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex-1 flex flex-col justify-between bg-gray-100">
        <div className="flex-1 overflow-y-auto p-4 h-96">
          {messages.map((message, index) => (
            <Message key={index} message={message} />
          ))}
          <div ref={messagesEndRef}></div>
        </div>
        <div className="p-4 flex items-center">
          <input
            type="text"
            className="flex-1 border rounded-l-lg py-2 px-4 focus:outline-none"
            placeholder="Type a message..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <button
            className="bg-blue-500 text-white py-2 px-4 rounded-r-lg flex items-center"
            onClick={handleMessageSend}
          >
            <RiSendPlane2Line className="mr-2" />
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

import PropTypes from "prop-types";

ChatInterface.propTypes = {
  socket: PropTypes.object.isRequired,
  username: PropTypes.string.isRequired,
  users: PropTypes.object.isRequired,
};

export default ChatInterface;
