import { useQuery } from '@tanstack/react-query'
import type { Producto } from '../productos.schema'

const productosMock: Producto[] = [
  {
    id: 'pan-masa-madre',
    nombre: 'Pan de masa madre',
    productor: 'Horno La Colina',
    precio: 6.5,
    categoria: 'Panaderia',
  },
  {
    id: 'miel-floracion',
    nombre: 'Miel de floracion silvestre',
    productor: 'Apiario Dulce Monte',
    precio: 9.75,
    categoria: 'Conservas',
  },
]

export function useProductos() {
  return useQuery({
    queryKey: ['productos'],
    queryFn: async () => productosMock,
  })
}
