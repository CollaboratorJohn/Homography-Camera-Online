import { Button, Form, Input, Radio, message } from 'antd';
import type { FormInstance } from 'antd/es/form';
import React from 'react';
import axios from 'axios'

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
      message.info('请输入用户名')
      return
    }
    if(!value.passwd) {
      message.info('请输入密码')
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
      <Form.Item label="选择" shouldUpdate={(prevValues:string, currentValues:string) => prevValues !== currentValues}>
        <Radio.Group defaultValue={ "login" }>
          <Radio.Button value = "login" onClick={() => {this.setState({login_state:'login'})}}>登录</Radio.Button>
          <Radio.Button value = "regist" onClick={() => {this.setState({login_state:'regist'})}}>注册</Radio.Button>
        </Radio.Group>
      </Form.Item>
      <Form.Item label="用户名" name="user">
        <Input placeholder="请输入用户名" />
      </Form.Item>
      <Form.Item label="密码" name="passwd">
        <Input placeholder="请输入密码" />
      </Form.Item>
      <Form.Item {...this.buttonItemLayout}>
        <Button type="primary" htmlType="submit">提交</Button>
      </Form.Item>
    </Form>
    );
  } 
}