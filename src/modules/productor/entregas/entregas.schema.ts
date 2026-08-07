import { z } from 'zod'

export const DeliveryModeTypeSchema = z.enum(
  ['PERSONAL_DELIVERY', 'PICKUP', 'SHIPPING_FLAT_RATE'],
  { error: 'Tipo de modalidad de entrega desconocido.' },
)

export type DeliveryModeType = z.infer<typeof DeliveryModeTypeSchema>

const decimalStringSchema = z
  .string()
  .regex(/^\d+(\.\d+)?$/, 'El coste recibido debe ser una cadena decimal válida.')

export const deliveryModeSchema = z
  .object({
    id: z.string().min(1),
    producerId: z.string().min(1),
    type: DeliveryModeTypeSchema,
    cost: decimalStringSchema,
    coverageZone: z.string().nullable(),
    carrierCompany: z.string().nullable(),
    notes: z.string().nullable(),
    pickupLocation: z.string().nullable(),
    pickupLocationName: z.string().nullable(),
    pickupStreet: z.string().nullable(),
    pickupMunicipality: z.string().nullable(),
    pickupPostalCode: z.string().nullable(),
    pickupOpeningHours: z.string().nullable(),
    isActive: z.boolean(),
    createdAt: z.iso.datetime(),
    updatedAt: z.iso.datetime(),
  })
  .passthrough()

export const deliveryModeListSchema = z.array(deliveryModeSchema)

export type DeliveryModeDTO = z.infer<typeof deliveryModeSchema>

const optionalConfigurationFields = {
  coverageZone: z.string().trim().min(1).max(255, 'El ámbito de cobertura no puede superar 255 caracteres.').optional(),
  carrierCompany: z.string().trim().min(1).max(120, 'La empresa de transporte no puede superar 120 caracteres.').optional(),
  notes: z.string().trim().min(1).max(1000, 'Las notas no pueden superar 1000 caracteres.').optional(),
  pickupLocation: z.string().trim().min(1).max(500, 'La ubicación no puede superar 500 caracteres.').optional(),
  pickupLocationName: z.string().trim().min(1).max(120, 'El nombre del punto no puede superar 120 caracteres.').optional(),
  pickupStreet: z.string().trim().min(1).max(255, 'La calle no puede superar 255 caracteres.').optional(),
  pickupMunicipality: z.string().trim().min(1).max(120, 'El municipio no puede superar 120 caracteres.').optional(),
  pickupPostalCode: z.string().regex(/^\d{5}$/, 'El código postal debe tener 5 dígitos.').optional(),
  pickupOpeningHours: z.string().trim().min(1).max(500, 'El horario no puede superar 500 caracteres.').optional(),
}

const deliveryModeCostSchema = z
  .number()
  .nonnegative('El coste no puede ser negativo.')
  .max(99_999_999.99, 'El coste indicado está fuera del rango permitido.')
  .multipleOf(0.01, 'El coste debe tener como máximo 2 decimales.')

export const createDeliveryModePayloadSchema = z
  .object({
    type: DeliveryModeTypeSchema,
    cost: deliveryModeCostSchema,
    ...optionalConfigurationFields,
  })
  .strict()

const nullableConfigurationFields = {
  coverageZone: optionalConfigurationFields.coverageZone.unwrap().nullable().optional(),
  carrierCompany: optionalConfigurationFields.carrierCompany.unwrap().nullable().optional(),
  notes: optionalConfigurationFields.notes.unwrap().nullable().optional(),
  pickupLocation: optionalConfigurationFields.pickupLocation.unwrap().nullable().optional(),
  pickupLocationName: optionalConfigurationFields.pickupLocationName.unwrap().nullable().optional(),
  pickupStreet: optionalConfigurationFields.pickupStreet.unwrap().nullable().optional(),
  pickupMunicipality: optionalConfigurationFields.pickupMunicipality.unwrap().nullable().optional(),
  pickupPostalCode: optionalConfigurationFields.pickupPostalCode.unwrap().nullable().optional(),
  pickupOpeningHours: optionalConfigurationFields.pickupOpeningHours.unwrap().nullable().optional(),
}

export const updateDeliveryModePayloadSchema = z
  .object({
    type: DeliveryModeTypeSchema.optional(),
    cost: deliveryModeCostSchema.optional(),
    ...nullableConfigurationFields,
    isActive: z.boolean().optional(),
  })
  .strict()

export type CreateDeliveryModePayload = z.infer<typeof createDeliveryModePayloadSchema>
export type UpdateDeliveryModePayload = z.infer<typeof updateDeliveryModePayloadSchema>

export const pickupPointFormSchema = z
  .object({
    nombre: z.string().trim().min(1, 'El nombre del punto es obligatorio.').max(120, 'El nombre del punto no puede superar 120 caracteres.'),
    calle: z.string().trim().min(1, 'La calle es obligatoria.').max(255, 'La calle no puede superar 255 caracteres.'),
    municipio: z.string().trim().min(1, 'El municipio es obligatorio.').max(120, 'El municipio no puede superar 120 caracteres.'),
    codigoPostal: z
      .string()
      .regex(/^\d{5}$/, 'El código postal debe tener 5 dígitos.'),
    horario: z.string().trim().min(1, 'El horario es obligatorio.').max(500, 'El horario no puede superar 500 caracteres.'),
    indicaciones: z.string().trim().max(1000, 'Las indicaciones no pueden superar 1000 caracteres.').nullable().optional(),
  })
  .strict()

export type PickupPointFormValues = z.output<typeof pickupPointFormSchema>
