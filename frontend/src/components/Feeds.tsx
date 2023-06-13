import { History } from 'history'
import * as React from 'react'
import {
  Grid,
  Header,
  Icon,
  Image,
  Loader,
  Feed,
} from 'semantic-ui-react'

import { getFeeds } from '../api/feed-api'
import Auth from '../auth/Auth'
import { Feed as FeedItem } from '../types/Feed'

interface FeedsProps {
  auth: Auth
  history: History
}

interface FeedsState {
  feeds: FeedItem[]
  loadingFeeds: boolean
  feedModal: boolean
}

export class Feeds extends React.PureComponent<FeedsProps, FeedsState> {
  state: FeedsState = {
    feeds: [],
    loadingFeeds: true,
    feedModal: false
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
        {this.renderFeeds()}
      </div>
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
  renderFeedModal(open: boolean) {
    this.setState({
      ...this.state,
      feedModal: open
    })
  }
  renderFeedsList(feeds: FeedItem[]) {
    return (
      <Feed>
        {feeds.map((feed) => (
          <Feed.Event
            key={feed.feedId}
            onClick={() => this.props.history.push(`./feeds/${feed.feedId}`)}
          >
            <Feed.Label>
              <Image
                circular
                size="tiny"
                src={feed.picture}
              />
            </Feed.Label>
            <Feed.Content>
              <Feed.Summary>
                <Feed.User>{feed.name}</Feed.User>
                <Feed.Date>
                  {feed.createdAt === feed.updatedAt
                    ? new Date(feed.createdAt).toDateString()
                    : `Updated at ${new Date(feed.updatedAt).toDateString()}`}
                </Feed.Date>
              </Feed.Summary>
              <Feed.Extra text>{feed.caption}</Feed.Extra>
              {feed.attachmentUrl ? (
                <Feed.Extra images>
                  <Image size="big" src={feed.attachmentUrl} />{' '}
                </Feed.Extra>
              ) : null}
              <Feed.Meta>
                <Feed.Like>{feed.reaction} Like</Feed.Like>
              </Feed.Meta>
            </Feed.Content>
          </Feed.Event>
        ))}
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
              <Feed.Date>Updated at 13/04/2000</Feed.Date>
            </Feed.Summary>
            <Feed.Extra text>This is caption</Feed.Extra>
            <Feed.Extra images>
              <Image
                size="big"
                src="https://th.bing.com/th/id/OIG.n9uMDUv50OpeIkdd_8u0"
              />{' '}
            </Feed.Extra>
            <Feed.Meta>
              <Feed.Like>
                <Icon name="like" />
                10
              </Feed.Like>
            </Feed.Meta>
          </Feed.Content>
        </Feed.Event>
      </Feed>
    )
  }
}
