'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { ModifierGroup } from '@/types';

interface ProductModifierSelectorProps {
  productId?: string;
  selectedGroupIds: string[];
  onChange: (groupIds: string[]) => void;
}

export function ProductModifierSelector({ productId, selectedGroupIds, onChange }: ProductModifierSelectorProps) {
  const [groups, setGroups] = useState<ModifierGroup[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGroups = async () => {
      const { data } = await supabase.from('modifier_groups').select('*').order('name');
      setGroups(data || []);
      setLoading(false);
    };
    fetchGroups();
  }, []);

  const toggleGroup = (groupId: string) => {
    if (selectedGroupIds.includes(groupId)) {
      onChange(selectedGroupIds.filter(id => id !== groupId));
    } else {
      onChange([...selectedGroupIds, groupId]);
    }
  };

  if (loading) return <div className="text-sm text-[var(--text-secondary)]">Loading modifiers...</div>;

  return (
    <div>
      <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
        Available Modifiers
      </label>
      <div className="space-y-2 max-h-40 overflow-y-auto border border-[var(--border)] rounded-lg p-2">
        {groups.length === 0 ? (
          <p className="text-sm text-[var(--text-secondary)] p-2">No modifier groups created yet.</p>
        ) : (
          groups.map(group => (
            <label key={group.id} className="flex items-center gap-3 p-2 hover:bg-[var(--bg-card-hover)] rounded cursor-pointer">
              <input
                type="checkbox"
                checked={selectedGroupIds.includes(group.id)}
                onChange={() => toggleGroup(group.id)}
                className="w-4 h-4 rounded border-[var(--border)] bg-[var(--bg-card)] text-[var(--accent)] focus:ring-[var(--accent)]"
              />
              <span className="text-sm text-[var(--text-primary)]">{group.name}</span>
              <span className={`text-xs px-1.5 py-0.5 rounded-full ml-auto ${
                group.required ? 'bg-[var(--danger)]/10 text-[var(--danger)]' : 'bg-green-500/10 text-green-500'
              }`}>
                {group.required ? 'Req' : 'Opt'}
              </span>
            </label>
          ))
        )}
      </div>
    </div>
  );
}
