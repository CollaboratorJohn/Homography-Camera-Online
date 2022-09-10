import { Layout, Menu, Radio, Space, Slider } from "antd"
import type { RadioChangeEvent } from 'antd';
import { FileImageOutlined, HighlightOutlined, ShakeOutlined } from '@ant-design/icons'
import React, { Fragment } from 'react'
import ManageLabel from './ManageLabel'

const { Content, Sider } = Layout

interface State {
    images: Array<String>
    label_mode: number
    draw_mode: number
    brush_size: number
    current_label: {
        name: string | null,
        color: string | null
    }
}

export default class VideoRectify extends React.Component<{},State> {
    constructor(props:any) {
        super(props)
        this._canvas = React.createRef()
        this.state = {
            images: [],
            label_mode: 1,
            draw_mode: 1,
            brush_size: 10,
            current_label: {name:null,color:null}
        }
        this.onSelectionModeChange = this.onSelectionModeChange.bind(this)
        this.onDrawModeChange = this.onDrawModeChange.bind(this)
        this.onBrushSizeChange = this.onBrushSizeChange.bind(this)
        this.changeCurrentLabel = this.changeCurrentLabel.bind(this)
    }

    _canvas:any

    componentDidMount() {
        this.setState({
            images: Object.keys(sessionStorage).map(item => {
                    var date = new Date(Number(item)); 
                    var Y = date.getFullYear()
                    var M = date.getMonth()+1
                    var D = date.getDate()
                    var h = date.getHours()
                    var m = date.getMinutes()>=10 ? date.getMinutes():"0"+date.getMinutes()
                    var s = date.getSeconds()>=10 ? date.getSeconds():"0"+date.getSeconds()
                    var ms = date.getMilliseconds()
                    return Y +"-"+M+"-"+D+" "+h+":"+m+":"+s+"."+ms;
            }).filter(item => !item.includes('NaN'))
        })
    }

    onSelectionModeChange(e: RadioChangeEvent) {
        this.setState({label_mode: e.target.value})
    }

    onDrawModeChange(e: RadioChangeEvent) {
        this.setState({draw_mode: e.target.value})
    }

    onBrushSizeChange(value: number) {
        this.setState({brush_size: value})
    };

    changeCurrentLabel(current_label: {
        name:string | null,
        color: string | null
    }) {
        console.log(this.state)
        this.setState({current_label})
    }

    render():JSX.Element {
        return (
            <Layout>
                <Content>
                    <div className='title align-left'>Canvas</div>
                </Content>
                <Sider theme='light'>
                    <div className='title align-mid'>Options</div>
                    <div className='order'>  
                        <div className='function-area'>
                            <div>Image List</div>
                            <div>
                                <Fragment>
                                    {
                                        this.state.images.length === 0 ?
                                        <div className='align-mid'>No images captured!</div> :
                                        <Menu>
                                            {
                                                this.state.images.map((item):JSX.Element => 
                                                    <Menu.Item key={String(item)}>
                                                        <FileImageOutlined />
                                                        {item}
                                                    </Menu.Item>
                                                )
                                            }
                                        </Menu>                                         
                                    }
                                </Fragment>

                            </div>
                        </div>
                        <div className='function-area'>
                            <div className='title align-left'>Mark Tools</div>
                            <ManageLabel cb={this.changeCurrentLabel}/>
                            <Radio.Group onChange={this.onSelectionModeChange} value={this.state.label_mode}>
                                <Space direction="vertical" className="sub-function-area">
                                    <Radio value={1}>Square Labeling</Radio>
                                </Space>
                                <Space direction="vertical" className="sub-function-area">
                                    <Radio value={2}>Area Labeling</Radio>
                                </Space>
                            </Radio.Group>
                            <Fragment>
                                <Radio.Group onChange={this.onDrawModeChange} value={this.state.draw_mode} style={{width:'100%'}}>
                                    <Radio.Button value={1} style={{width:'50%'}}>
                                        <HighlightOutlined />
                                        Brush
                                    </Radio.Button>
                                    <Radio.Button value={2} style={{width:'50%'}}>
                                        <ShakeOutlined /> 
                                        Eraser
                                    </Radio.Button>
                                </Radio.Group>
                                <div className='sub-title align-left'>Brush Size: {this.state.brush_size} px</div>
                                <Slider 
                                min={5}
                                max={500}
                                defaultValue={this.state.brush_size} 
                                onAfterChange={this.onBrushSizeChange} />
                                <div style={{width: '100%',height: '100px', margin: '10px auto 0'}}>
                                    <svg width='100%' height='100%'>
                                        <path d='M20 50 C45 0 135 100 160 50'
                                        strokeWidth={String(2*Math.floor(Math.log2(this.state.brush_size))) + 'px'}
                                        style={
                                            {stroke:
                                                this.state.current_label.color ? this.state.current_label.color:
                                                'black',
                                                fill:'transparent'
                                            }
                                        }></path>
                                    </svg>
                                </div>
                            </Fragment>
                        </div>
                    </div>
                </Sider>
            </Layout>
        )
    }
}