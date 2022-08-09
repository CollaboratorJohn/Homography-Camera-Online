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
        // this.PTZControl = this.PTZControl.bind(this)
    }

    _video: any
    player: flv.Player | null = null

    // when props(camera) changes, the onplay video changes
    componentDidUpdate() {
        console.log(process.env.REACT_APP_API)
        try {
            this.player?.destroy()
            this.player = flv.createPlayer({
                type: 'flv',
                isLive: true,
                url: `ws://localhost:9000/vid/rtsp/1/?url=${this.props.video_url}`
            })
            this.player.attachMediaElement(this._video.current)
            this.player.load()
        } catch(error) {
            console.log(error)
        }
    }

    // destroy video player entity
    componentWillUnmount() {
        this.player?.destroy()
    }

    render() {
        return (
            <Layout>
                <Content>
                    <div className='video-area'>
                        <video ref={this._video} autoPlay={true}></video>
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