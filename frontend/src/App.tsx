import { Component } from 'react'
import { Route, Router, Switch, NavLink } from 'react-router-dom'
import {
  Grid,
  Header,
  Icon,
  Menu,
  MenuItem,
  Image,
  Modal,
  Button,
  Form,
  TextArea,
  Input,
  Loader
} from 'semantic-ui-react'

import Auth from './auth/Auth'
import { LogIn } from './components/LogIn'
import { NotFound } from './components/NotFound'
import { Feeds } from './components/Feeds'
import { createFeed, getUploadUrl, uploadFile } from './api/feed-api'
import { MyFeeds } from './components/MyFeeds'
import { FeedDetail } from './components/FeedDetail'
import { getUserProfile } from './api/user-apis'
import { UserProvider } from './components/UserContext'

export interface AppProps {}

export interface AppProps {
  auth: Auth
  history: any
}

export interface AppState {
  createNewFeed: boolean
  loading: boolean
  user: any
  isLoggedIn: boolean
  newFeed?: {
    caption?: string
    attachment?: any
    uploadAttachmentStatus?: boolean
  }
}

export default class App extends Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props)

    this.handleLogin = this.handleLogin.bind(this)
    this.handleLogout = this.handleLogout.bind(this)
  }
  state: Readonly<AppState> = {
    createNewFeed: false,
    loading: false,
    user: {},
    isLoggedIn: false
  }
  handleCreateFeedModal = (open: boolean) => {
    this.setState({
      createNewFeed: open,
      newFeed: open ? this.state.newFeed : undefined
    })
  }
  async handleLogin() {
    this.props.auth.login()
    
  }
  async componentDidUpdate() {
    if (this.props.auth.isAuthenticated() && !this.state.isLoggedIn) {
      const idToken = this.props.auth.getIdToken()
      var userData = await getUserProfile(idToken)
      this.setState({
        ...this.state,
        user: userData,
        isLoggedIn: true
      })
    }
  }
  handleLogout() {
    this.props.auth.logout()
  }

  handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files) return

    this.setState({
      newFeed: {
        ...this.state.newFeed,
        attachment: files[0]
      }
    })
  }

  handleNewFeedCaptionChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    this.setState({
      newFeed: {
        ...this.state.newFeed,
        caption: event.target.value
      }
    })
  }

  handleFeedPosted = async () => {
    try {
      let fileUrl
      this.setState({
        ...this.state,
        loading: true
      })
      if (this.state.newFeed?.attachment) {
        const uploadUrl = await getUploadUrl(this.props.auth.getIdToken())
        fileUrl = await uploadFile(uploadUrl, this.state.newFeed?.attachment)
      }
      await createFeed(this.props.auth.getIdToken(), {
        caption: this.state.newFeed?.caption as string,
        attachmentUrl: fileUrl,
        name: this.state.user.name || '',
        picture: this.state.user.picture || ''
      })
      this.setState({
        createNewFeed: false,
        loading: false,
        newFeed: undefined
      })
    } catch (error) {
      alert('Feed creation failed')
      this.setState({
        ...this.state,
        createNewFeed: true,
        loading: false
      })
    }
  }

  render() {
    return (
      <UserProvider value={this.state.user}>
        <Grid columns={2} divided>
          <Grid.Row>
            <Grid.Column width={3}>{this.generateMenu()}</Grid.Column>
            <Grid.Column width={13}>
              <Router history={this.props.history}>
                {this.state.loading ? (
                  <Grid.Row>
                    <Loader indeterminate active inline="centered">
                      Loading
                    </Loader>
                  </Grid.Row>
                ) : (
                  this.generateCurrentPage()
                )}
                {this.renderNewFeedInput()}
              </Router>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </UserProvider>
    )
  }

  generateMenu() {
    return (
      <Menu borderless={true} size="huge" fluid={true} vertical secondary>
        <Menu.Item name="home">
          <NavLink to="/">
            <Header as="h2">
              <Icon name="home" />
              <Header.Content>Home</Header.Content>
            </Header>
          </NavLink>
        </Menu.Item>
        {this.props.auth.isAuthenticated() && (
          <>
            <MenuItem
              onClick={() => this.handleCreateFeedModal(true)}
              content={
                <Header as="h4">
                  <Icon name="add" />
                  <Header.Content>Add Post</Header.Content>
                </Header>
              }
            />
            <MenuItem
              onClick={() => this.props.history.push(`./my-post`)}
              content={
                <Header as="h4">
                  <Icon name="feed" />
                  <Header.Content>My Post</Header.Content>
                </Header>
              }
            />
          </>
        )}
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
        {this.props.auth.isAuthenticated() && (
          <MenuItem
            content={
              <Header as="h4">
                <Image circular size="tiny" src={this.state.user.picture} />
                <Header.Content>{this.state.user.name}</Header.Content>
              </Header>
            }
          />
        )}
      </Menu>
    )
  }

  readImageUrl(file: any) {
    return URL.createObjectURL(file)
  }

  renderNewFeedInput() {
    return (
      <Modal
        onClose={() => this.handleCreateFeedModal(false)}
        onOpen={() => this.handleCreateFeedModal(true)}
        open={this.state.createNewFeed}
      >
        <Modal.Header>Create a new post</Modal.Header>
        <Modal.Content image>
          <Modal.Description>
            <Form style={{ display: 'flex', gap: 16 }}>
              {this.state.newFeed?.attachment ? (
                <Image
                  size="medium"
                  src={this.readImageUrl(this.state.newFeed.attachment)}
                  wrapped
                />
              ) : (
                <Form.Field>
                  <Input
                    type="file"
                    accept="image/*"
                    placeholder="Image to upload"
                    onChange={this.handleFileChange}
                  />
                </Form.Field>
              )}

              <Form.Field style={{ flex: 1 }}>
                <TextArea
                  placeholder="What's on your mind..."
                  style={{ minHeight: 300 }}
                  value={this.state.newFeed?.caption}
                  onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) =>
                    this.handleNewFeedCaptionChange(event)
                  }
                />
              </Form.Field>
            </Form>
          </Modal.Description>
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={() => this.handleCreateFeedModal(false)}>
            Cancel
          </Button>
          <Button onClick={() => this.handleFeedPosted()} positive>
            Post
          </Button>
        </Modal.Actions>
      </Modal>
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
            return <Feeds {...props} auth={this.props.auth} />
          }}
        />
        <Route
          path="/my-post"
          exact
          render={(props) => {
            return <MyFeeds {...props} auth={this.props.auth} />
          }}
        />
        <Route
          path="/feeds/:feedId"
          exact
          render={(props) => {
            return <FeedDetail {...props} auth={this.props.auth} />
          }}
        />

        <Route component={NotFound} />
      </Switch>
    )
  }
}
