import { z } from 'zod'

export const profileFormSchema = z.object({
  firstName: z.string().trim().min(1, 'El nombre es obligatorio'),
  lastName: z.string().trim().min(1, 'El apellido es obligatorio'),
})

export type ProfileFormValues = z.infer<typeof profileFormSchema>
