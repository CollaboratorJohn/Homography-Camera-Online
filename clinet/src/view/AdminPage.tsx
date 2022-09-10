import React from 'react'
import { Button, Layout, message } from 'antd';
import { PlusOutlined, CloseOutlined } from '@ant-design/icons'
import MenuBar from './MenuBar';
import VideoRectify from './VideoRectify';
import VideoLabel from './VideoLabel';
import './Page.css'
import { Route, Switch, Redirect } from 'react-router-dom';
import VideoControl from './VideoControl';
import store from '../store/store'
import { onAdd, onRemove } from '../store/action';

const { Content, Sider } = Layout

interface State {
    key: string,
    // videolist: Array<string>
}

class AdminPage extends React.Component<{},State> {
    constructor(props:any) {
        super(props)
        this.state = { key: window.location.pathname !== '/admin' ? 
        window.location.pathname.split('/').slice(-1)[0] :
        'vid_ctrl'
        }
        this.changeState = this.changeState.bind(this)
        this.addVideo = this.addVideo.bind(this)
    }
    
    componentDidMount() {
        // subscribe events
        store.subscribe(() => {
            console.log(store.getState())
            this.forceUpdate()
        })
    }

    componentWillUnmount() {
        // unsubscribe
        store.subscribe(() =>
            console.log(store.getState())
        )()
    }

    changeState(_key: string): void {
        this.setState({
          key: _key
        })
    }

    addVideo():void {
        if(store.getState().camera !== '' ) {
            message.warning('当前系统只支持新增一个摄像头')
            return
        }
        store.dispatch(onAdd('rtsp://admin:Abcd12345678@3.1.200.196:554/h265/ch33/main/av_stream'))
    }

    render() {
        return (
            <Layout>
                <MenuBar 
                    current_key = { this.state.key }
                    list = {
                        [
                            {key:'vid_ctrl', label:'Camera control'},
                            {key:'vid_rect', label:'Rectify video'},
                            {key:'vid_label', label:'Label video'},
                        ]
                    }
                    path = '/admin'
                    stateChange = { this.changeState }/> 
                <Layout>
                    <Sider theme='light'>
                        <div className='title align-mid'>Camera list</div>
                        <div className='order'>
                            <div className='camara-list'>
                                {
                                    store.getState().camera_list.map(
                                        (item:string, index:number): JSX.Element => {
                                            return (
                                            <div className='camara-list-item' key={item}>
                                                <div className='camara-selected'>{'Camera'+index}</div>
                                                <CloseOutlined onClick={
                                                    () => {
                                                        store.dispatch(onRemove('rtsp://admin:Abcd12345678@3.1.200.196:554/h265/ch33/main/av_stream'))
                                                    }
                                                }/>
                                            </div>
                                            )
                                        }
                                    )
                                }
                            </div>
                            <Button type='primary' icon={<PlusOutlined/>
                            } onClick={()=>{
                                this.addVideo()
                            }}>Add new Camera</Button>
                        </div>
                    </Sider>
                    <Content>
                        <Switch>
                            <Route path='/admin' exact render={()=> (
                                <Redirect to='/admin/vid_ctrl'/>
                            )}/>
                            <Route path={'/admin/vid_ctrl'} render ={
                                ():JSX.Element => 
                                <VideoControl video_url={store.getState().camera}/>
                            }></Route>
                            <Route path={'/admin/vid_rect'} component={VideoRectify}></Route>
                            <Route path={'/admin/vid_label'} component={VideoLabel}></Route>
                        </Switch>
                    </Content>      
                </Layout>
            </Layout>
        )
    }
}

export default AdminPage