// 1
const net = require("net");

// 2
const server = net.createServer((socket) => {
  // 3
  socket.on("data", (data) => {
    console.log("From client:", data.toString());
  });
  //   4
  socket.on("close", () => {
    console.log("client ");
  });

  //   5
  socket.write("welcome to server");
});

server.on("error", (err) => {
  console.log("err" + err);
});

// 6
server.listen(5000, () => {
  console.log("listening on 5000");
});

/*

1. net 모듈 추가
2. createServer()를 이용해 TCP 서버 생성
3. "data"라는 구분자로 클라이언트에서 오는 값을 받는다.
4. "close"는 net모듈에 등록된 키워드로 클라이언트에서 소켓을 닫을 때 응답한다.
5. write()를 이용해 서버에서 클라이언트로 메시지를 전달한다.
6. 5000번 포트를 열고 기다린다.

*/
