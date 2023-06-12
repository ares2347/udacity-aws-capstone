import { Component } from 'react'
import { Route, Router, Switch } from 'react-router-dom'
import { Grid, Header, Icon, Menu, MenuItem, Image } from 'semantic-ui-react'

import Auth from './auth/Auth'
import { EditTodo } from './components/EditTodo'
import { LogIn } from './components/LogIn'
import { NotFound } from './components/NotFound'
import { Todos } from './components/Todos'

export interface AppProps {}

export interface AppProps {
  auth: Auth
  history: any
}

export interface AppState {}

export default class App extends Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props)

    this.handleLogin = this.handleLogin.bind(this)
    this.handleLogout = this.handleLogout.bind(this)
  }

  handleLogin() {
    this.props.auth.login()
  }

  handleLogout() {
    this.props.auth.logout()
  }

  render() {
    return (
      <div>
        <Grid columns={2} divided>
          <Grid.Row>
            <Grid.Column width={3}>{this.generateMenu()}</Grid.Column>
            <Grid.Column width={13}>
              <Router history={this.props.history}>
                {this.generateCurrentPage()}
              </Router>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    )
  }

  generateMenu() {
    return (
      <Menu borderless={true} size="huge" fluid={true} vertical secondary>
        <Menu.Item name="home">
          <Header as="h2">
            <Icon name="home" />
            <Header.Content>Home</Header.Content>
          </Header>
        </Menu.Item>
        {this.props.auth.isAuthenticated() ? (
          <MenuItem
            content={
              <Header as="h4">
                <Image circular size='tiny' src="https://th.bing.com/th/id/OIG.n9uMDUv50OpeIkdd_8u0"/>
                <Header.Content>Username</Header.Content>
              </Header>
            }
          />
        ) : null}
        {this.props.auth.isAuthenticated() ? (
          <Menu.Item
            name="logout"
            onClick={this.handleLogout}
            content={
              <Header as="h4">
                <Icon name="log out" />
                <Header.Content>Log Out</Header.Content>
              </Header>
            }
          />
        ) : (
          <Menu.Item
            name="login"
            onClick={this.handleLogin}
            content={
              <Header as="h4">
                <Icon name="sign in" />
                <Header.Content>Log In</Header.Content>
              </Header>
            }
          />
        )}
      </Menu>
    )
  }

  generateCurrentPage() {
    if (!this.props.auth.isAuthenticated()) {
      return <LogIn auth={this.props.auth} />
    }

    return (
      <Switch>
        <Route
          path="/"
          exact
          render={(props) => {
            return <Todos {...props} auth={this.props.auth} />
          }}
        />

        <Route
          path="/todos/:todoId/edit"
          exact
          render={(props) => {
            return <EditTodo {...props} auth={this.props.auth} />
          }}
        />

        <Route component={NotFound} />
      </Switch>
    )
  }
}
