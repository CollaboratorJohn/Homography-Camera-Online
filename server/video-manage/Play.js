var expressWebSocket = require('express-ws')
var ffmpeg = require('fluent-ffmpeg')
const WebSowebSocketStream = require("websocket-stream/stream");

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
            .addInputOption("-rtsp_transport", "tcp", "-buffer_size", "102400")
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

function initVideoCallback(app, path) {
    expressWebSocket(app, null, {
        perMessageDeflate: true
    });
    app.ws("/rtsp/:id/", videoRequestHandler)
    ffmpeg.setFfmpegPath(path)
}

module.exports = { initVideoCallback }