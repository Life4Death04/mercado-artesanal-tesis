import { zodResolver } from '@hookform/resolvers/zod'
import { ChevronRight, MapPin, Plus } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { resolveErrorMessage } from '../../../lib/errorMessages'
import type { CurrentUser } from '../../auth/auth.types'
import { useCurrentUser } from '../../auth/hooks/useCurrentUser'
import { AgregarDireccionModal, EditarDireccionModal } from '../componentes/ProfileModals'
import type { Address, CreateAddressInput, UpdateAddressInput } from '../direcciones.schema'
import { useAddressesQuery } from '../hooks/useAddressesQuery'
import { useCreateAddressMutation } from '../hooks/useCreateAddressMutation'
import { useDeleteAddressMutation } from '../hooks/useDeleteAddressMutation'
import { useUpdateAddressMutation } from '../hooks/useUpdateAddressMutation'
import { useUpdateProfileMutation } from '../hooks/useUpdateProfileMutation'
import { profileFormSchema, type ProfileFormValues } from '../perfil.schema'

export function PerfilPage() {
  const [isEditing, setIsEditing] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingAddress, setEditingAddress] = useState<Address | null>(null)

  const currentUserQuery = useCurrentUser()
  const updateProfileMutation = useUpdateProfileMutation()
  const addressesQuery = useAddressesQuery()
  const createAddressMutation = useCreateAddressMutation()
  const editAddressMutation = useUpdateAddressMutation()
  const markDefaultMutation = useUpdateAddressMutation()
  const deleteAddressMutation = useDeleteAddressMutation()

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: { firstName: '', lastName: '' },
  })

  const currentUser = currentUserQuery.data
  const [draftFirstName, draftLastName] = useWatch({
    control,
    name: ['firstName', 'lastName'],
  })

  useEffect(() => {
    if (currentUser && !isEditing) reset(toProfileFormValues(currentUser))
  }, [currentUser, isEditing, reset])

  const addresses = addressesQuery.data ?? []
  const addressListError = addressesQuery.isError ? resolveErrorMessage(addressesQuery.error) : null
  const addressActionError = [markDefaultMutation, deleteAddressMutation].find((mutation) => mutation.isError)?.error

  function handleStartEditing() {
    if (!currentUser) return
    reset(toProfileFormValues(currentUser))
    updateProfileMutation.reset()
    setIsEditing(true)
  }

  function handleCancelEditing() {
    if (currentUser) reset(toProfileFormValues(currentUser))
    updateProfileMutation.reset()
    setIsEditing(false)
  }

  function handleSaveProfile(values: ProfileFormValues) {
    updateProfileMutation.mutate(values, {
      onSuccess: (updatedUser) => {
        reset(toProfileFormValues(updatedUser))
        setIsEditing(false)
      },
    })
  }

  function handleCloseAddModal() {
    setShowAddModal(false)
    createAddressMutation.reset()
  }

  function handleSaveAddress(input: CreateAddressInput) {
    createAddressMutation.mutate(input, { onSuccess: () => setShowAddModal(false) })
  }

  function handleCloseEditModal() {
    setEditingAddress(null)
    editAddressMutation.reset()
  }

  function handleEditAddress(updates: UpdateAddressInput) {
    if (!editingAddress) return

    editAddressMutation.mutate(
      { addressId: editingAddress.id, input: updates },
      { onSuccess: () => setEditingAddress(null) },
    )
  }

  function handleDeleteAddress(addressId: string) {
    deleteAddressMutation.mutate(addressId)
  }

  function handleMarkDefault(addressId: string) {
    markDefaultMutation.mutate({ addressId, input: { isDefault: true } })
  }

  const previewUser = currentUser
    ? isEditing
      ? { ...currentUser, firstName: draftFirstName, lastName: draftLastName }
      : currentUser
    : undefined
  const previewName = getDisplayName(previewUser)
  const initials = getInitials(previewName)

  return (
    <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-on-surface)]">
      <main className="mx-auto max-w-[800px] px-[var(--space-margin-mobile)] py-16 md:px-0">
        <section className="mb-16">
          <nav aria-label="Breadcrumb" className="text-label-sm mb-4 flex items-center gap-2 text-[var(--color-on-surface-variant)]/70">
            <Link to="/productos" className="transition-colors hover:text-[var(--color-primary)]">
              Área consumidor
            </Link>
            <ChevronRight size={14} strokeWidth={1.8} />
            <span className="text-[var(--color-on-surface)]">Mi perfil</span>
          </nav>
          <h1 className="text-headline-lg text-[var(--color-on-surface)]">Mi perfil</h1>
          <p className="text-body-md mt-2 text-[var(--color-on-surface-variant)]">
            Gestiona tu información personal, direcciones y preferencias de cuenta.
          </p>
        </section>

        <section className="mb-20">
          <div className="mb-8 flex items-end justify-between">
            <h2 className="text-headline-md text-[var(--color-on-surface)]">Datos personales</h2>
          </div>

          {currentUserQuery.isLoading && !currentUser ? (
            <p className="text-body-md rounded-[var(--radius-default)] border border-[var(--color-outline-variant)] p-8 text-center text-[var(--color-on-surface-variant)]">
              Cargando datos del perfil...
            </p>
          ) : currentUserQuery.isError && !currentUser ? (
            <div className="rounded-[var(--radius-default)] bg-[var(--color-error-container)] p-6">
              <p role="alert" className="text-body-md text-[var(--color-error)]">
                {resolveErrorMessage(currentUserQuery.error)}
              </p>
              <button
                type="button"
                onClick={() => currentUserQuery.refetch()}
                className="text-label-md mt-4 text-[#7A2E3A] underline underline-offset-4"
              >
                Reintentar
              </button>
            </div>
          ) : currentUser ? (
            <form className="space-y-10" onSubmit={handleSubmit(handleSaveProfile)} noValidate>
            <article className="rounded-[var(--radius-xl)] border border-[var(--color-outline-variant)] bg-[var(--color-surface-container-lowest)] shadow-[0_18px_50px_-35px_rgba(122,46,58,0.18)]">
              <div className="relative h-48 md:h-56">
                <div
                  aria-hidden="true"
                  className="h-full overflow-hidden rounded-t-[var(--radius-xl)] bg-[radial-gradient(circle_at_18%_25%,rgba(255,255,255,0.34),transparent_24%),linear-gradient(125deg,#7A2E3A_0%,#B87357_48%,#D9B88F_100%)]"
                >
                  <div className="h-full bg-[linear-gradient(105deg,transparent_48%,rgba(255,255,255,0.12)_48%,rgba(255,255,255,0.12)_50%,transparent_50%)] bg-[length:32px_32px]" />
                </div>

                <div className="absolute -bottom-12 left-5 z-10 flex size-24 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-[#F1E4D3] shadow-[0_18px_40px_-18px_rgba(0,0,0,0.35)] md:left-8 md:size-28">
                  {currentUser.avatar ? (
                    <img src={currentUser.avatar} alt={`Foto de perfil de ${previewName}`} className="h-full w-full object-cover" />
                  ) : (
                    <span className="text-headline-md text-[#7A2E3A]" aria-label={`Iniciales de ${previewName}`}>
                      {initials}
                    </span>
                  )}
                </div>
              </div>

              <div className="px-5 pb-6 pt-16 md:px-8 md:pt-18">
                <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                  <div>
                    <p className="text-label-sm mb-2 uppercase tracking-[0.18em] text-[var(--color-outline)]">
                      Previsualización del perfil
                    </p>
                    <h3 className="text-headline-md text-[var(--color-on-surface)]">{previewName}</h3>
                    <p className="text-body-md mt-2 text-[var(--color-on-surface-variant)]">
                      Tu identidad dentro del área de consumidor.
                    </p>
                  </div>
                </div>
              </div>
            </article>

            <div className="grid grid-cols-1 gap-[var(--space-gutter)] md:grid-cols-2">
              <div className="flex flex-col gap-2">
                <label htmlFor="firstName" className="text-label-md uppercase tracking-wider text-[var(--color-outline)]">Nombre</label>
                <input
                  id="firstName"
                  type="text"
                  disabled={!isEditing || updateProfileMutation.isPending}
                  aria-invalid={errors.firstName ? 'true' : 'false'}
                  aria-describedby={errors.firstName ? 'firstName-error' : undefined}
                  {...register('firstName')}
                  className="text-body-md border-b border-[var(--color-outline-variant)] bg-transparent py-2 transition-colors focus:border-[#7A2E3A] focus:outline-none disabled:cursor-not-allowed disabled:opacity-70"
                />
                {errors.firstName ? <p id="firstName-error" className="text-label-sm text-[var(--color-error)]">{errors.firstName.message}</p> : null}
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="lastName" className="text-label-md uppercase tracking-wider text-[var(--color-outline)]">Apellido</label>
                <input
                  id="lastName"
                  type="text"
                  disabled={!isEditing || updateProfileMutation.isPending}
                  aria-invalid={errors.lastName ? 'true' : 'false'}
                  aria-describedby={errors.lastName ? 'lastName-error' : undefined}
                  {...register('lastName')}
                  className="text-body-md border-b border-[var(--color-outline-variant)] bg-transparent py-2 transition-colors focus:border-[#7A2E3A] focus:outline-none disabled:cursor-not-allowed disabled:opacity-70"
                />
                {errors.lastName ? <p id="lastName-error" className="text-label-sm text-[var(--color-error)]">{errors.lastName.message}</p> : null}
              </div>
            </div>

            <div className="grid grid-cols-1 items-center gap-[var(--space-gutter)] md:grid-cols-2">
              <div className="flex flex-col gap-2">
                <span className="text-label-md uppercase tracking-wider text-[var(--color-outline)]">
                  Correo electrónico
                </span>
                <div className="flex items-center gap-3 py-2">
                   <span className="text-body-md break-all text-[var(--color-on-surface-variant)]">{currentUser.email}</span>
                   <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-tighter ${currentUser.emailVerified ? 'bg-[var(--color-secondary-container)] text-[var(--color-on-secondary-container)]' : 'bg-[var(--color-surface-container-low)] text-[var(--color-outline)]'}`}>
                     {currentUser.emailVerified ? 'Verificado' : 'Sin verificar'}
                   </span>
                 </div>
                 <p className="text-label-sm text-[var(--color-outline)] italic">El correo se gestiona desde tu cuenta de acceso.</p>
               </div>
             </div>

            <div aria-live="polite" aria-atomic="true" className="min-h-6">
              {updateProfileMutation.isSuccess && !isEditing ? <p className="text-body-sm text-[#7A2E3A]">Los cambios se guardaron correctamente.</p> : null}
              {updateProfileMutation.isError ? <p role="alert" className="text-body-sm text-[var(--color-error)]">{resolveErrorMessage(updateProfileMutation.error)}</p> : null}
            </div>

            <div className="flex flex-col gap-3 pt-2 sm:flex-row">
              {isEditing ? (
                <>
                  <button type="submit" disabled={updateProfileMutation.isPending} className="text-label-md bg-[#7A2E3A] px-10 py-4 uppercase tracking-widest text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50">
                    {updateProfileMutation.isPending ? 'Guardando...' : 'Guardar cambios'}
                  </button>
                  <button type="button" onClick={handleCancelEditing} disabled={updateProfileMutation.isPending} className="text-label-md border border-[var(--color-outline-variant)] px-10 py-4 uppercase tracking-widest text-[var(--color-on-surface-variant)] disabled:cursor-not-allowed disabled:opacity-50">
                    Cancelar
                  </button>
                </>
              ) : (
                <button type="button" onClick={handleStartEditing} className="text-label-md bg-[#7A2E3A] px-10 py-4 uppercase tracking-widest text-white transition-opacity hover:opacity-90">
                  Editar perfil
                </button>
              )}
            </div>
            </form>
          ) : null}
        </section>

        <Divider />

        <section className="mb-20">
          <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <h2 className="text-headline-md text-[var(--color-on-surface)]">Mis direcciones</h2>
            <button
              type="button"
              onClick={() => setShowAddModal(true)}
              className="text-label-md flex items-center gap-2 text-[#7A2E3A] transition-opacity hover:opacity-70"
            >
              <Plus size={18} strokeWidth={1.8} />
              Añadir dirección
            </button>
          </div>

          {addressesQuery.isLoading ? (
            <p className="text-body-md py-10 text-center text-[var(--color-on-surface-variant)]">Cargando direcciones...</p>
          ) : addressListError ? (
            <p role="alert" className="text-body-md rounded-[var(--radius-default)] bg-[var(--color-error-container)] p-4 text-[var(--color-error)]">
              {addressListError}
            </p>
          ) : addresses.length > 0 ? (
            <div className="grid grid-cols-1 gap-[var(--space-gutter)] md:grid-cols-2">
              {addresses.map((addr) => (
                <AddressCard
                  key={addr.id}
                  address={addr}
                  onEdit={() => setEditingAddress(addr)}
                  onDelete={() => handleDeleteAddress(addr.id)}
                  onMarkDefault={() => handleMarkDefault(addr.id)}
                  isDeleting={deleteAddressMutation.isPending && deleteAddressMutation.variables === addr.id}
                  isMarkingDefault={markDefaultMutation.isPending && markDefaultMutation.variables?.addressId === addr.id}
                />
              ))}
            </div>
          ) : (
            <p className="text-body-md rounded-[var(--radius-default)] border border-dashed border-[var(--color-outline-variant)] p-8 text-center text-[var(--color-on-surface-variant)]">
              Aún no tienes direcciones guardadas.
            </p>
          )}
          {addressActionError ? (
            <p role="alert" className="text-body-md mt-6 text-[var(--color-error)]">
              {resolveErrorMessage(addressActionError)}
            </p>
          ) : null}
        </section>
      </main>
      {showAddModal ? (
        <AgregarDireccionModal
          onClose={handleCloseAddModal}
          onSave={handleSaveAddress}
          error={createAddressMutation.isError ? resolveErrorMessage(createAddressMutation.error) : null}
          isSaving={createAddressMutation.isPending}
        />
      ) : null}
      {editingAddress ? (
        <EditarDireccionModal
          address={editingAddress}
          onClose={handleCloseEditModal}
          onSave={handleEditAddress}
          error={editAddressMutation.isError ? resolveErrorMessage(editAddressMutation.error) : null}
          isSaving={editAddressMutation.isPending}
        />
      ) : null}
    </div>
  )
}

function toProfileFormValues(user: CurrentUser): ProfileFormValues {
  return { firstName: user.firstName ?? '', lastName: user.lastName ?? '' }
}

function getDisplayName(user: Pick<CurrentUser, 'firstName' | 'lastName' | 'name' | 'email'> | undefined): string {
  if (!user) return 'Perfil'
  const fullName = [user.firstName, user.lastName].filter(Boolean).join(' ').trim()
  return fullName || user.name || user.email
}

function getInitials(displayName: string): string {
  const initials = displayName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('')
  return initials || 'P'
}

function AddressCard({
  address,
  onEdit,
  onDelete,
  onMarkDefault,
  isDeleting = false,
  isMarkingDefault = false,
}: {
  address: Address
  onEdit: () => void
  onDelete: () => void
  onMarkDefault: () => void
  isDeleting?: boolean
  isMarkingDefault?: boolean
}) {
  return (
    <div
      className={`group border p-8 bg-white transition-all ${
        address.isDefault
          ? 'border-[var(--color-outline-variant)] shadow-[0_10px_30px_-15px_rgba(122,46,58,0.08)]'
          : 'border-[color-mix(in_srgb,var(--color-outline-variant)_50%,transparent)] bg-white/50 hover:border-[var(--color-outline-variant)] hover:bg-white'
      }`}
    >
      <div className="mb-4 flex items-start justify-between">
        <h3 className="text-label-md uppercase tracking-widest text-[var(--color-outline)]">{address.city}</h3>
        {address.isDefault ? (
          <span className="border border-[#7A2E3A] px-2 py-0.5 text-[10px] font-bold uppercase text-[#7A2E3A]">
            Predeterminada
          </span>
        ) : null}
      </div>

      <div className="text-body-md mb-6 flex items-start gap-2 leading-relaxed text-[var(--color-on-surface)]">
        <MapPin size={16} strokeWidth={1.8} className="mt-1 shrink-0 text-[var(--color-outline)]" />
        <span>
          {address.line1}
          {address.line2 ? (
            <>
              <br />
              {address.line2}
            </>
          ) : null}
          <br />
          {address.postalCode} {address.city}, {address.province}
        </span>
      </div>

      <div className="flex gap-4 border-t border-[color-mix(in_srgb,var(--color-outline-variant)_30%,transparent)] pt-4">
        <button type="button" onClick={onEdit} className="text-label-sm text-[var(--color-on-surface-variant)] transition-colors hover:text-[#7A2E3A]">
          Editar
        </button>
        <button
          type="button"
          onClick={onDelete}
          disabled={isDeleting}
          className="text-label-sm text-[var(--color-on-surface-variant)] transition-colors hover:text-[#7A2E3A] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isDeleting ? 'Eliminando...' : 'Eliminar'}
        </button>
        {!address.isDefault ? (
          <button
            type="button"
            onClick={onMarkDefault}
            disabled={isMarkingDefault}
            className="text-label-sm ml-auto text-[#7A2E3A]/60 transition-colors hover:text-[#7A2E3A] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isMarkingDefault ? 'Actualizando...' : 'Marcar predeterminada'}
          </button>
        ) : null}
      </div>
    </div>
  )
}

function Divider() {
  return <hr className="mb-20 h-px border-0 bg-[var(--color-outline-variant)] opacity-50" />
}
