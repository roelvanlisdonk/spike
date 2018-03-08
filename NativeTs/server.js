"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http = require("http");
const fs = require("fs");
const path = require("path");
const livereload = require("livereload");
const currentFolder = __dirname;
const currentFile = __filename;
http.createServer(function handleRequest(request, response) {
    let url = request.url || "/";
    if (url[0] === "~") {
        url = url.substring(1) || "/";
    }
    if (url.length >= 2 && url[0] === "/" && url[1] === "~") {
        url = url.substring(2) || "/";
    }
    // Remove version number from string.
    url = url.replace(/\/v-.*\//i, "/");
    let filePath = "." + url;
    if (filePath == "./") {
        filePath = "./index.html";
    }
    filePath = path.join(currentFolder, filePath);
    console.log(`filePath [${filePath}]`);
    // Only serve well known types for security.
    const extname = String(path.extname(filePath)).toLowerCase();
    const mimeTypes = {
        ".html": "text/html",
        ".js": "text/javascript",
        ".css": "text/css",
        ".json": "application/json",
        ".png": "image/png",
        ".jpg": "image/jpg",
        ".gif": "image/gif",
        ".wav": "audio/wav",
        ".mp4": "video/mp4",
        ".woff": "application/font-woff",
        ".ttf": "application/font-ttf",
        ".eot": "application/vnd.ms-fontobject",
        ".otf": "application/font-otf",
        ".svg": "application/image/svg+xml"
    };
    const contentType = mimeTypes[extname] || "application/octet-stream";
    fs.readFile(filePath, function (error, content) {
        if (error) {
            console.log(`error code [${error.code}] code [${error.message}]`);
            if (error.code == "ENOENT") {
                fs.readFile("./404.html", function (error, content) {
                    response.writeHead(200, { "Content-Type": contentType });
                    response.end(content, "utf-8");
                });
            }
            else {
                response.writeHead(500);
                response.end("Sorry, check with the site admin for error: " + error.code + " ..\n");
                response.end();
            }
        }
        else {
            response.writeHead(200, { "Content-Type": contentType });
            response.end(content, "utf-8");
        }
    });
}).listen(8125);
console.log("Server running at http://127.0.0.1:8125/");
const lrserver = livereload.createServer();
lrserver.watch(__dirname);
console.log("Livereload server running at port: 35729");
//# sourceMappingURL=server.js.map