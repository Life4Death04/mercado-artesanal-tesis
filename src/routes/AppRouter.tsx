import { Navigate, Route, Routes } from 'react-router-dom'
import { AppLayout } from '../componentes/layout/AppLayout'
import { DashboardLayout } from '../componentes/layout/DashboardLayout'
import { AdminLayout } from '../modules/admin/componentes/AdminLayout'
import { LoginPage } from '../modules/auth/pages/LoginPage'
import { RegistroWizardPage } from '../modules/auth/pages/RegistroWizardPage'
import { CarritoPage } from '../modules/carrito/pages/CarritoPage'
import { AdminDashboardPage } from '../modules/admin/pages/AdminDashboardPage'
import { CategoriasAdminPage } from '../modules/admin/pages/CategoriasAdminPage'
import { ConfiguracionAdminPage } from '../modules/admin/pages/ConfiguracionAdminPage'
import { MetricasGlobalesPage } from '../modules/admin/pages/MetricasGlobalesPage'
import { PedidosAdminPage } from '../modules/admin/pages/PedidosAdminPage'
import { ProductosAdminPage } from '../modules/admin/pages/ProductosAdminPage'
import { UsuariosAdminPage } from '../modules/admin/pages/UsuariosAdminPage'
import { CheckoutPage } from '../modules/pedidos/pages/CheckoutPage'
import { HistorialPedidosPage } from '../modules/pedidos/pages/HistorialPedidosPage'
import { PerfilPage } from '../modules/perfil/pages/PerfilPage'
import { DetalleProductoPage } from '../modules/productos/pages/DetalleProductoPage'
import { CatalogoPage } from '../modules/productos/pages/CatalogoPage'
import { PedidosProductorPage } from '../modules/productor/pages/PedidosProductorPage'
import { ProductosProductorPage } from '../modules/productor/pages/ProductosProductorPage'
import { ProductorDashboardPage } from '../modules/productor/pages/ProductorDashboardPage'

export function AppRouter() {
  return (
    <Routes>
      <Route path="login" element={<LoginPage />} />
      <Route path="registro" element={<RegistroWizardPage />} />
      <Route element={<AppLayout />}>
        <Route index element={<CatalogoPage />} />
        <Route path="productos" element={<CatalogoPage />} />
        <Route path="productos/:productoId" element={<DetalleProductoPage />} />
        <Route path="carrito" element={<CarritoPage />} />
        <Route path="checkout" element={<CheckoutPage />} />
        <Route path="pedidos" element={<HistorialPedidosPage />} />
        <Route path="perfil" element={<PerfilPage />} />
        <Route element={<DashboardLayout />}>
          <Route path="productor" element={<ProductorDashboardPage />} />
          <Route path="productor/productos" element={<ProductosProductorPage />} />
          <Route path="productor/pedidos" element={<PedidosProductorPage />} />
        </Route>
        <Route element={<AdminLayout />}>
          <Route path="admin" element={<AdminDashboardPage />} />
          <Route path="admin/usuarios" element={<UsuariosAdminPage />} />
          <Route path="admin/moderacion" element={<ProductosAdminPage />} />
          <Route path="admin/incidencias" element={<PedidosAdminPage />} />
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
