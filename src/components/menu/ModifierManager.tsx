'use client';

import { useState, useEffect } from 'react';
import { ModifierGroup, Modifier } from '@/types';
import { supabase } from '@/lib/supabase/client';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { useToastStore } from '@/stores/toastStore';
import { formatCurrency } from '@/lib/formatters';
import { useSettingsStore } from '@/stores/settingsStore';

export function ModifierManager() {
  const [groups, setGroups] = useState<ModifierGroup[]>([]);
  const [modifiers, setModifiers] = useState<Modifier[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<ModifierGroup | null>(null);
  
  // Form states
  const [groupName, setGroupName] = useState('');
  const [isRequired, setIsRequired] = useState(false);
  const [groupModifiers, setGroupModifiers] = useState<{ id?: string; name: string; price: string }[]>([]);
  const [saving, setSaving] = useState(false);

  const { showToast } = useToastStore();
  const { currency } = useSettingsStore();

  useEffect(() => {
    fetchModifiers();
  }, []);

  const fetchModifiers = async () => {
    setLoading(true);
    try {
      const [groupsRes, modifiersRes] = await Promise.all([
        supabase.from('modifier_groups').select('*').order('name'),
        supabase.from('modifiers').select('*'),
      ]);

      setGroups(groupsRes.data || []);
      setModifiers(modifiersRes.data || []);
    } catch (error) {
      console.error('Error fetching modifiers:', error);
    } finally {
      setLoading(false);
    }
  };

  const openModal = async (group?: ModifierGroup) => {
    if (group) {
      setEditingGroup(group);
      setGroupName(group.name);
      setIsRequired(group.required);
      
      // Load modifiers for this group
      const groupMods = modifiers.filter(m => m.group_id === group.id);
      setGroupModifiers(groupMods.map(m => ({
        id: m.id,
        name: m.name,
        price: m.price_adjustment.toString()
      })));
    } else {
      setEditingGroup(null);
      setGroupName('');
      setIsRequired(false);
      setGroupModifiers([{ name: '', price: '0' }]);
    }
    setIsModalOpen(true);
  };

  const handleAddModifierRow = () => {
    setGroupModifiers([...groupModifiers, { name: '', price: '0' }]);
  };

  const handleRemoveModifierRow = (index: number) => {
    const newModifiers = [...groupModifiers];
    newModifiers.splice(index, 1);
    setGroupModifiers(newModifiers);
  };

  const handleModifierChange = (index: number, field: 'name' | 'price', value: string) => {
    const newModifiers = [...groupModifiers];
    newModifiers[index] = { ...newModifiers[index], [field]: value };
    setGroupModifiers(newModifiers);
  };

  const saveGroup = async () => {
    if (!groupName.trim()) return;
    
    setSaving(true);
    try {
      let groupId = editingGroup?.id;

      // 1. Save Group
      if (editingGroup) {
        await supabase
          .from('modifier_groups')
          .update({ name: groupName, required: isRequired })
          .eq('id', editingGroup.id);
      } else {
        const { data } = await supabase
          .from('modifier_groups')
          .insert({ name: groupName, required: isRequired })
          .select()
          .single();
        if (data) groupId = data.id;
      }

      if (groupId) {
        // 2. Handle Modifiers
        
        // Delete removed modifiers (only if editing)
        if (editingGroup) {
          const currentModifierIds = groupModifiers.map(m => m.id).filter(Boolean);
          const originalModifierIds = modifiers.filter(m => m.group_id === groupId).map(m => m.id);
          const idsToDelete = originalModifierIds.filter(id => !currentModifierIds.includes(id));
          
          if (idsToDelete.length > 0) {
            await supabase.from('modifiers').delete().in('id', idsToDelete);
          }
        }

        // Upsert modifiers
        const modifiersToUpsert = groupModifiers
          .filter(m => m.name.trim())
          .map(m => ({
            id: m.id, 
            group_id: groupId,
            name: m.name,
            price_adjustment: parseFloat(m.price) || 0
          }));

        for (const mod of modifiersToUpsert) {
          if (mod.id) {
            await supabase.from('modifiers').update({
              name: mod.name,
              price_adjustment: mod.price_adjustment
            }).eq('id', mod.id);
          } else {
            await supabase.from('modifiers').insert({
              group_id: groupId,
              name: mod.name,
              price_adjustment: mod.price_adjustment
            });
          }
        }
      }

      showToast('Grup modifier berhasil disimpan', 'success');
      await fetchModifiers();
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error saving modifier group:', error);
      showToast('Gagal menyimpan grup modifier', 'error');
    } finally {
      setSaving(false);
    }
  };

  const deleteGroup = async (id: string) => {
    if (!confirm('Hapus grup modifier ini?')) return;
    
    try {
      await supabase.from('modifiers').delete().eq('group_id', id);
      await supabase.from('product_modifiers').delete().eq('modifier_group_id', id);
      await supabase.from('modifier_groups').delete().eq('id', id);
      
      showToast('Grup modifier dihapus', 'success');
      fetchModifiers();
    } catch (error) {
      console.error('Error deleting group:', error);
      showToast('Gagal menghapus grup', 'error');
    }
  };

  if (loading) {
    return <div className="text-sm text-[var(--text-secondary)]">Memuat...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-[var(--text-primary)]">Modifier</h2>
        <Button size="sm" onClick={() => openModal()}>
          + Tambah
        </Button>
      </div>

      <div className="space-y-2">
        {groups.map((group) => (
          <div
            key={group.id}
            className="p-3 rounded-lg bg-[var(--bg-card)] border border-[var(--border)] hover:border-[var(--text-secondary)] transition-colors group"
          >
            <div className="flex justify-between items-start">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-medium text-[var(--text-primary)] truncate">{group.name}</h3>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                    group.required ? 'bg-[var(--danger)]/10 text-[var(--danger)]' : 'bg-green-500/10 text-green-500'
                  }`}>
                    {group.required ? 'Wajib' : 'Opsi'}
                  </span>
                </div>
                <p className="text-xs text-[var(--text-secondary)] truncate">
                  {modifiers.filter(m => m.group_id === group.id).map(m => m.name).join(', ')}
                </p>
              </div>
              
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => openModal(group)} className="p-1 hover:text-[var(--accent)]">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </button>
                <button onClick={() => deleteGroup(group.id)} className="p-1 hover:text-[var(--danger)]">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingGroup ? 'Edit Grup Modifier' : 'Tambah Grup Modifier'}
      >
        <div className="space-y-6">
          <div className="space-y-4">
            <Input
              label="Nama Grup"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="Contoh: Ukuran, Topping"
            />
            
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="required"
                checked={isRequired}
                onChange={(e) => setIsRequired(e.target.checked)}
                className="w-4 h-4 rounded border-[var(--border)] bg-[var(--bg-card)] text-[var(--accent)] focus:ring-[var(--accent)]"
              />
              <label htmlFor="required" className="text-sm font-medium text-[var(--text-primary)]">
                Pilihan Wajib (Pelanggan harus memilih satu)
              </label>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium text-[var(--text-secondary)]">Opsi</label>
              <button
                onClick={handleAddModifierRow}
                className="text-xs text-[var(--accent)] hover:underline"
              >
                + Tambah Opsi
              </button>
            </div>
            
            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {groupModifiers.map((mod, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    className="flex-1"
                    placeholder="Nama Opsi"
                    value={mod.name}
                    onChange={(e) => handleModifierChange(index, 'name', e.target.value)}
                  />
                  <Input
                    className="w-24"
                    type="number"
                    placeholder="Harga"
                    value={mod.price}
                    onChange={(e) => handleModifierChange(index, 'price', e.target.value)}
                  />
                  <button
                    onClick={() => handleRemoveModifierRow(index)}
                    className="p-2 text-[var(--text-secondary)] hover:text-[var(--danger)]"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t border-[var(--border)]">
            <Button variant="secondary" className="flex-1" onClick={() => setIsModalOpen(false)}>
              Batal
            </Button>
            <Button className="flex-1" onClick={saveGroup} disabled={saving || !groupName.trim()}>
              {saving ? 'Menyimpan...' : 'Simpan Grup'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
