import React, { Component, Fragment } from 'react';
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom';
import './App.css';
import { Layout, Menu } from 'antd';
import MenuBar from './view/MenuBar';
import Login from './login/login';


const { Header, Content, Sider} = Layout

interface State {
  key: string
}

export default class App extends React.Component<{},State> {
  constructor(props:any) {
    super(props)
    this.state = { key: '0' }
    this.changeState = this.changeState.bind(this)
  }
  changeState(key:string):void {
    this.setState({
      key: key
    })
  }
  render():JSX.Element {
    return (
      <Layout>
        <Router>
          <Fragment>
            <Switch>
            <Route exact path='/login'>
              <Login></Login>
            </Route>
            <Route path='/admin' render = {
              props => {
                return (
                  <MenuBar
                  current_key = { this.state.key }
                  list = {
                    [
                      {key:'0',label:'视频查看'},
                      {key:'1',label:'视频校正'},
                      {key:'2',label:'视频标注'},
                    ]
                  }
                  stateChange = { this.changeState }
                ></MenuBar>)
              }
            }>
            </Route>              
            </Switch>
          </Fragment>
        </Router>
      </Layout>
    )
   
  };
}
