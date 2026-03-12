const { createServer } = require("https");
const { parse } = require("url");
const next = require("next");
const fs = require("fs");

// CSRF 토큰을 cookie에서 꺼내 쓰기 위해, 개발 환경에서도 https로 보이도록 프록시 처리하기 위한 서버 파일입니다. 

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

const httpsOptions = {
	key: fs.readFileSync("./localhost-key.pem"),
	cert: fs.readFileSync("./localhost.pem"),
};

app.prepare().then(() => {
	createServer(httpsOptions, (req, res) => {
		const parsedUrl = parse(req.url, true);
		handle(req, res, parsedUrl);
	}).listen(3000, (err) => {
		if (err) throw err;
		console.log("> Ready on https://localhost:3000");
	});
});
