import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuthenticatedApi } from '../../../auth/hooks/useAuthenticatedApi'
import { confirmProductoImage, presignProductoImage } from '../productos.api'
import { PRODUCTOS_LIST_QUERY_KEY } from './useProductosQuery'
import type { PresignImageFormValues } from '../productos.schema'

// ---------------------------------------------------------------------------
// Accepted MIME types for product images (mirrors backend PresignBodySchema)
// [source: mercado-artesanal-backend/openspec/specs/product-images/spec.md]
// ---------------------------------------------------------------------------

const ACCEPTED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'] as const
type AcceptedMimeType = (typeof ACCEPTED_MIME_TYPES)[number]

const MAX_SIZE_BYTES = 5 * 1024 * 1024 // 5 MB — matches backend contentLength max

// ---------------------------------------------------------------------------
// Upload input
// ---------------------------------------------------------------------------

export type UploadProductoImageInput = {
  productId: string
  file: File
}

// ---------------------------------------------------------------------------
// Hook
//
// Two-step presign/confirm flow:
//   1. POST /producers/me/products/:id/images/presign → { uploadUrl, s3Key, expiresIn }
//   2. PUT <uploadUrl> with the raw file bytes (direct S3/storage PUT — no auth header)
//   3. POST /producers/me/products/:id/images/confirm → ProductImageDTO
//
// On success, invalidates ['producer', 'products', 'list'] so the catalog
// page reflects the updated product (image count, cover image) without manual
// refetch.
//
// Deferred: multi-image management, drag-and-drop, upload progress bar.
// These require additional UX scope beyond the single-file upload shipped here.
// ---------------------------------------------------------------------------

export function useUploadProductoImageMutation() {
  const apiRequest = useAuthenticatedApi()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ productId, file }: UploadProductoImageInput) => {
      // Guard: validate MIME type before hitting the backend
      if (!ACCEPTED_MIME_TYPES.includes(file.type as AcceptedMimeType)) {
        throw new Error(
          `Tipo de imagen no permitido. Usa JPG, PNG o WebP. (tipo recibido: ${file.type})`,
        )
      }

      // Guard: validate file size before hitting the backend
      if (file.size > MAX_SIZE_BYTES) {
        throw new Error('La imagen no puede superar los 5 MB.')
      }

      // Step 1 — request presigned PUT URL from the backend
      const presignBody: PresignImageFormValues = {
        mimeType: file.type as AcceptedMimeType,
        contentLength: file.size,
      }

      const { uploadUrl, s3Key } = await presignProductoImage(apiRequest, productId, presignBody)

      // Step 2 — upload directly to S3/storage (no Authorization header — presigned URL is self-authenticating)
      const uploadResponse = await fetch(uploadUrl, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': file.type,
        },
      })

      if (!uploadResponse.ok) {
        throw new Error(
          `El archivo no se pudo subir al almacenamiento (HTTP ${uploadResponse.status}).`,
        )
      }

      // Step 3 — confirm the upload so the backend creates the ProductImage row
      return confirmProductoImage(apiRequest, productId, {
        s3Key,
        mimeType: file.type as AcceptedMimeType,
        // position 0: single-file upload always lands as the first (or only) image.
        // Multi-image ordering is deferred to a follow-up feature.
        position: 0,
      })
    },

    onSuccess: () => {
      // Invalidate the product list so any image count or cover URL updates surface.
      void queryClient.invalidateQueries({ queryKey: PRODUCTOS_LIST_QUERY_KEY })
    },

    // No cache touch on error — spec R4: "failed save leaves cache intact".
  })
}
