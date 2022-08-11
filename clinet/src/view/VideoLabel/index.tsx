// code mirror
import CodeMirror, { ReactCodeMirrorRef } from "@uiw/react-codemirror";
import { cpp } from "@codemirror/lang-cpp"
import { xml } from "@codemirror/lang-xml"

import { Layout, Tabs, notification, Button } from "antd"
import React from 'react'
import { Base64 } from "js-base64"
import io from 'socket.io-client'
const { Content, Sider } = Layout
const { TabPane } = Tabs;

interface State {
    codeedit:string,
    codeupload:string
}
export default class VideoLabel extends React.Component<{}, State> {
    socket = io(`http://${window.location.host}/`, { path:'/assist' });

    updateCode() {
        this.socket.emit('uploadCode',this.state.codeedit)
        console.log(this.state.codeedit)
    }

    constructor(props:any) {
        super(props)
        this.socket.on('notification', (notif:{title: string, description: string}) => {
            notification.config({
                duration: 2
            })
            notification.open({
                message: notif.title,
                description: notif.description
            })
            
        })
        
        // Code update (passive)
        this.socket.on('code', (code => {
            this.setState({
                codeupload:code
            })
            notification.open({
                message: 'notice',
                description: 'Online code has been updated'
            })
        }))

        this.state = {
            codeedit:'',
            codeupload:''
        }
        this.updateCode = this.updateCode.bind(this)
    }
        
    componentDidMount() {
        this.socket.emit('login',{
            name: Base64.encode(Date.now().toString()),
            room: document.cookie.match(/(?<=(user=))(.*?)(?<=(;|$))/g)![0]
        })
    }

    render() {
        return (
            <Layout>
                <Content>
                    <div className='video-area'>
                        <Tabs defaultActiveKey="1">
                            <TabPane tab="观察者" key="1">
                                <div className='editor'>
                                    <CodeMirror
                                        value={this.state.codeupload}
                                        className='text'
                                        extensions={[cpp(),xml()]}
                                        readOnly
                                    />         
                                </div>                            
                            </TabPane>
                            <TabPane tab="协同者" key="2">
                                <div className='editor'>
                                    <CodeMirror
                                        value={this.state.codeedit}
                                        className='text'
                                        extensions={[cpp(),xml()]}
                                        onChange = { value => this.setState({codeedit:value}) }
                                    />
                                </div>
                            </TabPane>
                        </Tabs>                        
                    </div>
                </Content>
                <Sider theme='light'>
                    <div className='title'>标注选项</div>
                    <div className='order'>
                        <div className='function-title'>
                            <Button onClick={this.updateCode} type='primary'>Summit Code</Button>
                        </div>
                        <div className='function-title'></div>
                    </div>
                </Sider>
            </Layout>
        )
    }
}