import React from 'react'
import Link from 'next/link'
import { FileText, DollarSign, Users, Package, Wrench } from 'lucide-react'

export default function Navbar() {
  const links = [
    { href: '/', label: 'Descargos', icon: <FileText className="mr-2 h-4 w-4" /> },
    { href: '/facturas', label: 'Facturas', icon: <DollarSign className="mr-2 h-4 w-4" /> },
    { href: '/pacientes', label: 'Pacientes', icon: <Users className="mr-2 h-4 w-4" /> },
    { href: '/servicios', label: 'Servicios', icon: <Wrench className="mr-2 h-4 w-4" /> },
    { href: '/productos', label: 'Productos', icon: <Package className="mr-2 h-4 w-4" /> },
  ]

  return (
    <nav className="h-full w-64 bg-gray-100 p-4">
      <h2 className="mb-6 text-xl font-bold">Hospital Admin</h2>
      <ul className="space-y-2">
        {links.map(link => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="flex items-center rounded px-3 py-2 text-gray-700 hover:bg-gray-200"
            >
              {link.icon}
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}