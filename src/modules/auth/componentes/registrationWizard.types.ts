export type RegistrationRole = 'consumidor' | 'productor'

export type RegistrationStep = 'profile' | 'basic' | 'producer' | 'review' | 'success'

export type RegistrationWizardData = {
  role: RegistrationRole
  firstName: string
  lastName: string
  email: string
  consentAccepted: boolean
  producerName: string
  producerNif: string
  municipality: string
  producerAddressLine1: string
  producerAddressLine2: string
  producerPostalCode: string
  producerProvince: string
  productTypes: string[]
  producerDescription: string
}

export type WizardStepMeta = {
  id: RegistrationStep
  label: string
}
