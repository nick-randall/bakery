const port = 8080;
const http = require("http");
var url = require("url");
const fs = require("fs");

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  let requestUrl = "." + url.parse(req.url).pathname;
  const fileType = requestUrl.split(".")[2];
  console.log(fileType);
  if (fileType === "css") {
    res.setHeader("Content-Type", "text/css");
  } else if (fileType === "js") {
    res.setHeader("Content-Type", "text/javascript");
  } else if (fileType === "html") {
    res.setHeader("Content-Type", "text/html");
  } else if (fileType === "png") {
    res.setHeader("Content-Type", "image/png");
  } else if (fileType === "jpeg") {
    res.setHeader("Content-Type", "image/jpeg");
  } else if (fileType === "ttf") {
    res.setHeader("Content-Type", "font/ttf");
  }
  console.log("trying to read file " + requestUrl);
  if (requestUrl === "./") {
    requestUrl = "./index.html";
  }

  fs.createReadStream(requestUrl).pipe(res);
});

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
