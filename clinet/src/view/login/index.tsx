import { Button, Form, Input, Radio, message } from 'antd';
import type { FormInstance } from 'antd/es/form';
import React from 'react';
import axios from 'axios'
import socket from "../../utli/socketIO";
import { Base64 } from 'js-base64'

interface State {
  login_state: String
}

export default class Login extends React.Component<{}, State> {
  constructor(props:any) {
    super(props)
    this.state = {
      login_state: "login"
    }
  }

  async componentDidMount() {
    try {
      const res = await axios.get('/api/permission/');
      if (res.data.message === 'authenticated' && res.status !== 401) {
          window.location.replace('/admin')
          return;
      }
    } catch (error) {
        console.error(error)
    }
  }
  
  formRef = React.createRef<FormInstance>();

  onFinish = async (value: {user:string,passwd:string}) => {
    if(!value.user) {
      message.info('Please type user name')
      return
    }
    if(!value.passwd) {
      message.info('Please type password')
      return
    }
    if(value.user && value.passwd) {
      console.log(this.state.login_state)
      if(this.state.login_state === 'regist') {
        const res = await axios.get('/api/regist', {params: value})
        const msg = res.data.message
        message.info(msg)
        return
      }
      if(this.state.login_state === 'login') {
        const res = await axios.get('/api/login', {params: value})
        const msg = res.data.message
        
        if(msg === '登录成功') {
          message.info(msg)
          window.location.replace('/admin')
          if(document.cookie.match(/(?<=(user=))(.*?)(?<=(;|$))/g)) {
            socket.emit('login',{
              name: Base64.encode(Date.now().toString()),
              room: document.cookie.match(/(?<=(user=))(.*?)(?<=(;|$))/g)![0]
            })      
          }
        } else {
          message.error(msg)
        }

        return
      }
    }
  }

  buttonItemLayout = {
    wrapperCol: { span: 14, offset: 4 },
  } 

  formItemLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 14 },
  }

  render():JSX.Element {
    return (
      
    <Form
      {...this.formItemLayout}
      layout={'horizontal'}
      ref={this.formRef}
      initialValues={{ layout: 'horizontal' }}
      onFinish={this.onFinish}
    >
      <Form.Item label="Mode" shouldUpdate={(prevValues:string, currentValues:string) => prevValues !== currentValues}>
        <Radio.Group defaultValue={ "login" }>
          <Radio.Button value = "login" onClick={() => {this.setState({login_state:'login'})}}>Login</Radio.Button>
          <Radio.Button value = "regist" onClick={() => {this.setState({login_state:'regist'})}}>Regist</Radio.Button>
        </Radio.Group>
      </Form.Item>
      <Form.Item label="User" name="user">
        <Input placeholder="User name"/>
      </Form.Item>
      <Form.Item label="Password" name="passwd">
        <Input placeholder="Password" type={'password'}/>
      </Form.Item>
      <Form.Item {...this.buttonItemLayout}>
        <Button type="primary" htmlType="submit">Submit</Button>
      </Form.Item>
    </Form>
    );
  } 
}