const NodeMediaServer  = require('node-media-server');

const config = {
  rtmp: {
    port: 1935,
    chunk_size: 60000,
    gop_cache: true,
    ping: 60,
    ping_timeout: 30
  },

  http: {
    port: 8000,
    allow_origin: '*'
  },

  relay: {
    ffmpeg: 'D:\\ffmpeg-4.3.1-win64-static\\bin\\ffmpeg.exe',
    tasks: [
        {
            //应用名称
            app: 'live',
            //工作模式 静态即可
            mode: 'pull', // 静态static
            //中继地址
            edge: 'rtsp://admin:Abcd12345678@3.1.200.196:554/h265/ch33/main/av_stream',
            //访问资源名称
            name: 'rtsp',
            //传输协议
            rtsp_transport : 'tcp',  //['udp', 'tcp', 'udp_multicast', 'http']
        }
    ]
  },

};

var nms = new NodeMediaServer(config)
nms.run();
