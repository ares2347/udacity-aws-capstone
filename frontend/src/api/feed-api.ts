import { apiEndpoint } from '../config'
import { Feed } from '../types/Feed';
import { CreateFeedRequest } from '../types/CreateFeedRequest';
import Axios from 'axios'
import { UpdateFeedRequest } from '../types/UpdateFeedRequest';

export async function getFeeds(idToken: string): Promise<Feed[]> {
  console.log('Fetching feeds')

  const response = await Axios.get(`${apiEndpoint}/feeds?nextKey=&&limit=20`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    },
  })
  console.log('Feeds:', response.data)
  return response.data.items
}
export async function getMyFeeds(idToken: string): Promise<Feed[]> {
  console.log('Fetching feed')

  const response = await Axios.get(`${apiEndpoint}/feeds/my-feed?nextKey=&&limit=20`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    },
  })
  console.log('Feeds:', response.data)
  return response.data.items
}

export async function getFeedById(idToken: string, feedId: string): Promise<Feed> {
  console.log('Fetching feed')

  const response = await Axios.get(`${apiEndpoint}/feeds/${feedId}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    },
  })
  console.log('Feeds:', response.data)
  return response.data.item
}

export async function createFeed(
  idToken: string,
  newFeed: CreateFeedRequest
): Promise<Feed> {
  const response = await Axios.post(`${apiEndpoint}/feeds`,  JSON.stringify(newFeed), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
  return response.data.item
}

export async function patchFeed(
  idToken: string,
  feedId: string,
  updatedFeed: UpdateFeedRequest
): Promise<void> {
  await Axios.patch(`${apiEndpoint}/feeds/${feedId}`, JSON.stringify(updatedFeed), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
}
export async function likeFeed(
  idToken: string,
  feedId: string
): Promise<void> {
  await Axios.patch(`${apiEndpoint}/feeds/like/${feedId}`, {},{
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
}

export async function deleteFeed(
  idToken: string,
  feedId: string
): Promise<void> {
  await Axios.delete(`${apiEndpoint}/feeds/${feedId}`, {
    headers: {
      'Authorization': `Bearer ${idToken}`
    }
  })
}

export async function getUploadUrl(
  idToken: string,
  feedId: string
): Promise<string> {
  const response = await Axios.get(`${apiEndpoint}/feeds/uploadUrl/${feedId}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
  return response.data.uploadUrl
}

export async function uploadFile(uploadUrl: string, file: Buffer): Promise<string> {
  const response = await Axios.put(uploadUrl, file);
  return response.data.url;
}