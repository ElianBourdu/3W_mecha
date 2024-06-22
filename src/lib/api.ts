class HttpError extends Error {
  public response: Response & { body: Record<string, any> }

  constructor(response: Response & { body: Record<string, any> }) {
    super(response.statusText);
    this.response = response
  }
}

export async function api<T>(route: string, options: any = {}): Promise<T> {
  return fetch(`http://localhost:3000${route}`, options)
    .then(async (res) => {
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