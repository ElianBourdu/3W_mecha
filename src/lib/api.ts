export class HttpError extends Error {
  public response: Response & { payload: Record<string, any> }

  constructor(response: Response & { payload: Record<string, any> }) {
    super(response.statusText);
    this.response = response
  }
}

export async function api<T>(route: string, options: any = {}): Promise<T> {
  return fetch(`http://localhost:3000${route}`, { cache: 'no-cache', ...options})
    .then(async (res) => {
      if (res.status === 401) {
        // Redirect to login page
        window.location.href = '/signin'
      }

      return (res.status === 204 ? Promise.resolve({}) : res.json())
        .then(payload => Object.assign(res, { payload }))
    })
    .then(res => {
      if (!res.ok) {
        throw new HttpError(res)
      }

      return res.payload?.data
    })
}