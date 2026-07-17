export type BackendRole = 'PENDING_ROLE' | 'CONSUMER' | 'PRODUCER' | 'ADMIN'

export type BackendUser = {
  id: string
  auth0Sub: string
  email: string
  emailVerified: boolean
  firstName: string | null
  lastName: string | null
  name: string | null
  avatar: string | null
  role: BackendRole
  createdAt: string
  updatedAt: string
  deletedAt: string | null
}

export type ProducerView = {
  id: string
  businessName: string
  nif: string
  description: string
  address: {
    line1: string
    line2: string | null
    city: string
    postalCode: string
    province: string
    country: string
  }
  categorySlugs: string[]
}

export type CurrentUser = {
  id: string
  email: string
  emailVerified: boolean
  name: string | null
  firstName: string | null
  lastName: string | null
  avatar: string | null
  role: BackendRole
  onboardingCompleted: boolean
  producer: ProducerView | null
  createdAt: string
  updatedAt: string
}
