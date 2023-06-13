import Auth from '../auth/Auth'
import { History } from 'history'
import { Feed } from '../types/Feed'
import React from 'react'
import { getFeedById } from '../api/feed-api'
import {
  Image,
  Card,
  Modal,
  Icon,
  Container,
  Button,
  Grid,
  Loader
} from 'semantic-ui-react'

interface FeedDetailProps {
  auth: Auth
  history: History
}

interface FeedDetailState {
  feed?: Feed
  loadingFeeds: boolean
  liked: boolean
}

export class FeedDetail extends React.PureComponent<
  FeedDetailProps,
  FeedDetailState
> {
  state: FeedDetailState = {
    loadingFeeds: true,
    liked: false
  }

  async componentDidMount() {
    try {
      this.setState(this.state)
      console.log(
        '🚀 ~ file: FeedDetail.tsx:30 ~ componentDidMount ~ state:',
        this.state
      )
    } catch (error) {
      console.log(
        '🚀 ~ file: FeedDetail.tsx:33 ~ componentDidMount ~ error:',
        error
      )
    }

    try {
      const feedId = this.props.history?.location?.pathname.split('/')[2]
      const feed = await getFeedById(this.props.auth.getIdToken(), feedId)
      this.setState({
        feed,
        loadingFeeds: false,
        liked: false
      })
    } catch (e) {
      alert(`Failed to fetch feeds: ${(e as Error).message}`)
      this.props.history.goBack()
    }
  }
  handleLike = async () => {
    try {
      this.setState({
        ...this.state,
        loadingFeeds: true
      })
      const feedId = this.props.history?.location?.pathname.split('/')[2]
      const feed = await getFeedById(this.props.auth.getIdToken(), feedId)
      console.log(
        '🚀 ~ file: FeedDetail.tsx:52 ~ handleLike ~ this.state.liked:',
        this.state
      )
      const liked = this.state.liked
      this.setState({
        loadingFeeds: false,
        feed: feed,
        liked: !liked
      })
    } catch (error) {}
  }
  render() {
    return this.state.loadingFeeds ? (
      <Grid.Row style ={{marginTop: 40}}>
        <Loader indeterminate active inline="centered">
          Loading Feed
        </Loader>
      </Grid.Row>
    ) : (
      <Container style={{ marginTop: 24, padding: '0 300px' }}>
        <Icon
          name="arrow left"
          onClick={() => this.props.history.goBack()}
        ></Icon>
        <Card fluid>
          <Image
            src="https://th.bing.com/th/id/OIG.n9uMDUv50OpeIkdd_8u0"
            wrapped
            ui={false}
            size="medium"
            style={{
              flex: 1
            }}
          />
          <Card.Content>
            <Card.Header>{this.state.feed?.userId}</Card.Header>
            <Card.Meta style={{ display: 'flex' }}>
              <span className="date" style={{ flex: 1 }}>
                {new Date(this.state.feed?.updatedAt as string).toDateString()}
              </span>
              {this.state.feed?.userId === '' && (
                <Button icon content={<Icon name="pencil" />} size="mini" />
              )}
              {this.state.feed?.userId === '' && (
                <Button icon content={<Icon name="trash" />} size="mini" />
              )}
            </Card.Meta>
            <Card.Description>{this.state.feed?.caption}</Card.Description>
            {this.state.liked ? (
              <Card.Meta>
                <Icon name="like" onClick={this.handleLike} color="red" />
                <span>{this.state.feed?.reaction} Liked</span>{' '}
              </Card.Meta>
            ) : (
              <Card.Meta>
                <Icon name="like" onClick={this.handleLike} />
                <span>{this.state.feed?.reaction} Liked</span>
              </Card.Meta>
            )}
          </Card.Content>
        </Card>
      </Container>
    )
  }
}
