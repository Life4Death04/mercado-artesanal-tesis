export type RegistrationRole = 'consumidor' | 'productor'

export type RegistrationStep = 'profile' | 'basic' | 'producer' | 'review' | 'success'

export type RegistrationWizardData = {
  role: RegistrationRole
  name: string
  email: string
  consentAccepted: boolean
  producerName: string
  municipality: string
  productTypes: string[]
  producerDescription: string
}

export type WizardStepMeta = {
  id: RegistrationStep
  label: string
}
