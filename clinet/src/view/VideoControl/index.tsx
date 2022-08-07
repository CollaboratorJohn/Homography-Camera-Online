import { Layout, Button } from "antd"
import { ArrowUpOutlined, ArrowDownOutlined, ArrowLeftOutlined, ArrowRightOutlined, ReloadOutlined} from '@ant-design/icons'
import React from 'react';
import flv from 'flv.js'
const { Content, Sider } = Layout

interface Props {
    video_url: string
}

export default class VideoControl extends React.Component<Props, {}> {
    constructor(props:any) {
        super(props)
        this._video = React.createRef()
    }

    _video: any
    player: flv.Player | null = null
    // when props(camera) changes, the onplay video changes
    componentDidUpdate() {
        // console.log(this.props)
        // console.log(this._video.current.src)
        // this._video.current.src= 'http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4'
        try {
            this.player?.destroy()
            this.player = flv.createPlayer({
                type: 'flv',
                isLive: true,
                url: `ws://localhost:8000/rstp/1/?url=${this.props.video_url}`
            })
            this.player.attachMediaElement(this._video.current)
            this.player.load()            
        } catch(error) {
            console.log(error)
        }
    }
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
                            <Button type="primary" icon={<ArrowUpOutlined rotate={-45}/>} size='large' />
                            <Button type="primary" icon={<ArrowUpOutlined />} size='large' />
                            <Button type="primary" icon={<ArrowUpOutlined rotate={45} />} size='large' />
                            <Button type="primary" icon={<ArrowLeftOutlined />} size='large' />
                            <Button type="primary" icon={<ReloadOutlined />} size='large' />
                            <Button type="primary" icon={<ArrowRightOutlined />} size='large' />
                            <Button type="primary" icon={<ArrowDownOutlined rotate={45} />} size='large' />
                            <Button type="primary" icon={<ArrowDownOutlined />} size='large' />
                            <Button type="primary" icon={<ArrowDownOutlined rotate={-45} />} size='large' />
                        </div>
                        <div className='function-title'>变焦调节</div>
                        <div className='distort-rect'>
                            <div className='btn-set'>
                                <Button type="primary">变焦+</Button>
                                <Button type="primary">变焦-</Button>
                            </div>
                            <div className='btn-set'>
                                <Button type="primary">光圈+</Button>
                                <Button type="primary">光圈-</Button>
                            </div>
                            <div className='btn-set'>
                                <Button type="primary">变倍+</Button>
                                <Button type="primary">变倍-</Button>
                            </div>
                        </div>
                    </div>
                </Sider>
            </Layout> 
        )
    }
}