import React, { useRef, useEffect, useState } from "react";
import "./App.css";
import logo from "./images/websocket.png";

// 1
const webSocket = new WebSocket("ws://localhost:5000");

function App() {
  // 2
  const messagesEndRef = useRef(null);
  const [userId, setUserId] = useState("");
  const [isLogin, setIsLogin] = useState(false);
  const [msg, setMsg] = useState("");
  const [msgList, setMsgList] = useState([]);

  // 3
  useEffect(() => {
    if (!webSocket) return;

    webSocket.onopen = function () {
      console.log("open", webSocket.protocol);
    };
    // 4
    webSocket.onmessage = function (e) {
      const { data, id, type } = JSON.parse(e.data);
      setMsgList((prev) => [
        ...prev,
        {
          msg: type === "welcome" ? `${data} joins the chat` : data,
          type: type,
          id: id,
        },
      ]);
    };
    webSocket.onClose = function () {
      console.log("close");
    };
  }, []);

  // 5
  useEffect(() => {
    scrollToBottom();
  }, [msgList]);

  // 6
  const onSubmitHandler = (e) => {
    e.preventDefault();
    const sendData = {
      type: "id",
      data: userId,
    };
    webSocket.send(JSON.stringify(sendData));
    setIsLogin(true);
  };
  // 7
  const onChangeUserHandler = (e) => {
    setUserId(e.target.value);
  };
  // 8
  const onSendSubmitHandler = (e) => {
    e.preventDefault();
    const sendData = {
      type: "msg",
      data: msg,
      id: userId,
    };
  };
  // 9
  const onChangeMsgHandler = (e) => {
    setMsg(e.target.value);
  };

  // 리턴 부분 작성필요

  return (
    <div className="App">
      <header className="App-header">
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
