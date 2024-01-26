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
    
  }
})
  .listen(3000);