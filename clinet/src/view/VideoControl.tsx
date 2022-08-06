import { Layout, Button } from "antd"
import { ArrowUpOutlined, ArrowDownOutlined, ArrowLeftOutlined, ArrowRightOutlined, ReloadOutlined} from '@ant-design/icons'
import React from 'react';
const { Content, Sider } = Layout

export default class VideoControl extends React.Component {
    render() {
        return (
            <Layout>
                <Content></Content>
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