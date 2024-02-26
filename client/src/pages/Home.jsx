import { useEffect, useState } from "react";
import { FaBeer } from "react-icons/fa";
import ChatInterface from "../components/ChatInterface";
import chatImage from "../assets/chat.jpeg";
import io from "socket.io-client";

const Home = () => {
  const [socket, setSocket] = useState(null);
  const [username, setUsername] = useState("");
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const newSocket = io("http://localhost:4444");
    setSocket(newSocket);

    const name = prompt("Enter your name:");
    setUsername(name);

    newSocket.emit("new-user", name);

    newSocket.on("initial-user-list", (userList) => {
      setUsers(userList);
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-r from-blue-400 to-green-400">
      <div className="flex items-center mb-8">
        <FaBeer className="text-3xl text-white mr-2" />
        <h1 className="text-3xl text-white font-bold">ChatPartner</h1>
      </div>

      <img src={chatImage} alt="Chat" className="w-32 h-32 mb-8 rounded-full" />
      {socket && (
        <ChatInterface socket={socket} username={username} users={users} />
      )}
    </div>
  );
};

export default Home;
