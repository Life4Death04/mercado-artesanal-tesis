import { ApiError } from './api'

/**
 * Registry of backend AppError codes → neutral professional Spanish messages.
 *
 * Shape: Record<string, string> so adding a new code is a one-liner and the
 * resolver signature never changes (i18n-ready contract).
 */
export const ERROR_MESSAGES: Record<string, string> = {
  // --- Auth / access ---
  UNAUTHORIZED: 'Tu sesión ha expirado. Inicia sesión de nuevo para continuar.',
  FORBIDDEN: 'No tienes permiso para realizar esta acción.',
  ONBOARDING_REQUIRED: 'Debes completar el registro antes de continuar.',
  ACCOUNT_INACTIVE: 'Esta cuenta está desactivada. Actívala para restablecer su acceso.',
  ACCOUNT_DELETED: 'Esta cuenta ha sido eliminada y ya no admite cambios.',

  // --- Resource not found ---
  NOT_FOUND: 'No encontramos el recurso solicitado.',
  PRODUCT_NOT_FOUND: 'No encontramos el producto solicitado.',
  PRODUCER_NOT_FOUND: 'No encontramos tu perfil de productor.',
  DELIVERY_MODE_NOT_FOUND: 'No encontramos el modo de entrega especificado.',
  CATEGORY_NOT_FOUND: 'No encontramos la categoría indicada.',

  // --- Validation / conflict ---
  VALIDATION_FAILED: 'Los datos enviados no son válidos. Revisa el formulario e inténtalo de nuevo.',
  CONFLICT: 'Esta operación entra en conflicto con el estado actual. Recarga e inténtalo de nuevo.',
  ROLE_ALREADY_SET: 'El rol de esta cuenta ya está asignado y no puede cambiarse.',
  NIF_ALREADY_REGISTERED: 'Este NIF ya está registrado en otro productor.',
  UNKNOWN_CATEGORY: 'Una o más categorías indicadas no existen.',
  CATEGORY_SLUG_CONFLICT: 'Ya existe una categoría con un nombre equivalente. Elige otro nombre.',
  ADDRESS_DEFAULT_CONFLICT: 'Solo puede haber una dirección predeterminada. Revisa tu configuración de entregas.',

  // --- Business rule violations ---
  INVALID_DEFAULT_TRANSITION: 'Esta transición de estado no está permitida.',
  INVALID_ORDER_TRANSITION: 'El estado del pedido no puede cambiar a la opción seleccionada.',
  EMPTY_CART_CHECKOUT: 'Tu carrito está vacío. Añade productos antes de continuar con el pago.',
  CART_ITEM_NOT_AVAILABLE: 'Uno o más productos del carrito ya no están disponibles. Revisa el carrito antes de continuar.',
  INSUFFICIENT_STOCK: 'No hay stock suficiente para completar esta operación.',
  PAYMENT_INTENT_CREATION_FAILED: 'No se pudo preparar el pago. Revisa tu carrito e inténtalo de nuevo.',
  PRODUCT_HAS_ACTIVE_ORDERS: 'Este producto tiene pedidos activos y no puede modificarse ahora.',
  PRODUCER_HAS_ACTIVE_ORDERS: 'Tu cuenta tiene pedidos activos. Resuélvelos antes de continuar.',
  USER_HAS_ACTIVE_ORDERS: 'No puedes eliminar esta cuenta mientras tenga pedidos activos.',

  // --- Upload / media ---
  IMAGE_UPLOAD_INVALID: 'El archivo de imagen no es válido. Usa JPG, PNG o WebP de menos de 5 MB.',

  // --- Server errors ---
  INTERNAL_ERROR: 'Se produjo un error interno. Por favor, inténtalo más tarde.',
  SERVICE_UNAVAILABLE: 'El servicio no está disponible en este momento. Inténtalo de nuevo en unos minutos.',
  RATE_LIMITED: 'Has realizado demasiadas solicitudes. Espera un momento antes de continuar.',
}

const GENERIC_FALLBACK = 'Ocurrió un error inesperado. Inténtalo de nuevo.'

/**
 * Resolves any thrown value to a user-facing Spanish message.
 *
 * Fallback chain:
 *   1. ApiError with a known registry code → mapped message
 *   2. ApiError with an unknown/missing code  → ApiError.message
 *   3. Anything else                          → GENERIC_FALLBACK
 *
 * Never throws. Never leaks stack traces or internal JSON.
 */
export function resolveErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    const payload = error.payload

    if (
      payload !== null &&
      typeof payload === 'object' &&
      'code' in payload &&
      typeof (payload as Record<string, unknown>).code === 'string'
    ) {
      const code = (payload as Record<string, unknown>).code as string
      const mapped = ERROR_MESSAGES[code]

      if (mapped !== undefined) {
        return mapped
      }
    }

    // Unknown ApiError code — surface the message set by apiRequest()
    return error.message || GENERIC_FALLBACK
  }

  return GENERIC_FALLBACK
}
