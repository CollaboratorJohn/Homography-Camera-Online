import React from 'react'
import { Button, Layout, Menu } from 'antd';
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

    render() {
        return (
            <Layout>
                <MenuBar 
                    current_key = { this.state.key }
                    list = {
                        [
                            {key:'vid_ctrl', label:'摄像头控制'},
                            {key:'vid_rect', label:'视频校正'},
                            {key:'vid_label', label:'视频标注'},
                        ]
                    }
                    path = '/admin'
                    stateChange = { this.changeState }/> 
                <Layout>
                    <Sider theme='light'>
                        <div className='title'>摄像头列表</div>
                        <div className='order'>
                            <div className='camara-list'>
                                {
                                    store.getState().camera_list.map(
                                        (item:string, index:number): JSX.Element => {
                                            return (
                                            <div className='camara-list-item' key={item}>
                                                <div className='camara-selected'>{'摄像头'+index}</div>
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
                                store.dispatch(onAdd('rtsp://admin:Abcd12345678@3.1.200.196:554/h265/ch33/main/av_stream'))
                                // this.setState({
                                //     videolist: ['rtsp://admin:Abcd12345678@3.1.200.196:554/h265/ch33/main/av_stream']
                                // })
                            }}>新增摄像头</Button>
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