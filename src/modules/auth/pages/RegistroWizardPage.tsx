import { useState } from 'react'
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
        <RegistrationSuccessStep role={data.role} />
      </RegistrationWizardShell>
    )
  }

  if (currentStep === 'review') {
    return (
      <RegistrationWizardShell>
        <ReviewRegistrationStep data={data} stepLabel={stepCounter} />
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
    <RegistrationWizardShell>
      <div className="mx-auto w-full max-w-[var(--layout-container-max)] px-[var(--space-margin-mobile)] md:px-[var(--space-margin-desktop)]">
        <div className="flex justify-end pt-6">
          <RegistrationStepper steps={steps} currentStep={currentStep} />
        </div>
      </div>
      {currentStep === 'profile' && (
        <ProfileTypeStep
          selectedRole={data.role}
          email={data.email}
          onSelectRole={(role) => updateData({ role })}
        />
      )}
      {currentStep === 'basic' && <BasicDataStep data={data} onChange={updateData} />}
      {currentStep === 'producer' && <ProducerInfoStep data={data} onChange={updateData} />}
      <WizardFooter currentLabel={stepCounter} onBack={goToPreviousStep} onNext={goToNextStep} backLabel="Back" nextLabel="Continue" />
    </RegistrationWizardShell>
  )
}
