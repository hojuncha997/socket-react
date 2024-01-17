const net = require("net");

// 1
const socket = net.connect({ port: 5000 });
socket.on("connect", () => {
  console.log("connected to server!");

  // 2
  setInterval(() => {
    socket.write("Hello");
  }, 1000);
});

// 3
socket.on("data", (chunk) => {
  console.log("From Server : " + chunk);
});

// 4
socket.on("end", () => {
  console.log("disconnected.");
});

socket.on("error", () => {
  console.log(err);
});

// 5
socket.on("timeout", () => {
  console.log("connection timeout.");
});

/*
1. connect()를 사용해 5000번 포트의 서버에 접속을 시도
2. 1초 간격으로 서버에 "Hello." 메시지 요청
3. "data"구분자로 서버에서 오는 데이터를 수신
4. 서버 연결이 끊어질 때 응답
5. 연결이 지연될 때 출력

*/
