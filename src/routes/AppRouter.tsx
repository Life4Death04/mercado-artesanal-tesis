import { Navigate, Route, Routes } from 'react-router-dom'
import { AppLayout } from '../componentes/layout/AppLayout'
import { ConsumerLayout } from '../componentes/layout/ConsumerLayout'
import { DashboardLayout } from '../componentes/layout/DashboardLayout'
import { AdminLayout } from '../modules/admin/componentes/AdminLayout'
import { LoginPage } from '../modules/auth/pages/LoginPage'
import { RegistroWizardPage } from '../modules/auth/pages/RegistroWizardPage'
import { CarritoPage } from '../modules/carrito/pages/CarritoPage'
import { AdminDashboardPage } from '../modules/admin/pages/AdminDashboardPage'
import { CategoriasAdminPage } from '../modules/admin/pages/CategoriasAdminPage'
import { ConfiguracionAdminPage } from '../modules/admin/pages/ConfiguracionAdminPage'
import { IncidenciaDetalleAdminPage } from '../modules/admin/pages/IncidenciaDetalleAdminPage'
import { IncidenciasAdminPage } from '../modules/admin/pages/IncidenciasAdminPage'
import { ModeracionContenidoAdminPage } from '../modules/admin/pages/ModeracionContenidoAdminPage'
import { ModeracionDetalleAdminPage } from '../modules/admin/pages/ModeracionDetalleAdminPage'
import { MetricasGlobalesPage } from '../modules/admin/pages/MetricasGlobalesPage'
import { PedidosAdminPage } from '../modules/admin/pages/PedidosAdminPage'
import { ProductosAdminPage } from '../modules/admin/pages/ProductosAdminPage'
import { UsuariosAdminPage } from '../modules/admin/pages/UsuariosAdminPage'
import { CheckoutPage } from '../modules/pedidos/pages/CheckoutPage'
import { HistorialPedidosPage } from '../modules/pedidos/pages/HistorialPedidosPage'
import { PerfilPage } from '../modules/perfil/pages/PerfilPage'
import { MisIncidenciasPage } from '../modules/perfil/pages/MisIncidenciasPage'
import { LandingPage } from '../modules/landing/pages/LandingPage'
import { DetalleProductoPage } from '../modules/productos/pages/DetalleProductoPage'
import { CatalogoPage } from '../modules/productos/pages/CatalogoPage'
import { PedidosProductorPage } from '../modules/productor/pages/PedidosProductorPage'
import { PerfilProductorPublicoPage } from '../modules/productor/pages/PerfilProductorPublicoPage'
import { ProductosProductorPage } from '../modules/productor/pages/ProductosProductorPage'
import { EstadisticasProductorPage } from '../modules/productor/pages/EstadisticasProductorPage'
import { InventarioProductorPage } from '../modules/productor/pages/InventarioProductorPage'
import { ModalidadesEntregaPage } from '../modules/productor/pages/ModalidadesEntregaPage'
import { EditarPerfilPublicoPage } from '../modules/productor/pages/EditarPerfilPublicoPage'

export function AppRouter() {
  return (
    <Routes>
      <Route path="login" element={<LoginPage />} />
      <Route path="registro" element={<RegistroWizardPage />} />
      <Route element={<AppLayout />}>
        <Route index element={<LandingPage />} />
        <Route path="productores/:productorId" element={<PerfilProductorPublicoPage />} />
        <Route element={<ConsumerLayout />}>
          <Route path="productos" element={<CatalogoPage />} />
          <Route path="productos/:productoId" element={<DetalleProductoPage />} />
          <Route path="carrito" element={<CarritoPage />} />
          <Route path="checkout" element={<CheckoutPage />} />
          <Route path="pedidos" element={<HistorialPedidosPage />} />
          <Route path="perfil" element={<PerfilPage />} />
          <Route path="incidencias" element={<MisIncidenciasPage />} />
        </Route>
        <Route element={<DashboardLayout />}>
          <Route path="productor" element={<Navigate to="/productor/pedidos" replace />} />
          <Route path="productor/productos" element={<ProductosProductorPage />} />
          <Route path="productor/pedidos" element={<PedidosProductorPage />} />
          <Route path="productor/inventario" element={<InventarioProductorPage />} />
          <Route path="productor/estadisticas" element={<EstadisticasProductorPage />} />
          <Route path="productor/entregas" element={<ModalidadesEntregaPage />} />
          <Route path="productor/perfil" element={<EditarPerfilPublicoPage />} />
        </Route>
        <Route element={<AdminLayout />}>
          <Route path="admin" element={<AdminDashboardPage />} />
          <Route path="admin/usuarios" element={<UsuariosAdminPage />} />
          <Route path="admin/moderacion" element={<ModeracionContenidoAdminPage />} />
          <Route path="admin/moderacion/:publicacionId" element={<ModeracionDetalleAdminPage />} />
          <Route path="admin/incidencias" element={<IncidenciasAdminPage />} />
          <Route path="admin/incidencias/:incidenciaId" element={<IncidenciaDetalleAdminPage />} />
          <Route path="admin/categorias" element={<CategoriasAdminPage />} />
          <Route path="admin/metricas-globales" element={<MetricasGlobalesPage />} />
          <Route path="admin/configuracion" element={<ConfiguracionAdminPage />} />
          <Route path="admin/productos" element={<ProductosAdminPage />} />
          <Route path="admin/pedidos" element={<PedidosAdminPage />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
