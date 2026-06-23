import { PendingDesignPage } from '../../../componentes/layout/PendingDesignPage'

export function ProductorDashboardPage() {
  return (
    <div className="md:ml-64">
      <PendingDesignPage
        actor="Productor"
        title="Panel productor pendiente de diseño"
        description="Ruta reservada para la referencia Stitch del resumen operativo del productor."
      />
    </div>
  )
}
