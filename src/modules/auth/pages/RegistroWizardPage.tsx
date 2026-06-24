import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BasicDataStep } from '../componentes/BasicDataStep'
import { ProducerInfoStep } from '../componentes/ProducerInfoStep'
import { ProfileTypeStep } from '../componentes/ProfileTypeStep'
import { RegistrationStepper } from '../componentes/RegistrationStepper'
import { RegistrationSuccessStep } from '../componentes/RegistrationSuccessStep'
import { RegistrationWizardShell } from '../componentes/RegistrationWizardShell'
import { ReviewRegistrationStep } from '../componentes/ReviewRegistrationStep'
import { WizardFooter } from '../componentes/WizardFooter'
import type { RegistrationStep, RegistrationWizardData, WizardStepMeta } from '../componentes/registrationWizard.types'

const initialData: RegistrationWizardData = {
  role: 'consumidor',
  name: 'Usuario Ejemplo',
  email: 'usuario@ejemplo.com',
  consentAccepted: false,
  producerName: 'Finca El Reloj',
  municipality: 'Jijona',
  productTypes: ['Aceites', 'Turrones'],
  producerDescription: '',
}

export function RegistroWizardPage() {
  const navigate = useNavigate()
  const [data, setData] = useState<RegistrationWizardData>(initialData)
  const [currentStep, setCurrentStep] = useState<RegistrationStep>('profile')

  const steps: WizardStepMeta[] = data.role === 'productor'
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
    return data.role === 'productor' ? '/productor/perfil' : '/productos'
  }

  function updateData(updates: Partial<RegistrationWizardData>) {
    setData((currentData) => ({ ...currentData, ...updates }))
  }

  function goToNextStep() {
    if (currentStep === 'profile') {
      setCurrentStep('basic')
      return
    }

    if (currentStep === 'basic') {
      setCurrentStep(data.role === 'productor' ? 'producer' : 'review')
      return
    }

    if (currentStep === 'producer') {
      setCurrentStep('review')
      return
    }

    if (currentStep === 'review') {
      setCurrentStep('success')
    }
  }

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
      setCurrentStep(data.role === 'productor' ? 'producer' : 'basic')
    }
  }

  if (currentStep === 'success') {
    return (
      <RegistrationWizardShell variant="success">
        <RegistrationProgress steps={progressSteps} currentStep={currentStep} />
        <RegistrationSuccessStep role={data.role} onPrimaryAction={() => navigate(finishPath())} />
      </RegistrationWizardShell>
    )
  }

  if (currentStep === 'review') {
    return (
      <RegistrationWizardShell onExit={() => navigate('/login')}>
        <RegistrationProgress steps={progressSteps} currentStep={currentStep} />
        <ReviewRegistrationStep data={data} />
        <WizardFooter
          currentLabel={stepCounter}
          onBack={goToPreviousStep}
          onNext={goToNextStep}
          nextLabel="Finalizar registro"
        />
      </RegistrationWizardShell>
    )
  }

  return (
    <RegistrationWizardShell onExit={() => navigate('/login')}>
      <RegistrationProgress steps={progressSteps} currentStep={currentStep} />
      {currentStep === 'profile' && (
        <ProfileTypeStep
          selectedRole={data.role}
          email={data.email}
          onSelectRole={(role) => updateData({ role })}
        />
      )}
      {currentStep === 'basic' && <BasicDataStep data={data} onChange={updateData} />}
      {currentStep === 'producer' && <ProducerInfoStep data={data} onChange={updateData} />}
      <WizardFooter currentLabel={stepCounter} onBack={goToPreviousStep} onNext={goToNextStep} backLabel="Atrás" nextLabel="Continuar" />
    </RegistrationWizardShell>
  )
}

function RegistrationProgress({ steps, currentStep }: { steps: WizardStepMeta[]; currentStep: RegistrationStep }) {
  return (
    <div className="mx-auto w-full max-w-[var(--layout-container-max)] px-[var(--space-margin-mobile)] pt-6 md:px-[var(--space-margin-desktop)] md:pt-8">
      <RegistrationStepper steps={steps} currentStep={currentStep} />
    </div>
  )
}
