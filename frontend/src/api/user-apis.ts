import Axios from 'axios'
import {authConfig } from '../config'
import {decode} from 'jsonwebtoken'

export async function getUserProfile(idToken: string): Promise<any> {
    var userId = decode(idToken)?.sub;
    const response = await Axios.get(`https://${authConfig.domain}/api/v2/users/${userId}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authConfig.mngtToken}`
      },
    })
    localStorage.setItem('email', response.data.email);
    localStorage.setItem('name', response.data.name);
    localStorage.setItem('picture', response.data.picture);
    return response.data.items
  }