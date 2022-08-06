import { Layout } from "antd"
import React, { Component, Fragment } from 'react';
const { Header, Content, Sider } = Layout

export default class VideoControl extends React.Component {
    render() {
        return (
            <Layout>
                <Content></Content>
                <Sider theme='light'>
                    <div className='title'>云台控制</div>
                    <div style={{height:'100%'}}></div>
                </Sider>
            </Layout> 
        )
    }
}