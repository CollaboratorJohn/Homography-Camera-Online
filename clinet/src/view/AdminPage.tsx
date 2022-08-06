import React from 'react'
import { Layout, Menu } from 'antd';
import axios from 'axios'
import MenuBar from './MenuBar';
import VideoRectify from './VideoRectify';
import VideoLabel from './VideoLabel';
import './Page.css'
import { withRouter } from 'react-router'
import { Route, BrowserRouter as Router, Switch, Redirect } from 'react-router-dom';
import VideoControl from './VideoControl';

const { Header, Content, Sider } = Layout

interface State {
    key: string
}

class AdminPage extends React.Component<{},State> {
    constructor(props:any) {
        super(props)
        this.state = { key: 'vid_ctrl' }
        this.changeState = this.changeState.bind(this)
    }

    changeState(key:string):void {
        console.log('x')
        this.setState({
          key: key
        })
    }

    render() {
        return (
            <Layout>
                <MenuBar 
                    current_key = { this.state.key }
                    list = {
                        [
                            {key:'vid_ctrl',label:'摄像头控制'},
                            {key:'vid_rect',label:'视频校正'},
                            {key:'vid_label',label:'视频标注'},
                        ]
                    }
                    path = '/admin'
                stateChange = { this.changeState }/> 
                <Layout>
                    <Sider theme='light'>
                        <div className='title'>摄像头列表</div>
                        <div style={{height:'100%'}}></div>
                    </Sider>
                    <Content>
                        <Switch>
                            <Route path={'/admin/vid_ctrl'} component={VideoControl}></Route>
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