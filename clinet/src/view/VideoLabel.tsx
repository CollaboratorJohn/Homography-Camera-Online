import { Layout } from "antd"
import React, { Component, Fragment } from 'react';
const { Header, Content, Sider } = Layout

export default class VideoLabel extends React.Component {
    render() {
        return (
            <Layout>
                <Content></Content>
                <Sider theme='light'>
                    <div className='title'>标注选项</div>
                    <div className='order'>
                        <div className='function-title'></div>
                        <div className='function-title'></div>
                    </div>
                </Sider>
            </Layout>
        )
    }
}