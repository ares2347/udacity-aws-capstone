import { History } from 'history'
import * as React from 'react'
import {
  Button,
  Divider,
  Grid,
  Header,
  Icon,
  Input,
  Image,
  Loader,
  Feed
} from 'semantic-ui-react'

import { createFeed, deleteFeed, getFeeds } from '../api/feed-api'
import Auth from '../auth/Auth'
import { Feed as FeedItem } from '../types/Feed'

interface FeedsProps {
  auth: Auth
  history: History
}

interface FeedsState {
  feeds: FeedItem[]
  caption: string
  attachmentUrl: string
  loadingFeeds: boolean
}

export class Todos extends React.PureComponent<FeedsProps, FeedsState> {
  state: FeedsState = {
    feeds: [],
    caption: '',
    attachmentUrl: '',
    loadingFeeds: true
  }

  handleCaptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ caption: event.target.value })
  }

  onEditButtonClick = (feedId: string) => {
    this.props.history.push(`/feeds/${feedId}/edit`)
  }

  onNewFeedCreate = async (event: React.ChangeEvent<HTMLButtonElement>) => {
    try {
      const newFeed = await createFeed(this.props.auth.getIdToken(), {
        caption: this.state.caption,
        attachmentUrl: this.state.attachmentUrl
      })
      this.setState({
        feeds: [...this.state.feeds, newFeed],
        caption: '',
        attachmentUrl: ''
      })
    } catch {
      alert('Feed creation failed')
    }
  }

  onFeedDelete = async (feedId: string) => {
    try {
      await deleteFeed(this.props.auth.getIdToken(), feedId)
      this.setState({
        feeds: this.state.feeds.filter((feed) => feed.feedId !== feedId)
      })
    } catch {
      alert('Todo deletion failed')
    }
  }

  async componentDidMount() {
    try {
      const feeds = await getFeeds(this.props.auth.getIdToken())
      this.setState({
        feeds,
        loadingFeeds: false
      })
    } catch (e) {
      alert(`Failed to fetch feeds: ${(e as Error).message}`)
      this.setState({
        feeds: this.state.feeds,
        loadingFeeds: false
      })
    }
  }

  render() {
    return (
      <div>
        <Header as="h1">Feeds</Header>

        {this.renderNewFeedInput()}

        {this.renderFeeds()}
      </div>
    )
  }

  renderNewFeedInput() {
    return (
      <Grid.Row>
        <Grid.Column width={16}>
          <Input
            action={{
              color: 'teal',
              labelPosition: 'left',
              icon: 'add',
              content: 'New Feed',
              onClick: this.onNewFeedCreate
            }}
            fluid
            actionPosition="left"
            placeholder="What's on your mind..."
            onChange={this.handleCaptionChange}
          />
        </Grid.Column>
        <Grid.Column width={16}>
          <Divider />
        </Grid.Column>
      </Grid.Row>
    )
  }

  renderFeeds() {
    if (this.state.loadingFeeds) {
      return this.renderLoading()
    }

    return this.renderFeedsList(this.state.feeds)
  }

  renderLoading() {
    return (
      <Grid.Row>
        <Loader indeterminate active inline="centered">
          Loading Feeds
        </Loader>
      </Grid.Row>
    )
  }

  renderFeedsList(feeds: FeedItem[]) {
    return (
      <Feed>
        {feeds.map((feed) => (
          <Feed.Event>
            <Feed.Label>
              <Image
                circular
                size="tiny"
                src="https://th.bing.com/th/id/OIG.n9uMDUv50OpeIkdd_8u0"
              />
            </Feed.Label>
            <Feed.Content>
              <Feed.Summary>
                <Feed.User>Username</Feed.User>
              </Feed.Summary>
              <Feed.Extra text>{feed.caption}</Feed.Extra>
              {feed.attachmentUrl ? (
                <Feed.Extra images>
                  <Image size="big" src={feed.attachmentUrl} />{' '}
                </Feed.Extra>
              ) : null}
              <Feed.Meta>
                <Feed.Like>
                  <Icon name="like" />
                  {feed.reaction}
                </Feed.Like>
                <Feed.Like>
                  <Icon name="comment" />
                  {feed.comments}
                </Feed.Like>
              </Feed.Meta>
            </Feed.Content>
          </Feed.Event>
        ))}
      </Feed>
    )
  }
}
