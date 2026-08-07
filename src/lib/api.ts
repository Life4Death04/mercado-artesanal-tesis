export const apiConfig = {
  baseUrl: import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api/v1',
}

export type ApiRequestOptions = {
  method?: string
  accessToken?: string
  body?: unknown
  headers?: HeadersInit
  signal?: AbortSignal
}

export class ApiError extends Error {
  public readonly status: number
  public readonly payload: unknown

  constructor(
    message: string,
    status: number,
    payload: unknown,
  ) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.payload = payload
  }
}

export async function apiRequest<TResponse>(
  path: string,
  options: ApiRequestOptions = {},
): Promise<TResponse> {
  const headers = new Headers(options.headers)

  if (options.accessToken) {
    headers.set('Authorization', `Bearer ${options.accessToken}`)
  }

  if (options.body !== undefined && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }

  const response = await fetch(`${apiConfig.baseUrl}${path}`, {
    method: options.method ?? 'GET',
    headers,
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
    signal: options.signal,
  })

  if (!response.ok) {
    const payload = await readResponsePayload(response)
    const message = getErrorMessage(payload) ?? 'No se pudo completar la solicitud'

    throw new ApiError(message, response.status, payload)
  }

  if (response.status === 204) {
    return undefined as TResponse
  }

  return response.json() as Promise<TResponse>
}

async function readResponsePayload(response: Response): Promise<unknown> {
  const contentType = response.headers.get('content-type')

  if (contentType?.includes('application/json')) {
    return response.json()
  }

  return response.text()
}

function getErrorMessage(payload: unknown): string | undefined {
  if (typeof payload === 'object' && payload !== null && 'detail' in payload) {
    const detail = payload.detail

    if (typeof detail === 'string') return detail
  }

  if (typeof payload === 'string' && payload.length > 0) return payload

  return undefined
}
