import { Layout, Button } from "antd"
import { ArrowUpOutlined, ArrowDownOutlined, ArrowLeftOutlined, ArrowRightOutlined, ReloadOutlined} from '@ant-design/icons'
import React from 'react';
import flv from 'flv.js'
import PTZControl from "./control";
import axios from 'axios'
const { Content, Sider } = Layout

interface Props {
    video_url: string
}

export default class VideoControl extends React.Component<Props, {}> {
    constructor(props:any) {
        super(props)
        this._video = React.createRef()
        this._canvas = React.createRef()
        this.clock = this.clock.bind(this)
        this.killVideoStream = this.killVideoStream.bind(this)
        this.startVideoStream = this.startVideoStream.bind(this)
        this.capture = this.capture.bind(this)
    }

    // indicates the video tag
    _video: any
    _canvas: any

    // indicates the flv player entity
    player: flv.Player | null = null

    // make sure the video is real time when checkout the tag and back
    realtime_sentinel: number | null = null

    // kill video stream and sentinal
    killVideoStream() {
        if (this.player) {
            this.player.pause();
            this.player.unload();
            this.player.detachMediaElement();
            this.player.destroy();
            this.player= null;
        }
        if(this.realtime_sentinel) {
            clearInterval(this.realtime_sentinel)
            this.realtime_sentinel = null
        }
    }

    startVideoStream() {
        // recreate player
        this.player = flv.createPlayer({
            type: 'flv',
            isLive: true,
            url: `ws://${window.location.hostname}:8001/vid/rtsp/1/?url=${this.props.video_url}`
        }, {
            enableStashBuffer: false,
            fixAudioTimestampGap: false,
            isLive: true,
            lazyLoad: true,
            autoCleanupSourceBuffer: true
        })

        //error handler
        this.player?.on(flv.Events.ERROR,
            (errorType: any, errorDetail: any, errorInfo: any):void => {
                console.log("errorType:", errorType);
                console.log("errorDetail:", errorDetail);
                console.log("errorInfo:", errorInfo);
                // deconstruct if this.player exist and problems occur
                this.killVideoStream()
            }
        )

        this.player.attachMediaElement(this._video.current)
        this.player.load()

        // create realtime sentinel
        this.player.play()
        this.realtime_sentinel = setInterval(this.clock(), 5000)
    }

    // where activates sentinel
    clock():Function {
        var lastTime: number|undefined = lastTime 
        let self = this
        let sentinel:Function = lastTime ? function():void {
            lastTime = 0
        } : function():void {
            if (self.player?.buffered.length) {
                console.log(lastTime, self.player.currentTime)
                if(lastTime !== undefined && self.player.currentTime - lastTime < 1) {
                    self.killVideoStream()
                    self.startVideoStream()
                    lastTime = undefined
                    return
                }
                lastTime = self.player.currentTime
            }
        }
        return sentinel
    }

    // capture photo
    capture() {
        let canvas = this._canvas.current;
        let video = this._video.current;
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas.getContext('2d').drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
        // canvas.toBlob(resolve, 'mime/jpeg',0.8)
        // console.log(canvas.toDataURL('image/jpeg'))

        // const base64ToBlob = function(code:string):Blob {
        //     let parts = code.split(';base64,');
        //     let contentType = parts[0].split(':')[1];
        //     let raw = window.atob(parts[1]);
        //     let rawLength = raw.length;
        //     let uInt8Array = new Uint8Array(rawLength);
        //     for(let i = 0; i < rawLength; ++i) {
        //         uInt8Array[i] = raw.charCodeAt(i);
        //     }
        //     return new Blob([uInt8Array], {
        //         type: contentType
        //     });
        // };

        axios.put('/api/capture',{
            time: Number(Date.now()),
            img: canvas.toDataURL('image/jpeg')
        })
        // let blob = base64ToBlob(canvas.toDataURL('image/jpeg')); //new Blob([content]);
        // let aLink = document.createElement('a');
        // let evt = document.createEvent("HTMLEvents");
        // evt.initEvent("click", true, true);
        // const tag = String(Date.now())
        // aLink.download = tag + '.jpg';
        // aLink.href = URL.createObjectURL(blob);
        // aLink.click();

        // // save blob to sessionStorage
        // sessionStorage.setItem(tag, String(canvas.toDataURL('image/jpeg')))
    }
    
    componentDidMount() {
        // console.log('mnt')
        if(this.props.video_url !== '') {
            try {
                // deconstruct if this.player exist and problems occur
                this.killVideoStream()
                this.startVideoStream()
            } catch(error) {
                console.log(error)
            }
        }
    }

    // when props(camera) changes, the onplay video changes
    componentDidUpdate() {
        try {
            // deconstruct if this.player exist and problems occur
            this.killVideoStream()
            this.startVideoStream()
        } catch(error) {
            console.log(error)
        }
    }

    // destroy video player entity
    componentWillUnmount() {
        this.killVideoStream()
    }

    render() {
        return (
            <Layout>
                <Content>
                    <div className='video-area'>
                        <canvas className="relative full-area"
                            ref={this._canvas}
                        ></canvas>
                        <video className="absolute full-area"
                            ref={this._video}
                        ></video>
                    </div>
                </Content>
                <Sider theme='light'>
                    <div className='title align-mid'>Control Menu</div>
                    <div className='order'>
                        <div className='function-area'>
                            <div>Position adjustment</div>
                            <div className='button-set'>
                                <Button type="primary" icon={<ArrowUpOutlined rotate={-45}/>} onClick={PTZControl(this.props.video_url,'7')} size='large' />
                                <Button type="primary" icon={<ArrowUpOutlined />} onClick={PTZControl(this.props.video_url,'8')} size='large' />
                                <Button type="primary" icon={<ArrowUpOutlined rotate={45} />} onClick={PTZControl(this.props.video_url,'9')} size='large' />
                                <Button type="primary" icon={<ArrowLeftOutlined />} onClick={PTZControl(this.props.video_url,'4')} size='large' />
                                <Button type="primary" icon={<ReloadOutlined />} onClick={PTZControl(this.props.video_url,'5')} size='large' />
                                <Button type="primary" icon={<ArrowRightOutlined />} onClick={PTZControl(this.props.video_url,'6')} size='large' />
                                <Button type="primary" icon={<ArrowDownOutlined rotate={45} />} onClick={PTZControl(this.props.video_url,'1')} size='large' />
                                <Button type="primary" icon={<ArrowDownOutlined />} onClick={PTZControl(this.props.video_url,'2')} size='large' />
                                <Button type="primary" icon={<ArrowDownOutlined rotate={-45} />} onClick={PTZControl(this.props.video_url,'3')} size='large' />
                            </div>
                            <div>Len adjustment</div>
                            <div className='distort-rect'>
                                <div className='btn-set'>
                                    <Button type="primary" onClick={PTZControl(this.props.video_url,'FOCUS+')}>FOCUS+</Button>
                                    <Button type="primary" onClick={PTZControl(this.props.video_url,'FOCUS-')}>FOCUS-</Button>
                                </div>
                                <div className='btn-set'>
                                    <Button type="primary" onClick={PTZControl(this.props.video_url,'IRIS+')}>IRIS+</Button>
                                    <Button type="primary" onClick={PTZControl(this.props.video_url,'IRIS-')}>IRIS-</Button>
                                </div>
                                <div className='btn-set'>
                                    <Button type="primary" onClick={PTZControl(this.props.video_url,'ZOOM+')}>Zoom+</Button>
                                    <Button type="primary" onClick={PTZControl(this.props.video_url,'ZOOM-')}>Zoom-</Button>
                                </div>
                            </div>
                            <div>Capture photo</div>
                            <div className='capture-photo'>
                                <div className='btn-set'>
                                    <Button type="primary" onClick={this.capture}>Capture</Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </Sider>
            </Layout> 
        )
    }
}