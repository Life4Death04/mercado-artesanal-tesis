import { useState } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Navigate, useNavigate } from 'react-router-dom'
import { ApiError } from '../../../lib/api'
import { ERROR_MESSAGES } from '../../../lib/errorMessages'
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

  const isSubmitting = consumerOnboarding.isPending || producerOnboarding.isPending
  const onboardingError = getOnboardingError(
    submitError,
    consumerOnboarding.error ?? producerOnboarding.error,
    producerOnboarding.isError,
  )

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
        {onboardingError ? <OnboardingErrorSummary error={onboardingError} /> : null}
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

type OnboardingError = {
  summary: string
  fields: { field: string; message: string }[]
  fallback: string[]
}

const onboardingFieldLabels: Record<string, string> = {
  firstName: 'Nombre',
  lastName: 'Apellido',
  businessName: 'Nombre del emprendimiento',
  nif: 'NIF/CIF',
  description: 'Descripción del productor',
  'address.line1': 'Dirección',
  'address.line2': 'Piso o puerta',
  'address.city': 'Municipio',
  'address.postalCode': 'Código postal',
  'address.province': 'Provincia',
  categorySlugs: 'Tipos de producto',
}

function getOnboardingError(submitError: string | null, error: unknown, producerFailed: boolean): OnboardingError | null {
  if (submitError) return { summary: submitError, fields: [], fallback: [] }

  if (error instanceof ApiError) {
    const knownMessage = getKnownApiErrorMessage(error.payload)
    const issues = extractValidationIssues(error.payload)
    const hasStructuredValidationIssues =
      issues.length > 0 &&
      typeof error.payload === 'object' &&
      error.payload !== null &&
      'code' in error.payload &&
      error.payload.code === 'VALIDATION_FAILED'

    if (knownMessage && !hasStructuredValidationIssues) return { summary: knownMessage, fields: [], fallback: [] }

    const fields: OnboardingError['fields'] = []
    const fallback: string[] = []

    for (const issue of issues) {
      const label = issue.field ? onboardingFieldLabels[normalizeFieldPath(issue.field)] : undefined
      const message = translateValidationMessage(issue.message, Boolean(label))
      if (label) fields.push({ field: label, message })
      else fallback.push(message)
    }

    if (fields.length > 0 || fallback.length > 0) {
      return { summary: 'Revisa los datos indicados antes de finalizar el registro.', fields, fallback }
    }

    return {
      summary: 'No se pudo validar el registro.',
      fields: [],
      fallback: ['Revisa los datos del formulario e inténtalo de nuevo.'],
    }
  }

  if (!error) return null
  return {
    summary: producerFailed ? 'No se pudo finalizar el registro de productor.' : 'No se pudo finalizar el registro.',
    fields: [],
    fallback: ['Inténtalo de nuevo.'],
  }
}

function getKnownApiErrorMessage(payload: unknown): string | null {
  if (typeof payload !== 'object' || payload === null || !('code' in payload) || typeof payload.code !== 'string') return null
  return ERROR_MESSAGES[payload.code] ?? null
}

function translateValidationMessage(message: string, hasFieldLabel: boolean): string {
  const normalized = message.trim().toLocaleLowerCase('en')
  const fieldFallback = hasFieldLabel ? 'El valor proporcionado no es válido.' : 'Hay un dato del formulario que no es válido.'

  if (/required|should not be empty|must not be empty|is not allowed to be empty/.test(normalized)) {
    return 'Este campo es obligatorio.'
  }
  if (/must be (a )?(string|text)/.test(normalized)) return 'Introduce un texto válido.'
  if (/must be (an )?array|must be a list/.test(normalized)) return 'Selecciona una lista de opciones válida.'
  if (/must (contain|have) at least one|at least 1 (element|item)/.test(normalized)) return 'Selecciona al menos una opción.'
  if (/must be (a )?valid e-?mail|invalid e-?mail/.test(normalized)) return 'Introduce un correo electrónico válido.'
  if (/must be longer than|too short|minimum length|minlength/.test(normalized)) return 'El valor es demasiado corto.'
  if (/must be shorter than|too long|maximum length|maxlength/.test(normalized)) return 'El valor es demasiado largo.'
  if (/must match|invalid format|must be valid|is invalid/.test(normalized)) return 'El formato introducido no es válido.'
  if (/must be one of|must be a valid enum|unsupported value/.test(normalized)) return 'Selecciona una opción válida.'

  return fieldFallback
}

function extractValidationIssues(payload: unknown): { field?: string; message: string }[] {
  if (typeof payload !== 'object' || payload === null || !('errors' in payload)) return []
  const errors = payload.errors

  if (Array.isArray(errors)) {
    return errors.flatMap((error) => {
      if (typeof error === 'string') return [{ message: error }]
      if (typeof error !== 'object' || error === null) return []
      const field = ['field', 'path', 'property'].map((key) => key in error ? error[key as keyof typeof error] : undefined).find((value) => typeof value === 'string')
      const message = ['message', 'detail'].map((key) => key in error ? error[key as keyof typeof error] : undefined).find((value) => typeof value === 'string')
      return typeof message === 'string' ? [{ ...(typeof field === 'string' ? { field } : {}), message }] : []
    })
  }

  if (typeof errors === 'object' && errors !== null) {
    return Object.entries(errors).flatMap(([field, value]) => {
      if (typeof value === 'string') return [{ field, message: value }]
      if (Array.isArray(value)) return value.filter((message): message is string => typeof message === 'string').map((message) => ({ field, message }))
      if (typeof value === 'object' && value !== null && 'message' in value && typeof value.message === 'string') return [{ field, message: value.message }]
      return []
    })
  }

  return []
}

function normalizeFieldPath(field: string): string {
  return field
    .replace(/^body\./, '')
    .replace(/\[(\w+)\]/g, '.$1')
    .split('.')
    .filter((segment) => !/^\d+$/.test(segment))
    .join('.')
}

function OnboardingErrorSummary({ error }: { error: OnboardingError }) {
  return (
    <section role="alert" aria-live="assertive" className="mx-auto mb-4 w-[calc(100%-2*var(--space-margin-mobile))] max-w-3xl border-l-4 border-[var(--color-error)] bg-[var(--color-error-container)] px-5 py-4 text-[var(--color-on-error-container)] md:w-full">
      <h3 className="text-label-md">{error.summary}</h3>
      {error.fields.length > 0 ? <ul className="text-body-md mt-3 list-disc space-y-1 pl-5">{error.fields.map((issue, index) => <li key={`${issue.field}-${index}`}><strong>{issue.field}:</strong> {issue.message}</li>)}</ul> : null}
      {error.fallback.length > 0 ? <div className="text-body-md mt-3 space-y-1">{error.fallback.map((message, index) => <p key={`${message}-${index}`}>{message}</p>)}</div> : null}
    </section>
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
