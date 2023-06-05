import { useEffect, useState } from "react";
import io from "socket.io-client";

const BASE_URL = "http://localhost:5000";
const socket = io(BASE_URL);

export default function ChatPage() {
  const [allMessages, setAllMessages] = useState([]);
  const [username, setUsername] = useState("");

  const joinChat = () => {
    socket.on("connectionData", (data) => {
      console.log(data);
      setUsername(data.username);
    });
  };

  const sendMessage = (userMessage) => {
    const message = {
      id: new Date().getTime(),
      text: userMessage,
      username: username,
    };

    socket.emit("message", message);
  };

  useEffect(() => {
    joinChat();
  }, []);

  useEffect(() => {
    socket.on("messageReceived", (data) => {
      setAllMessages((prevMessages) => [...prevMessages, data]);
    });

    // Clean up the socket event listener when component unmounts
    return () => {
      socket.off("messageReceived");
    };
  }, []);

  return (
    <>
      <section className="flex flex-col items-center justify-center w-screen min-h-screen bg-gray-100 text-gray-800 p-10">
        <div className="flex flex-col flex-grow w-full max-w-xl bg-white shadow-xl rounded-lg overflow-hidden">
          <div className="flex flex-col flex-grow h-0 p-4 overflow-auto">
            <div className="text-sm font-bold tracking-wide text-gray-600 text-center">
              CHAT APP
            </div>
            {allMessages.map((message, index) => {
              return (
                <div key={index}>
                  {username !== message.username ? (
                    <div
                      v-if="message.user !== userForum"
                      class="flex w-full mt-2 space-x-3 max-w-xs ml-auto justify-end"
                    >
                      <div>
                        <div class="text-xs text-gray-500 leading-none mb-2">
                          {message.username}
                        </div>
                        <div class="bg-blue-600 text-white p-3 rounded-l-lg rounded-br-lg">
                          <p class="text-sm">{message.text}</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div
                      v-if="message.user == userForum"
                      class="flex w-full mt-2 space-x-3 max-w-xs"
                    >
                      <div>
                        <div class="text-xs text-gray-500 leading-none mb-2">
                          {message.username}
                        </div>
                        <div>
                          <div class="bg-gray-300 p-3 rounded-r-lg rounded-bl-lg">
                            <p class="text-sm">{message.text}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}


          </div>

          {/* INPUT MESSAGE */}
          <div className="bg-gray-300 p-4">
            <input
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  sendMessage(e.target.value);
                  e.target.value = "";
                }
              }}
              className="flex items-center h-10 w-full rounded px-3 text-sm"
              type="text"
              placeholder="Type your message…"
            />
          </div>
        </div>
      </section>
    </>
  );
}
