// 1
const http = require("http");
const fs = require("fs").promises;
const url = require("url");

// 2
const server = http
  .createServer(async (req, res) => {
    // 3
    const pathname = url.parse(req.url).pathname;
    const method = req.method;
    let data = null;

    // 4
    if (method === "GET") {
      switch (pathname) {
        case "/":
          res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
          data = await fs.readFile("./index.html");
          res.end(data);
          break;
        default:
          res.writeHead(400, { "Content-Type": "text/html; charset=utf-8" });
          data = await fs.readFile("./index.html");
          res.end(data);
      }
    }
  })
  .listen(5000);

// 5
server.on("listening", () => {
  console.log("5000 port is running");
});

// 6
server.on("error", (err) => {
  console.log(err);
});

/*
1. nodejs에서는 require라는 문법을 이용해서 모듈과 라이브러리를 블러올 수 있다. 
    - http: 기본 모듈로 웹 서버를 만들 때 사용한다.
    - fs: 파일을 읽을 때 사용한다.
    - url: 요청 url을 파싱하여 간단하게 사용할 수 있도록 한다.

    실무에서는 http모듈보다 express라는 외부 모듈을 자주 사용한다. express 모듈을 사용하면 더 간결하게 웹서버의 기능을 사용할 수 있다.

2. http.createServer() 메소드를 이용하여 서버를 만든다. 아래의 listen(5000) 메소드를 이용해서 5000번 포트로 서버를 생성한다.
    .listen(5000);

3. url.parse()라는 메소드를 이용해서 접속한 url 정보를 파싱한다.
    console.log(url.parse(req.url));
        -->
        Url {
            protocol: null,
            slashes: null,
            auth: null,
            host: null,
            port: null,
            hostname: null,
            hash: null,
            search: null,
            query: null,
            pathname: '/',
            path: '/',
            href: '/'
        }


4. method 값을 이용해서 'GET'으로 넘어온 경우 분기문 안에 들어가도록 했다.
        
    const method = req.method;

    node 서버가 제공하는 req 객체에는 요청에 해당핳는 다양한 정보가 들어 있다. 기본적으로 HTTP프로토콜과 REST API를 이용한 웹 서비스를 만들기 때문에
    req 객체를 이용해 다양한 기능 구현이 가능하다.

5. 서버에 최초에 진입할 때 실행되는 함수.
6. 서버에 오류가 발생했을 때 실행됨.


*/
