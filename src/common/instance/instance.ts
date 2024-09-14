import axios from 'axios'

export const instance = axios.create({
  baseURL: 'https://social-network.samuraijs.com/api/1.1',
  withCredentials: true,
  headers: {
    'API-KEY': '62a6656e-ad1b-4495-8bfe-e56dcc639e6b',
  },
})
