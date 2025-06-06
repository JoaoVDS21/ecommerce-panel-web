'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Package, Grid, Rows3, Images, LayoutDashboard } from 'lucide-react';

export function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: LayoutDashboard,
    },
    {
      name: 'Produtos',
      href: '/dashboard/products',
      icon: Package,
    },
    {
      name: 'Categorias',
      href: '/dashboard/categories',
      icon: Grid,
    },
    {
      name: 'Prateleiras',
      href: '/dashboard/shelves',
      icon: Rows3,
    },
    {
      name: 'Banners',
      href: '/dashboard/banners',
      icon: Images,
    },
  ];

  return (
    <div className="w-64 bg-white border-r flex flex-col h-full">
      <div className="p-4 border-b">
        <h2 className="text-xl font-semibold">Painel Admin</h2>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const isActive = item.href === '/dashboard' ? pathname.endsWith(item.href) : pathname.startsWith(item.href);
            const Icon = item.icon;

            return (
              <li key={item.name}>
                <Link 
                  href={item.href}
                  className={cn(
                    "flex items-center p-3 rounded-md transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground font-medium"
                      : "hover:bg-gray-100"
                  )}
                >
                  <Icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}