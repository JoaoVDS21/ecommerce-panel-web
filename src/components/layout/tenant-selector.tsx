'use client';

import { useState, useEffect } from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useTenantStore } from '@/stores/tenant-store';
import { Tenant } from '@/types/tenant';

// No exemplo, estamos simulando que teremos esses tenants
const mockTenants: Tenant[] = [
  { id: '15d1d006-176f-481c-9bff-9a8d3330bfdc', name: 'EcomUappi' },
  { id: '2', name: 'EcomVtex' }
];

export function TenantSelector() {
  const { currentTenant, setCurrentTenant, availableTenants, setAvailableTenants } = useTenantStore();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // Em um app real, buscaríamos os tenants da API
    // Por enquanto usamos os mocks
    setAvailableTenants(mockTenants);
    
    // Se não tiver tenant selecionado, seleciona o primeiro
    if (!currentTenant && mockTenants.length > 0) {
      setCurrentTenant(mockTenants[0]);
    }
  }, [setAvailableTenants, currentTenant, setCurrentTenant]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="min-w-[180px] justify-between"
        >
          {currentTenant?.name || "Selecione um tenant"}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Buscar tenant..." />
          <CommandEmpty>Nenhum tenant encontrado.</CommandEmpty>
          <CommandGroup>
            {availableTenants.map((tenant) => (
              <CommandItem
                key={tenant.id}
                value={tenant.id}
                onSelect={() => {
                  setCurrentTenant(tenant);
                  setOpen(false);
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    currentTenant?.id === tenant.id ? "opacity-100" : "opacity-0"
                  )}
                />
                {tenant.name}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}