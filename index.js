const fs = require("fs");
const http = require("http");

const types = {
  html: "text/html",
  js: "text/javascript",
  css: "text/css",
  png: "image/png"
};

http.createServer((req, res) => {
  if (req.method === "GET") {
    function response(url, type) {
      fs.readFile(url, (err, data) => {
        if (err) {
          res.writeHead(404, { "Content-Type": "text/plain" });
          res.end("404 Not Found");
        } else {
          res.writeHead(200, { "Content-Type": type });
          res.end(data);
        }
      });
    }
    switch (req.url) {
      case "/":
        response("./index.html", types.html);
        break;
      default:
        const extension = /\.(?<extension>[A-Za-z0-9]+)$/.exec(req.url).groups.extension;
        if (extension in types) {
          response(`./public${req.url}`, types[extension]);
        } else {
          res.writeHead(415, { "Content-Type": "text/plain" });
          res.end("415 Unsupported Media Type");
        }
    }
  } else if (req.method === "POST") {
    let body = "";
    req.on("data", chunk => body += chunk);
    req.on("end", () => {
      body = JSON.parse(body);
      fs.readFile("./data.json", (err, data) => {
        if (err) {
          res.writeHead(404, { "Content-Type": "text/plain" });
          res.end("404 Not Found");
        } else {
          data = JSON.parse(data);
          switch (req.url) {
            case "/login":
              if (body.username in data.usr && body.password == data.usr[body.username].password) {
                fs.readFile("logged-in.html", (err, data) => {
                  if (err) {
                    res.writeHead(404, { "Content-Type": "text/plain" });
                    res.end("404 Not Found");
                  } else {
                    res.writeHead(200, { "Content-Type": "text/html" });
                    res.end(data);
                  }
                })
              } else {
                res.writeHead(403, { "Content-Type": "text/plain" });
                res.end("403 Forbidden");
              }
              break;
            default:
              res.writeHead(404, { "Content-Type": "text/plain" });
              res.end("404 Not Found");
          }
        }
      });
    });
  }
})
  .listen(3000);