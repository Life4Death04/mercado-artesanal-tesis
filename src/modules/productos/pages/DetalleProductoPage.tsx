import { useParams } from 'react-router-dom'
import { PendingDesignPage } from '../../../componentes/layout/PendingDesignPage'

export function DetalleProductoPage() {
  const { productoId } = useParams()

  return (
    <PendingDesignPage
      actor="Consumidor"
      title="Detalle de producto pendiente de diseño"
      description={`Ruta reservada para la referencia Stitch del producto: ${productoId ?? 'sin id'}.`}
    />
  )
}
