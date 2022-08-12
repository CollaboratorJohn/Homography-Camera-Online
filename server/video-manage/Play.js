var expressWebSocket = require('express-ws')
var ffmpeg = require('fluent-ffmpeg')
const WebSowebSocketStream = require("websocket-stream/stream")
const express = require('express')

function videoRequestHandler(ws, req) {
    const stream = WebSowebSocketStream(ws,
    {
        binary: true,
        browserBufferTimeout: 10
    },
    {
        browserBufferTimeout: 10
    })
    let url = req.query.url
    console.log(url)

    try {
        ffmpeg(url)
            .addInputOption("-rtsp_transport", "udp", "-buffer_size", "102400")
            .on("start", function () {
                console.log(url, "Stream started.");
            })
            .on("codecData", function () {
                console.log(url, "Stream codecData.")
            })
            .on("error", function (err) {
                console.log(url, "An error occured: ", err.message);
            })
            .on("end", function () {
                console.log(url, "Stream end!");
            })
            .outputFormat("flv")
            .videoCodec("libx264")
            .noAudio()
            .pipe(stream);
    } catch (error) {
        console.log(error);
    }
}

function initVideoCallback(path, VIDEO_PORT) {
    const videoapp = express()
    expressWebSocket(videoapp, null, {
        perMessageDeflate: true
    });
    videoapp.ws("/vid/rtsp/:id/", videoRequestHandler)
    ffmpeg.setFfmpegPath(path)
    videoapp.listen(VIDEO_PORT, () => console.log(`Video server listening on ${VIDEO_PORT}`))
}

// new port for video
module.exports = { initVideoCallback }