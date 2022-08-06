import React, { Component, Fragment } from 'react';
import { Route, BrowserRouter as Router, Switch, Redirect } from 'react-router-dom';
import './App.css';
import { Layout, Menu } from 'antd';
import AdminPage from './view/AdminPage';
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
            <Route path='/' exact render={()=> (
               <Redirect to='/admin'/>
            )}/>
            <Route exact path='/login'>
              <Login></Login>
            </Route>
            <Route path='/admin' component={AdminPage}>
            </Route>              
            </Switch>
          </Fragment>
        </Router>
      </Layout>
    )
   
  };
}
