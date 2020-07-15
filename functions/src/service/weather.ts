import { createHash } from 'crypto'
import * as functions from 'firebase-functions'
import ajax from '../utils/ajax'
import { keySort } from '../utils/key-sort'

export interface Config {
  username: string
  key: string
}

export default ajax(
  {
    baseURL: 'https://free-api.heweather.net/s6',
  },
  {
    auth: true,
    requestAuth: data => {
      const config = functions.config().weather as Config

      const username = config.username
      const key = config.key
      const t = Math.floor(Date.now() / 1000)
      const params = {
        ...data,
        username,
        key,
        t,
      }
      const sortParams = keySort(params)
      let str = ''
      Object.keys(sortParams).forEach(key => {
        const value = sortParams[key]
        if (value !== '' && key !== 'key') {
          str += `${key}=${encodeURIComponent(value)}&`
        }
      })
      str = str.substr(0, str.length - 1)
      str += key
      const sign = createHash('md5', { encoding: 'utf-8' })
        .update(str)
        .digest('hex')

      return new Promise((resolve, reject) => {
        resolve({ sign, t, username })
      })
    },
  },
)
