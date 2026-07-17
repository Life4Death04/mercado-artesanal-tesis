import { useState } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Navigate, useNavigate } from 'react-router-dom'
import { ApiError } from '../../../lib/api'
import { homePathForRole } from '../authNavigation'
import { BasicDataStep } from '../componentes/BasicDataStep'
import { Auth0Redirect } from '../componentes/Auth0Redirect'
import { AuthErrorState } from '../componentes/AuthErrorState'
import { AuthLoadingState } from '../componentes/AuthLoadingState'
import { ProducerInfoStep } from '../componentes/ProducerInfoStep'
import { ProfileTypeStep } from '../componentes/ProfileTypeStep'
import { RegistrationStepper } from '../componentes/RegistrationStepper'
import { RegistrationSuccessStep } from '../componentes/RegistrationSuccessStep'
import { RegistrationWizardShell } from '../componentes/RegistrationWizardShell'
import { ReviewRegistrationStep } from '../componentes/ReviewRegistrationStep'
import { WizardFooter } from '../componentes/WizardFooter'
import type { CurrentUser } from '../auth.types'
import type { RegistrationStep, RegistrationWizardData, WizardStepMeta } from '../componentes/registrationWizard.types'
import { useAuthenticatedApi } from '../hooks/useAuthenticatedApi'
import { useCurrentUser } from '../hooks/useCurrentUser'

const initialData: RegistrationWizardData = {
  role: 'consumidor',
  firstName: '',
  lastName: '',
  email: '',
  consentAccepted: false,
  producerName: '',
  producerNif: '',
  municipality: '',
  producerAddressLine1: '',
  producerAddressLine2: '',
  producerPostalCode: '',
  producerProvince: 'Alicante',
  productTypes: [],
  producerDescription: '',
}

export function RegistroWizardPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const authenticatedApiRequest = useAuthenticatedApi()
  const { isAuthenticated, isLoading, logout } = useAuth0()
  const currentUserQuery = useCurrentUser()
  const [data, setData] = useState<RegistrationWizardData>(initialData)
  const [currentStep, setCurrentStep] = useState<RegistrationStep>('profile')
  const [submitError, setSubmitError] = useState<string | null>(null)

  const currentUser = currentUserQuery.data
  const wizardData: RegistrationWizardData = {
    ...data,
    email: currentUser?.email ?? data.email,
    firstName: data.firstName || currentUser?.firstName || '',
    lastName: data.lastName || currentUser?.lastName || '',
  }

  const consumerOnboarding = useMutation({
    mutationFn: async (input: { firstName: string; lastName: string }) => {
      return authenticatedApiRequest<CurrentUser>('/users/me/onboarding/consumer', {
        method: 'POST',
        body: input,
      })
    },
    onSuccess: (user) => {
      queryClient.setQueryData(['auth', 'current-user'], user)
      void queryClient.invalidateQueries({ queryKey: ['auth', 'current-user'] })
      navigate('/productos', { replace: true })
    },
  })

  const producerOnboarding = useMutation({
    mutationFn: async (input: ProducerOnboardingPayload) => {
      return authenticatedApiRequest<CurrentUser>('/users/me/onboarding/producer', {
        method: 'POST',
        body: input,
      })
    },
    onSuccess: (user) => {
      queryClient.setQueryData(['auth', 'current-user'], user)
      void queryClient.invalidateQueries({ queryKey: ['auth', 'current-user'] })
      navigate('/productor/productos', { replace: true })
    },
  })

  if (isLoading) {
    return <AuthLoadingState />
  }

  if (!isAuthenticated) {
    return <Auth0Redirect mode="signup" returnTo="/registro" />
  }

  if (currentUserQuery.isLoading) {
    return <AuthLoadingState message="Sincronizando tu cuenta..." />
  }

  if (currentUserQuery.isError || !currentUser) {
    return <AuthErrorState error={currentUserQuery.error} />
  }

  if (currentUser.role !== 'PENDING_ROLE') {
    return <Navigate to={homePathForRole(currentUser.role)} replace />
  }

  const steps: WizardStepMeta[] = wizardData.role === 'productor'
    ? [
        { id: 'profile', label: 'Perfil' },
        { id: 'basic', label: 'Datos' },
        { id: 'producer', label: 'Detalles' },
        { id: 'review', label: 'Fin' },
      ]
    : [
        { id: 'profile', label: 'Perfil' },
        { id: 'basic', label: 'Datos' },
        { id: 'review', label: 'Fin' },
      ]

  const currentIndex = steps.findIndex((step) => step.id === currentStep)
  const stepCounter = currentStep === 'success' ? '' : `Paso ${currentIndex + 1} de ${steps.length}`
  const progressSteps: WizardStepMeta[] = currentStep === 'success'
    ? [...steps, { id: 'success', label: 'Listo' }]
    : steps

  function finishPath() {
    return wizardData.role === 'productor' ? '/productor/productos' : '/productos'
  }

  function updateData(updates: Partial<RegistrationWizardData>) {
    setSubmitError(null)
    setData((currentData) => ({ ...currentData, ...updates }))
  }

  function exitRegistration() {
    void logout({ logoutParams: { returnTo: window.location.origin } })
  }

  function goToNextStep() {
    if (currentStep === 'profile') {
      setCurrentStep('basic')
      return
    }

    if (currentStep === 'basic') {
      setCurrentStep(wizardData.role === 'productor' ? 'producer' : 'review')
      return
    }

    if (currentStep === 'producer') {
      setCurrentStep('review')
      return
    }

    if (currentStep === 'review') {
      finishRegistration()
    }
  }

  function finishRegistration() {
    const firstName = wizardData.firstName.trim()
    const lastName = wizardData.lastName.trim()

    if (!firstName || !lastName) {
      setSubmitError('Completa nombre y apellido antes de finalizar el registro.')
      return
    }

    if (!wizardData.consentAccepted) {
      setSubmitError('Debes aceptar la política de privacidad y los términos para continuar.')
      return
    }

    setSubmitError(null)
    if (wizardData.role === 'consumidor') {
      consumerOnboarding.mutate({ firstName, lastName })
      return
    }

    const producerPayload = buildProducerPayload(wizardData, firstName, lastName)
    if ('error' in producerPayload) {
      setSubmitError(producerPayload.error)
      return
    }

    producerOnboarding.mutate(producerPayload.value)
  }

  function onboardingErrorMessage() {
    if (submitError) return submitError
    if (consumerOnboarding.error instanceof ApiError) return consumerOnboarding.error.message
    if (producerOnboarding.error instanceof ApiError) return producerOnboarding.error.message
    if (consumerOnboarding.isError) return 'No se pudo finalizar el registro. Inténtalo de nuevo.'
    if (producerOnboarding.isError) return 'No se pudo finalizar el registro de productor. Inténtalo de nuevo.'

    return null
  }

  const isSubmitting = consumerOnboarding.isPending || producerOnboarding.isPending

  function goToPreviousStep() {
    if (currentStep === 'basic') {
      setCurrentStep('profile')
      return
    }

    if (currentStep === 'producer') {
      setCurrentStep('basic')
      return
    }

    if (currentStep === 'review') {
      setCurrentStep(wizardData.role === 'productor' ? 'producer' : 'basic')
    }
  }

  if (currentStep === 'success') {
    return (
      <RegistrationWizardShell variant="success">
        <RegistrationProgress steps={progressSteps} currentStep={currentStep} />
        <RegistrationSuccessStep role={wizardData.role} onPrimaryAction={() => navigate(finishPath())} />
      </RegistrationWizardShell>
    )
  }

  if (currentStep === 'review') {
    return (
      <RegistrationWizardShell onExit={exitRegistration}>
        <RegistrationProgress steps={progressSteps} currentStep={currentStep} />
        <ReviewRegistrationStep data={wizardData} />
        {onboardingErrorMessage() ? (
          <p className="mx-auto w-full max-w-3xl px-[var(--space-margin-mobile)] pb-4 text-label-md text-red-700 md:px-0">
            {onboardingErrorMessage()}
          </p>
        ) : null}
        <WizardFooter
          currentLabel={stepCounter}
          onBack={goToPreviousStep}
          onNext={goToNextStep}
          nextLabel="Finalizar registro"
          nextLoading={isSubmitting}
        />
      </RegistrationWizardShell>
    )
  }

  return (
    <RegistrationWizardShell onExit={exitRegistration}>
      <RegistrationProgress steps={progressSteps} currentStep={currentStep} />
      {currentStep === 'profile' && (
        <ProfileTypeStep
          selectedRole={wizardData.role}
          email={wizardData.email}
          onSelectRole={(role) => updateData({ role })}
        />
      )}
      {currentStep === 'basic' && <BasicDataStep data={wizardData} onChange={updateData} />}
      {currentStep === 'producer' && <ProducerInfoStep data={wizardData} onChange={updateData} />}
      <WizardFooter currentLabel={stepCounter} onBack={goToPreviousStep} onNext={goToNextStep} backLabel="Atrás" nextLabel="Continuar" />
    </RegistrationWizardShell>
  )
}

type ProducerOnboardingPayload = {
  firstName: string
  lastName: string
  businessName: string
  nif: string
  description: string
  address: {
    line1: string
    line2?: string
    city: string
    postalCode: string
    province: string
    country: 'ES'
  }
  categorySlugs: string[]
}

function buildProducerPayload(
  data: RegistrationWizardData,
  firstName: string,
  lastName: string,
): { value: ProducerOnboardingPayload } | { error: string } {
  const businessName = data.producerName.trim()
  const nif = data.producerNif.trim().toUpperCase()
  const description = data.producerDescription.trim()
  const line1 = data.producerAddressLine1.trim()
  const line2 = data.producerAddressLine2.trim()
  const city = data.municipality.trim()
  const postalCode = data.producerPostalCode.trim()
  const province = data.producerProvince.trim()

  if (!businessName || !nif || !description || !line1 || !city || !postalCode || !province) {
    return { error: 'Completa todos los datos obligatorios del productor antes de finalizar.' }
  }

  if (data.productTypes.length === 0) {
    return { error: 'Selecciona al menos un tipo de producto.' }
  }

  return {
    value: {
      firstName,
      lastName,
      businessName,
      nif,
      description,
      address: {
        line1,
        ...(line2 ? { line2 } : {}),
        city,
        postalCode,
        province,
        country: 'ES',
      },
      categorySlugs: data.productTypes,
    },
  }
}

function RegistrationProgress({ steps, currentStep }: { steps: WizardStepMeta[]; currentStep: RegistrationStep }) {
  return (
    <div className="mx-auto w-full max-w-[var(--layout-container-max)] px-[var(--space-margin-mobile)] pt-6 md:px-[var(--space-margin-desktop)] md:pt-8">
      <RegistrationStepper steps={steps} currentStep={currentStep} />
    </div>
  )
}
