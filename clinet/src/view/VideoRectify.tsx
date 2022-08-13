import { Layout } from "antd"
import React from 'react';
const { Content, Sider } = Layout

export default class VideoRectify extends React.Component {
    render() {
        return (
            <Layout>
                <Content>
                    <h1>Unfinish!</h1>
                </Content>
                <Sider theme='light'>
                    <div className='title'>校正选项</div>
                    <div className='order'>
                            
                        <div className='function-title'><h1>Unfinish!</h1></div>
                        <div className='function-title'></div>
                    </div>
                </Sider>
            </Layout>
        )
    }
}