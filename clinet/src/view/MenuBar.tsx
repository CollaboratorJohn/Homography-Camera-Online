import React from 'react'
import { Layout, Menu } from 'antd';
import axios from 'axios'

const { Header, Content, Sider } = Layout
interface Props {
    list: Array<{key: string, label: string}>,
    current_key: string,
    stateChange: Function
}

export default class MenuBar extends React.Component<Props,{}> {
    constructor(props:any) {
        super(props)
        this.state = {
            key: this.props.list[0].key,
            label: this.props.list[0].label
        }
    }

    async componentDidMount() {
        try {
            const res = await axios.get('/api/permission/');
            if (res.status === 401) {
                window.location.replace('/login')
                return;
            }
        } catch (error) {
            window.location.replace('/login')
        }
    }

    render():JSX.Element {
        return (
            <Header className='header'>
                <Menu theme='dark'
                    mode='horizontal'
                    selectedKeys={[this.props.current_key]}
                    items={this.props.list}
                    onClick={ ({key}) => {
                        this.props.stateChange(key)
                    }
                }
                ></Menu>
            </Header>
        )
    }
}