// code mirror
import CodeMirror from "@uiw/react-codemirror";
import langConfig from './langConfig'

import axios from 'axios'
import { Layout, Tabs, notification, Button, Select, Radio, Space, Popover, message } from "antd"
import React from 'react'
import socket from "../../utli/socketIO";

import store from '../../store/store'
import { onSaveState } from '../../store/action';

const { Content, Sider } = Layout
const { TabPane } = Tabs;
const { Option } = Select;

interface State {
    codeonedit: string,
    codeupload: string,
    title: string
}

let children:React.ReactNode[] = ['1', '2', '3', '4', '5'].map(item => {
    return <Option key={item}>{item}</Option>
})

export default class VideoLabel extends React.Component<{}, State> {
    // socket = io(`http://${window.location.host}/`, { path:'/assist' });

    updateCode():void {
        if(this.state.title === '') {
            message.info('Code invalid!')
            return
        }
        socket.emit('uploadCode',{
            code:this.state.codeonedit,
            title:this.state.title
        })
        console.log(this.state.codeonedit)
    }

    titleChange(value: string):void {
        axios.post('/api/title', {
            title: value
        }).then(res => {
            this.setState({
                codeupload: res.data,
                codeonedit: '',
                title: value
            })
        }, err => {
            console.log(err)
        })
    }

    constructor(props:any) {
        super(props)
        socket.on('notification', (notif:{title: string, description: string}) => {
            notification.config({
                duration: 2
            })
            notification.open({
                message: notif.title,
                description: notif.description
            })
            
        })
        
        // Code update (passive)
        socket.on('code', ((newcode:{code:string,title:string}) => {
            if(newcode.title === this.state.title) {
                this.setState({
                    codeupload: newcode.code
                })
            }
            notification.open({
                message: 'notice',
                description: `Assistant${newcode.title}'s Online code has been updated`
            })
        }))

        this.state = {
            codeonedit:'',
            codeupload:'',
            title:'1'
        }

        this.updateCode = this.updateCode.bind(this)
        this.titleChange = this.titleChange.bind(this)
    }
        
    componentDidMount() {
        // default load 1 state
        this.titleChange('1')
        
        // the first time, init code redux store
        if(!store.getState().code_page_state) {
            store.dispatch(onSaveState(this.state))            
        } else {
            this.setState(store.getState().code_page_state)
        }
        // subscrisbe events
        store.subscribe(() => {
            console.log(store.getState())
        })

        this.setState(store.getState()?.code_page_state)
    }

    componentWillUnmount() {
        // save current state 
        store.dispatch(onSaveState(this.state))

        // unsubscribe
        store.subscribe(() =>
            console.log(store.getState())
        )()
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
                                        extensions={[langConfig()]}
                                        readOnly
                                    />         
                                </div>                            
                            </TabPane>
                            <TabPane tab="协同者" key="2">
                                <div className='editor'>
                                    <CodeMirror
                                        value={this.state.codeonedit}
                                        className='text'
                                        extensions={[langConfig()]}
                                        onChange = { value => this.setState({codeonedit:value}) }
                                    />
                                </div>
                            </TabPane>
                        </Tabs>                        
                    </div>
                </Content>
                <Sider theme='light'>
                    <div className='title'>标注选项</div>
                    <div className='order'>
                        <Button onClick={this.updateCode} type='primary' style={{margin:'10px',display:'block'}}>Summit Code</Button>
                        <Select
                        value={this.state.title}
                        style={{margin:'10px',display:'block'}}
                        onChange={this.titleChange}>{children}</Select>
                        <Popover content={
                           <div>
                                <h1>Unfinished!</h1>
                                <p>When activate local file attachment,</p>
                                <p>online editor will be deactivaed while </p>
                                <p> you could debug offline with VSCode.</p>
                                <p>Your local file will be uploaded automatically.</p>
                            </div> 
                        }
                        placement="left">
                          <Radio.Group value={1} style={{margin: '10px'}}>
                            <Space direction="vertical">
                                <Radio value={1}>Online Edit</Radio>
                                <Radio value={2}>Attach to local file</Radio>
                            </Space>                           
                        </Radio.Group>   
                        </Popover>
                        
                    </div>
                </Sider>
            </Layout>
        )
    }
}