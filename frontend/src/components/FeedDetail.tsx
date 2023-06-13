import Auth from '../auth/Auth'
import { History } from 'history'
import { Feed } from '../types/Feed'
import React from 'react'
import { deleteFeed, getFeedById, getUploadUrl, likeFeed, patchFeed, uploadFile } from '../api/feed-api'
import {
  Image,
  Card,
  Icon,
  Container,
  Button,
  Grid,
  Loader,
  Modal,
  Form,
  Input,
  TextArea
} from 'semantic-ui-react'
import { UserConsumer } from './UserContext'

interface FeedDetailProps {
  auth: Auth
  history: History
}

interface FeedDetailState {
  feed?: Feed
  loadingFeeds: boolean
  liked: boolean
  openModal: boolean
  newAttachment?: any
}

export class FeedDetail extends React.PureComponent<
  FeedDetailProps,
  FeedDetailState
> {
  state: FeedDetailState = {
    loadingFeeds: true,
    liked: false,
    openModal: false
  }

  async componentDidMount() {
    try {
      this.setState(this.state)
      console.log(this.context)
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
      await likeFeed(this.props.auth.getIdToken(), feedId);
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
    } catch (error) {
      console.log("🚀 ~ file: FeedDetail.tsx:81 ~ handleLike= ~ error:", error)
      
    }
  }
  handleDelete = async () => {
    try{
      this.setState({
        ...this.state,
        loadingFeeds: true
      })
      const feedId = this.props.history?.location?.pathname.split('/')[2];
      await deleteFeed(this.props.auth.getIdToken(), feedId);
      this.props.history.push("/");

    }catch(e){

    }
  }
  handleUpdateFeedModal = (open: boolean) => {
    this.setState({
      ...this.state,
      openModal: open
    })
  }
  handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files) return

    this.setState({
      ...this.state,
      newAttachment: files[0]
    })
  }
  handleNewFeedCaptionChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    this.setState({
      feed: {
        ...this.state.feed as any,
        caption: event.target.value
      }
    })
  }
  handleFeedUpdated = async () => {
    try {
      this.setState({
        ...this.state,
        loadingFeeds: true
      })
        await patchFeed(this.props.auth.getIdToken(), this.state.feed?.feedId as string,{
        caption: this.state.feed?.caption as string,
      })
      if (this.state.newAttachment) {
        const uploadUrl = await getUploadUrl(this.props.auth.getIdToken(), this.state.feed?.feedId as string)
        await uploadFile(uploadUrl, this.state.newAttachment)
      }
      this.props.history.push(`/feeds/${this.state.feed?.feedId}`)
    } catch (error) {
      alert('Feed creation failed')
      this.setState({
        ...this.state,
        loadingFeeds: false,
        openModal: false
      })
    }
  }
  renderNewFeedInput() {
    return (
      <Modal
        onClose={() => this.handleUpdateFeedModal(false)}
        onOpen={() => this.handleUpdateFeedModal(true)}
        open={this.state.openModal}
      >
        <Modal.Header>Create a new post</Modal.Header>
        <Modal.Content image>
          <Modal.Description>
            <Form style={{ display: 'flex', gap: 16 }}>
              {this.state.newAttachment ? (
                <Image
                  size="medium"
                  src={URL.createObjectURL(this.state.newAttachment)}
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
                  value={this.state.feed?.caption}
                  onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) =>
                    this.handleNewFeedCaptionChange(event)
                  }
                />
              </Form.Field>
            </Form>
          </Modal.Description>
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={() => this.handleUpdateFeedModal(false)}>
            Cancel
          </Button>
          <Button onClick={() => this.handleFeedUpdated()} positive>
            Post
          </Button>
        </Modal.Actions>
      </Modal>
    )
  }
  render() {
    return this.state.loadingFeeds ? (
      <Grid.Row style={{ marginTop: 40 }}>
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
            src={this.state.feed?.attachmentUrl}
            wrapped
            ui={false}
            size="medium"
            style={{
              flex: 1
            }}
          />
          <Card.Content>
            <Card.Header style ={{display: "flex", gap: 12, alignItem: "flex-end"}}>
              <Image
                circular
                style={{ width: 40, height: 40 }}
                src={this.state.feed?.picture}
              />{' '}
              <span className="date">
                {this.state.feed?.name}
              </span>{' '}
              <span
                className="date"
                style={{
                  flex: 1,
                  fontSize: 10,
                  fontWeight: 300,
                  opacity: 0.8,
                  fontStyle: 'italic'
                }}
              >
                {new Date(this.state.feed?.updatedAt as string).toDateString()}
              </span>
              <UserConsumer>
                {(value) =>
                  this.state.feed?.userId === value.user_id && (
                    <Button icon content={<Icon name="pencil" />} size="mini" />
                  )
                }
              </UserConsumer>
              <UserConsumer>
                {(value) =>
                  this.state.feed?.userId === value.user_id && (
                    <Button icon content={<Icon name="trash" />} size="mini" onClick={this.handleDelete}/>
                  )
                }
              </UserConsumer>
            </Card.Header>
            <Card.Description style={{fontSize: 24, padding: "0 0 12px 0"}}>{this.state.feed?.caption}</Card.Description>
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
