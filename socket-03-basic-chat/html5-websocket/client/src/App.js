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
    webSocket.onclose = function () {
      console.log("close");
    };
  }, []);
  // 5
  useEffect(() => {
    scrollToBottom();
  }, [msgList]);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

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
  const onChangeUserIdHandler = (e) => {
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
    webSocket.send(JSON.stringify(sendData));
    setMsgList((prev) => [...prev, { msg: msg, type: "me", id: userId }]);
    setMsg("");
  };
  // 9
  const onChangeMsgHandler = (e) => {
    setMsg(e.target.value);
  };
  return (
    <div className="app-container">
      <div className="wrap">
        {isLogin ? (
          // 10
          <div className="chat-box">
            <h3>Login as a "{userId}"</h3>
            <ul className="chat">
              {msgList.map((v, i) =>
                v.type === "welcome" ? (
                  <li className="welcome">
                    <div className="line" />
                    <div>{v.msg}</div>
                    <div className="line" />
                  </li>
                ) : (
                  <li className={v.type} key={`${i}_li`}>
                    <div className="userId">{v.id}</div>
                    <div className={v.type}>{v.msg}</div>
                  </li>
                )
              )}
              <li ref={messagesEndRef} />
            </ul>
            <form className="send-form" onSubmit={onSendSubmitHandler}>
              <input
                placeholder="Enter your message"
                onChange={onChangeMsgHandler}
                value={msg}
              />
              <button type="submit">send</button>
            </form>
          </div>
        ) : (
          <div className="login-box">
            <div className="login-title">
              <img src={logo} width="40px" height="40px" alt="logo" />
              <div>WebChat</div>
            </div>
            <form className="login-form" onSubmit={onSubmitHandler}>
              <input
                placeholder="Enter your ID"
                onChange={onChangeUserIdHandler}
                value={userId}
              />
              <button type="submit">Login</button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;

/*

1. new Websocket()을 사용해 웹 소켓 객체를 초기화하고 연결한다. 웹 소켓 서버를 5000번 포트로 만들 예정.
    따라서 localhost:5000을 연결 주소로 입력했다.

    const WebSocket = new WebSocket("ws://localhost:5000");

  네이티브(native) 기능이기 때문에 서버처럼 별도의 모듈을 추가하는 작업은 필요하지 않다. 주의할 점은
  연결할 소켓 주소에 ws: 를 붙인다는 것이다. ws는 웹소켓을 의미한다. ws://[호스트주소]:[포트번호]로 소켓을 연결한다.


2. WebChat에 필요한 상태 변수들을 정의한다.

    const [msgList, setMsgList] = useState([]);
  메시지 내용은 배열 형태로 저장하고 리스트를 이용해서 차례로 출력한다.

3. useEffect()를 이용해서 웹 소켓의 메소드를 정의힌다.
  - onopen: 처음 소켓이 연결되면 실행한다.
  - onmessage: 가장 중요한 메소드로, 서버에서 온 메시지를 받는다.
  - onclose: 소켓 연결이 종료되면 실행된다.

4. 서버에서 온 메시지를 받는다.
    const {data, id, type} = JSON.parse(e.data);
  
  JSON.parse()를 사용하는 이유는 문자열 형태로 메시지가 전송되기 때문이다.
  
    setMsgList((prev) => [
      ...prev,
      {
        msg: type === "welcome" ? `${data} joins the chat` : data,
        type: type,
        id: id,
      }
    ]);
  
  받은 메시지는 msgList의 상태로 관리된다. 넘어온 값의 type은 두 가지로 welcome과 other이다.
  welcome은 최초의 진입 메시지이다. other은 남에게 받은 메시지를 오른쪽에 나타내기 위해 사용한다.


5. 자동으로 스크롤을 내리도록 한다. scrollIntoView()를 이용해서 손쉽게 구현할 수 있다.

    messageEndRef.current?.scrollIntoView({behavior: "smooth"});


6. 로그인 할 때 아이디를 입력한 후 Login 버튼을 클릭하면 실행된다.

    const sendData = {
      thype: "id",
      data: "userId",
    };
    webSocket.send(JSON.stringfy(sendData));
    setIsLogin(true);

  웹소켓의  send() 메소드는 서버로 메시지를 전송할 때 사용된다. 우리가 전송할 내용은 type과 사용자 아이디이다.
  또한 데이터는 문자열로 관리되기 때문에 JSON.stringfy()로 변환한 후 전송했다.


7. 아이디를 입력을 관리하는 함수


8. send 버튼을 누르면 실행된다.
    
    const sendData = {
      type: "msg",
      data: msg,
      id: userId,
    };

    webSocket.send(JSON.stringfy(sendData));
    setMsgList((prev) => [...prev, {msg : msg}, type: "me", id: userId]);
    setMsg("");

  내가 보낸 메시지가 다른 사람들에게 모두 전송되기 위해서 send() 메소드로 내용을 전송했다. 마지막으로 setMsgList()로 현재 입력된 메시지를 바로 화면에 출력했다.
  
9. 메시지를 입력할 때 실행된다.
10. isLogin이라는 값으로 로그인 화면인지 채팅화면인지 구분.
  
  

--> cd client 이후 npm run start



*/
