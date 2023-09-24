const fs = require('fs')
const express = require('express')
const logger = require('morgan')
const { default: helmet } = require('helmet')

const app = express()

app.use(logger('dev'))
app.use(helmet())

app.get("/", (req, res) =>{
    res.sendFile(__dirname + "/index.html");
}); 

app.get("/video", (req, res) => {
    const range = '1MB';
    if (!range) {
        res.status(400).send("Requires Range header");
    }
    const videoPath = "video.mp4";
    const videoSize = fs.statSync("video.mp4").size;

    const CHUNK_SIZE = 10 ** 6;
    const start = Number(range.replace(/\D/g, ""));
    const end = Math.min(start + CHUNK_SIZE, videoSize - 1);
    const contentLength = end - start + 1;
    const headers = {
        "Content-Range": `bytes ${start}-${end}/${videoSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": contentLength,
        "Content-Type": "video/mp4",
    };
    res.writeHead(206, headers);
    const videoStream = fs.createReadStream(videoPath, { start, end });
    videoStream.pipe(res);
});

app.listen(8000, function () {
    console.log("Listening on port 8000!");
});