'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { categoryService } from '@/services/category-service';
import { productService } from '@/services/product-service';
import { Category, CategoryFormData } from '@/types/category';
import { Product } from '@/types/product';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Check, ChevronsUpDown } from 'lucide-react';
import { 
  Command, 
  CommandEmpty, 
  CommandGroup, 
  CommandInput, 
  CommandItem, 
  CommandList 
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

// Schema de validação
const categoryFormSchema = z.object({
  name: z.string().min(3, 'O nome deve ter pelo menos 3 caracteres'),
  isActive: z.boolean().default(true),
  products_ids: z.array(z.number()).default([])
});

interface CategoryFormProps {
  category?: Category;
}

export function CategoryForm({ category }: CategoryFormProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [selectedProductIds, setSelectedProductIds] = useState<number[]>([]);
  const [open, setOpen] = useState(false);
  
  // Buscar produtos disponíveis
  const { data: products, isLoading: isLoadingProducts } = useQuery({
    queryKey: ['products'],
    queryFn: () => productService.getAll(),
  });
  
  // Configuração do formulário
  const form = useForm<any>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      name: '',
      isActive: true,
      products_ids: [],
    },
  });

  // Carrega os dados da categoria se estiver editando
  useEffect(() => {
    if (category) {
      const reset = {
        name: category.name,
        isActive: category.isActive ?? true,
        products_ids: category.products.map(({ id }) => id) ?? [],
      }
      
      form.reset(reset);
      
      if (reset.products_ids) {
        setSelectedProductIds(reset.products_ids);
      }
    }
  }, [category, form]);

  // Mutação para criar ou atualizar a categoria
  const { mutate: salvarCategory, isPending } = useMutation({
    mutationFn: (data: CategoryFormData) => {
      if (category?.id) {
        return categoryService.update(category.id, data);
      } else {
        return categoryService.create(data);
      }
    },
    onSuccess: () => {
      toast.success(category ? 'Categoria atualizada' : 'Categoria criada', {
        description: category 
          ? 'A categoria foi atualizada com sucesso.' 
          : 'A categoria foi criada com sucesso.',
      });
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      router.push('/categories');
    },
    onError: (error) => {
      console.error('Erro ao salvar categoria:', error);
      toast.error('Erro ao salvar', {
        description: 'Ocorreu um erro ao salvar a categoria.'
      });
    },
  });

  // Função para manipular seleção de produtos
  const handleProductSelection = (productId: number) => {
    setSelectedProductIds((current) => {
      const isSelected = current.includes(productId);
      
      if (isSelected) {
        // Remove o produto
        const updated = current.filter(id => id !== productId);
        form.setValue('products_ids', updated);
        return updated;
      } else {
        // Adiciona o produto
        const updated = [...current, productId];
        form.setValue('products_ids', updated);
        return updated;
      }
    });
  };

   // Função para obter o nome de um produto a partir do seu ID
   const getProductName = (productId: number): string => {
    if (!products) return '';
    const product = products.find((p: Product) => p.id === productId);
    return product ? product.name : '';
  };

  // Função de submit do formulário
  const onSubmit = (data: CategoryFormData) => {
    salvarCategory(data);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-md border">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input placeholder="Nome da categoria" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Ativa</FormLabel>
                    <FormDescription>
                      Desmarque para desativar esta categoria
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="products_ids"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Produtos</FormLabel>
                  <FormDescription>
                    Selecione os produtos que pertencem a esta categoria
                  </FormDescription>
                  <FormControl>
                    <Popover open={open} onOpenChange={setOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={open}
                          className="w-full justify-between"
                        >
                          {selectedProductIds.length > 0
                            ? `${selectedProductIds.length} produto(s) selecionado(s)`
                            : "Selecione os produtos"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-0" align="start">
                        <Command>
                          <CommandInput placeholder="Buscar produto..." />
                          <CommandList>
                            <CommandEmpty>Nenhum produto encontrado.</CommandEmpty>
                            <CommandGroup>
                              {isLoadingProducts ? (
                                <div className="p-4 text-center">Carregando produtos...</div>
                              ) : products && products.length > 0 ? (
                                products.map((product: Product) => (
                                  <CommandItem
                                    key={product.id}
                                    value={product.id.toString()}
                                    onSelect={() => handleProductSelection(product.id)}
                                  >
                                    <Check
                                      className={cn(
                                        "mr-2 h-4 w-4",
                                        selectedProductIds.includes(product.id) ? "opacity-100" : "opacity-0"
                                      )}
                                    />
                                    {product.name}
                                  </CommandItem>
                                ))
                              ) : (
                                <div className="p-4 text-center">Nenhum produto disponível</div>
                              )}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </FormControl>
                  {selectedProductIds.length > 0 && (
                    <div className="mt-2">
                      <p className="text-sm font-medium mb-1">Produtos selecionados:</p>
                      <div className="space-y-1">
                        {selectedProductIds.map((id, index) => (
                          <div key={id} className="flex items-center gap-2 rounded-md bg-slate-50 px-3 py-1 text-sm">
                            <span>{getProductName(id)}</span>
                            <Button 
                              type="button" 
                              variant="ghost" 
                              size="sm" 
                              className="h-auto p-0 text-red-500 hover:text-red-700"
                              onClick={() => handleProductSelection(id)}
                            >
                              <span className="sr-only">Remover</span>
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x">
                                <path d="M18 6 6 18"></path>
                                <path d="m6 6 12 12"></path>
                              </svg>
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/categories')}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? 'Salvando...' : category ? 'Atualizar' : 'Criar'}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}