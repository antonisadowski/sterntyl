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
          res.writeHead(404, { "content-type": "text/plain" });
          res.end("404 Not Found");
        } else {
          res.writeHead(200, { "content-type": type });
          res.end(data);
        }
      });
    }
    switch (req.url) {
      case "/":
        response("./index.html", types.html);
        break;
      case "/api/latestLinuxVersion":
        fs.readdir("./public/", (err, files) => {
          if (err) {
            res.writeHead(404, { "content-type": "text/plain" });
            res.end("404 Not Found");
          } else {
            res.writeHead(200, { "content-type": "text/plain" });
            res.end(/^sterntyl-desktop_(\d+\.\d+\.\d+)_amd64\.deb$/.exec(
              files
                .filter(file => /^sterntyl-desktop_\d+\.\d+\.\d+_amd64\.deb$/.test(file))
                .sort((a, b) => {
                  return /^sterntyl-desktop_(\d+)\.\d+\.\d+_amd64\.deb$/.exec(b)[1] - /^sterntyl-desktop_(\d+)\.\d+\.\d+_amd64\.deb$/.exec(a)[1] ||
                    /^sterntyl-desktop_\d+\.(\d+)\.\d+_amd64\.deb$/.exec(b)[1] - /^sterntyl-desktop_\d+\.(\d+)\.\d+_amd64\.deb$/.exec(a)[1] ||
                    /^sterntyl-desktop_\d+\.\d+\.(\d+)_amd64\.deb$/.exec(b)[1] - /^sterntyl-desktop_\d+\.\d+\.(\d+)_amd64\.deb$/.exec(a)[1]
                })
                [0]
            )[1]);
          }
        });
        break;
      case "/api/latestWindowsVersion":
        fs.readdir("./public/", (err, files) => {
          if (err) {
            res.writeHead(404, { "content-type": "text/plain" });
            res.end("404 Not Found");
          } else {
            res.writeHead(200, { "content-type": "text/plain" });
            res.end(/^sterntyl_(\d+\.\d+\.\d+)\.7z$/.exec(
              files
                .filter(file => /^sterntyl_\d+\.\d+\.\d+\.7z$/.test(file))
                .sort((a, b) => {
                  return /^sterntyl_(\d+)\.\d+\.\d+\.7z$/.exec(b)[1] - /^sterntyl_(\d+)\.\d+\.\d+\.7z$/.exec(a)[1] ||
                    /^sterntyl_\d+\.(\d+)\.\d+\.7z$/.exec(b)[1] - /^sterntyl_\d+\.(\d+)\.\d+\.7z$/.exec(a)[1] ||
                    /^sterntyl_\d+\.\d+\.(\d+)\.7z$/.exec(b)[1] - /^sterntyl_\d+\.\d+\.(\d+)\.7z$/.exec(a)[1]
                })
                [0]
            )[1]);
          }
        });
        break;
      default:
        const extension = /\.([A-Za-z0-9]+)$/.exec(req.url)[1];
        if (extension in types) {
          response(`./public${req.url}`, types[extension]);
        } else {
          response(`./public${req.url}`, "application/octet-stream");
        }
    }
  }
})
  .listen(3000);