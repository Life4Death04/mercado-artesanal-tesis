export const apiConfig = {
  baseUrl: import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api',
}

export async function apiRequest<TResponse>(path: string): Promise<TResponse> {
  const response = await fetch(`${apiConfig.baseUrl}${path}`)

  if (!response.ok) {
    throw new Error('No se pudo completar la solicitud')
  }

  return response.json() as Promise<TResponse>
}
