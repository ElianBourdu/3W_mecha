import {api} from "@/lib/api";

export async function signup(username: string, password: string, steam_username: string) {
  return api('/api/auth/signup', {
    method: 'POST',
    body: JSON.stringify({username, password, steam_username}),
  })
}

export async function signin(username: string, password: string) {
  return api('/api/auth/signin', {
    method: 'POST',
    body: JSON.stringify({username, password}),
  })
}
