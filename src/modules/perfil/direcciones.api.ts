import { addressListSchema, addressSchema, type Address, type CreateAddressInput, type UpdateAddressInput } from './direcciones.schema'

export const direccionesEndpoints = {
  list: '/users/me/addresses',
  detail: (addressId: string) => `/users/me/addresses/${addressId}`,
} as const

type ApiCaller = <TResponse>(path: string, options?: { method?: string; body?: unknown; signal?: AbortSignal }) => Promise<TResponse>

export async function getAddresses(api: ApiCaller, signal?: AbortSignal): Promise<Address[]> {
  return addressListSchema.parse(await api<unknown>(direccionesEndpoints.list, { signal }))
}

export async function createAddress(api: ApiCaller, input: CreateAddressInput): Promise<Address> {
  return addressSchema.parse(await api<unknown>(direccionesEndpoints.list, { method: 'POST', body: input }))
}

export async function updateAddress(api: ApiCaller, addressId: string, input: UpdateAddressInput): Promise<Address> {
  return addressSchema.parse(await api<unknown>(direccionesEndpoints.detail(addressId), { method: 'PATCH', body: input }))
}

export async function deleteAddress(api: ApiCaller, addressId: string): Promise<void> {
  await api(direccionesEndpoints.detail(addressId), { method: 'DELETE' })
}
