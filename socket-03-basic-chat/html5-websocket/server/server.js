// 1
const WebSocket = require("ws");

// 2
const wss = new WebSocket.Server({ port: 5000 });

// 3
wss.on("connection", (ws) => {
  // 4
  const broadCastHandler = (msg) => {
    wss.clients.forEach(function each(client, i) {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(msg);
      }
    });
  };

  // 5
  ws.on("message", (res) => {
    const { type, data, id } = JSON.parse(res);
    switch (type) {
      case "id":
        broadCastHandler(JSON.stringify({ type: "welcome", data: data }));
        break;
      case "msg":
        broadCastHandler(JSON.stringify({ type: "other", data: data, id: id }));
        break;
      default:
        break;
    }
  });

  ws.on("close", () => {
    console.log("client has disconnected");
  });
});

/*

1. ws 모듈을 추가한다.

2. ws 모듈을 이용해 5000번 포트로 접속할 수 있는 웹 소켓 서버를 생성한다.
    const wss = new WebSocket.Server({port: 5000});

3. ws 모듈에서 on()을 이용해 connection, message, close와 같은 상태를 확인할 수 있다.

4. ws 모듈은 접속한 사용자에게 동일한 메시지를 출력하기 위한 broadcast라는 메소드를 정의하고 있지 않다.
   그래서 브로드캐스트 기능을 하는 broadCastHandler()라는 함수를 정의했다. 내가 보낸 메시지를 내가 다시 받지 않기 위해
   조건문에 client !== ws를 추가했다.

    if (client != ws && client.readyState === WebSocket.OPEN) {
        client.send(msg);
    }

5. 클라이언트에서 오는 메시지를 수신한다. switch문을 이용해서 클라이언트에서 오는 정보를 구분한다.
   id로 온다면 최초 메시지는 welcome 메시지이다. 수신한 메시지는 우리가 정의한 broadCastHandler() 함수를 이용해서 다른 사용자에게 전달된다.



--> cd server에서 npm run start로 시작



*/
