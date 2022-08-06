import React from 'react'
import { Layout, Menu } from 'antd';
import axios from 'axios'
import { Link } from 'react-router-dom';

const { Header } = Layout
interface Props {
    list: Array<{key: string, label: string}>,
    current_key: string,
    stateChange: Function,
    path: string
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
                    selectedKeys = {[this.props.current_key]}
                >
                    {
                        this.props.list.map(
                            (item:{key: string, label: string}):JSX.Element => <Menu.Item
                                key={item.key}
                                onClick={ ({key}) => {
                                    this.props.stateChange(key)
                                    }
                                }>
                                    <Link to={`${this.props.path}/${item.key}`}>{item.label}</Link>
                                </Menu.Item>
                        )
                    }
                    
                </Menu>
            </Header>
        )
    }
}