import { Layout, Button } from "antd"
import { ArrowUpOutlined, ArrowDownOutlined, ArrowLeftOutlined, ArrowRightOutlined, ReloadOutlined} from '@ant-design/icons'
import React from 'react';
import flv from 'flv.js'
import PTZControl from "./control";

const { Content, Sider } = Layout

interface Props {
    video_url: string
}

export default class VideoControl extends React.Component<Props, {}> {
    constructor(props:any) {
        super(props)
        this._video = React.createRef()
        this.clock = this.clock.bind(this)
        this.killVideoStream = this.killVideoStream.bind(this)
        this.startVideoStream = this.startVideoStream.bind(this)
    }

    // indicates the video tag
    _video: any

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
            url: `ws://${window.location.host}/vid/rtsp/1/?url=${this.props.video_url}`
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
                        <video
                            ref={this._video}
                            ></video>
                    </div>
                </Content>
                <Sider theme='light'>
                    <div className='title'>云台控制</div>
                    <div className='order'>
                        <div className='function-title'>云台调节</div>
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
                        <div className='function-title'>变焦调节</div>
                        <div className='distort-rect'>
                            <div className='btn-set'>
                                <Button type="primary" onClick={PTZControl(this.props.video_url,'FOCUS+')}>变焦+</Button>
                                <Button type="primary" onClick={PTZControl(this.props.video_url,'FOCUS-')}>变焦-</Button>
                            </div>
                            <div className='btn-set'>
                                <Button type="primary" onClick={PTZControl(this.props.video_url,'IRIS+')}>光圈+</Button>
                                <Button type="primary" onClick={PTZControl(this.props.video_url,'IRIS-')}>光圈-</Button>
                            </div>
                            <div className='btn-set'>
                                <Button type="primary" onClick={PTZControl(this.props.video_url,'ZOOM+')}>变倍+</Button>
                                <Button type="primary" onClick={PTZControl(this.props.video_url,'ZOOM-')}>变倍-</Button>
                            </div>
                        </div>
                    </div>
                </Sider>
            </Layout> 
        )
    }
}