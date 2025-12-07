'use client';

import { useState, useEffect, useCallback } from 'react';
import { Product, ModifierGroup, Modifier, SelectedModifier } from '@/types';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { supabase } from '@/lib/supabase/client';
import { useSettingsStore } from '@/stores/settingsStore';
import { formatCurrency } from '@/lib/formatters';

interface ModifierModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  onAddToOrder: (product: Product, modifiers: SelectedModifier[]) => void;
}

interface ModifierGroupWithModifiers extends ModifierGroup {
  modifiers: Modifier[];
}

export function ModifierModal({ isOpen, onClose, product, onAddToOrder }: ModifierModalProps) {
  const [modifierGroups, setModifierGroups] = useState<ModifierGroupWithModifiers[]>([]);
  const [selectedModifiers, setSelectedModifiers] = useState<Record<string, Modifier | null>>({});
  const [loading, setLoading] = useState(false);
  const { currency } = useSettingsStore();

  const fetchModifierGroups = useCallback(async () => {
    if (!product) return;
    
    setLoading(true);
    try {
      const { data: productModifiers } = await supabase
        .from('product_modifiers')
        .select('modifier_group_id')
        .eq('product_id', product.id);

      if (productModifiers && productModifiers.length > 0) {
        const groupIds = productModifiers.map((pm) => pm.modifier_group_id);
        
        const { data: groups } = await supabase
          .from('modifier_groups')
          .select('*')
          .in('id', groupIds);

        const { data: modifiers } = await supabase
          .from('modifiers')
          .select('*')
          .in('group_id', groupIds);

        if (groups && modifiers) {
          const groupsWithModifiers = groups.map((group) => ({
            ...group,
            modifiers: modifiers.filter((m) => m.group_id === group.id),
          }));
          setModifierGroups(groupsWithModifiers);
        }
      } else {
        setModifierGroups([]);
      }
    } catch (error) {
      console.error('Error fetching modifiers:', error);
    } finally {
      setLoading(false);
    }
  }, [product]);

  useEffect(() => {
    if (isOpen && product) {
      fetchModifierGroups();
    }
  }, [isOpen, product, fetchModifierGroups]);

  const handleModifierSelect = (groupId: string, modifier: Modifier) => {
    setSelectedModifiers((prev) => ({
      ...prev,
      [groupId]: prev[groupId]?.id === modifier.id ? null : modifier,
    }));
  };

  const handleAddToOrder = () => {
    if (!product) return;

    const selected: SelectedModifier[] = Object.entries(selectedModifiers)
      .filter(([, modifier]) => modifier !== null)
      .map(([groupId, modifier]) => {
        const group = modifierGroups.find((g) => g.id === groupId);
        return {
          group_id: groupId,
          group_name: group?.name || '',
          modifier_id: modifier!.id,
          modifier_name: modifier!.name,
          price_adjustment: modifier!.price_adjustment,
        };
      });

    onAddToOrder(product, selected);
    setSelectedModifiers({});
    onClose();
  };

  const calculateTotal = () => {
    if (!product) return 0;
    const modifierTotal = Object.values(selectedModifiers)
      .filter((m) => m !== null)
      .reduce((sum, m) => sum + (m?.price_adjustment || 0), 0);
    return product.price + modifierTotal;
  };

  const hasRequiredModifiers = modifierGroups
    .filter((g) => g.required)
    .every((g) => selectedModifiers[g.id] !== null && selectedModifiers[g.id] !== undefined);

  const canAdd = modifierGroups.length === 0 || hasRequiredModifiers;

  if (!product) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={product.name}>
      {loading ? (
        <div className="flex justify-center py-8">
          <div className="w-8 h-8 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : modifierGroups.length === 0 ? (
        <div className="space-y-6">
          <div className="text-center">
            <p className="text-[var(--text-secondary)] mb-2">Base price</p>
            <p className="text-2xl font-bold text-[var(--accent)]">{formatCurrency(product.price, currency)}</p>
          </div>
          <Button className="w-full" onClick={handleAddToOrder}>
            Add to Order
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          {modifierGroups.map((group) => (
            <div key={group.id}>
              <h3 className="font-medium text-[var(--text-primary)] mb-3">
                {group.name}
                {group.required && <span className="text-[var(--danger)] ml-1">*</span>}
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {group.modifiers.map((modifier) => {
                  const isSelected = selectedModifiers[group.id]?.id === modifier.id;
                  return (
                    <button
                      key={modifier.id}
                      onClick={() => handleModifierSelect(group.id, modifier)}
                      className={`p-3 rounded-lg border-2 text-left transition-colors ${
                        isSelected
                          ? 'border-[var(--accent)] bg-[var(--accent)]/10'
                          : 'border-[var(--border)] hover:border-[var(--text-secondary)]'
                      }`}
                    >
                      <p className="font-medium text-[var(--text-primary)] text-sm">{modifier.name}</p>
                      {modifier.price_adjustment > 0 && (
                        <p className="text-xs text-[var(--accent)]">+{formatCurrency(modifier.price_adjustment, currency)}</p>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          <div className="pt-4 border-t border-[var(--border)]">
            <div className="flex justify-between items-center mb-4">
              <span className="text-[var(--text-secondary)]">Total</span>
              <span className="text-xl font-bold text-[var(--accent)]">{formatCurrency(calculateTotal(), currency)}</span>
            </div>
            <Button className="w-full" onClick={handleAddToOrder} disabled={!canAdd}>
              Add to Order
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
}
