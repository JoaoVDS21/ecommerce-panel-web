'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ProductsList } from '@/components/products/products-list';
import { Plus, Search } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { productService } from '@/services/product-service';
import { Product } from '@/types/product';

export default function ProductsPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  
  const { data: products, isLoading, error } = useQuery<Product[]>({
    queryKey: ['products'],
    queryFn: () => productService.getAll(),
  });
  
  const filteredProducts = products?.filter(
    (product) => 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold"></h1>
        <h1 className="text-2xl font-bold">Produtos</h1>
        <Button 
          onClick={() => router.push('/products/new')}
          className="flex items-center gap-2"
        >
          <Plus size={16} />
          Novo Produto
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
        <Input
          placeholder="Buscar produtos..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {isLoading ? (
        <div className="flex justify-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : error ? (
        <div className="p-4 rounded-md bg-red-50 text-red-700">
          Erro ao carregar produtos. Por favor, tente novamente.
        </div>
      ) : (
        <ProductsList products={filteredProducts || []} />
      )}
    </div>
  );
}