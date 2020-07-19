import { ApiToken } from "./authorization";

type UserInfo = { sub: string; email: string; username: string; };

let cachedUserInfo = null as null | Promise<UserInfo>;
const userpool = 'https://sammonsio-notes.auth.us-east-1.amazoncognito.com'

const fetchUserInfo = (): Promise<UserInfo> => {
  return fetch(`${userpool}/oauth2/userInfo`, {
    headers: new Headers({
      Authorization: `Bearer ${ApiToken()}`
    }),
    cache: 'only-if-cached',
    credentials: 'omit'
  }).then(res => {
    return res.json()
  })
}

export const UserInfo = {
  getUserInfo: async (): Promise<UserInfo> => {
    if (cachedUserInfo == null) {
      cachedUserInfo = fetchUserInfo();
    }
    return cachedUserInfo as Promise<UserInfo>;
  }
}