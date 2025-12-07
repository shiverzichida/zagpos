import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '@/lib/supabase/client';

export interface SettingsState {
  storeName: string;
  currency: string;
  theme: 'dark' | 'light';
  autoPrint: boolean;
  loading: boolean;
  initialized: boolean;
  
  // Actions
  fetchSettings: () => Promise<void>;
  updateStoreName: (name: string) => Promise<void>;
  updateCurrency: (currency: string) => Promise<void>;
  updateTheme: (theme: 'dark' | 'light') => Promise<void>;
  toggleAutoPrint: () => Promise<void>;
}

// Helper to update Supabase
const syncToSupabase = async (updates: Partial<{ store_name: string; currency: string; theme: string; auto_print: boolean }>) => {
  try {
    // Check if settings row exists
    const { data: existing } = await supabase.from('settings').select('id').single();
    
    if (existing) {
      await supabase.from('settings').update(updates).eq('id', existing.id);
    } else {
      await supabase.from('settings').insert(updates);
    }
  } catch (error) {
    console.error('Error syncing settings:', error);
  }
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      storeName: 'ZAG POS',
      currency: 'IDR',
      theme: 'dark',
      autoPrint: false,
      loading: false,
      initialized: false,

      fetchSettings: async () => {
        set({ loading: true });
        try {
          const { data } = await supabase
            .from('settings')
            .select('*')
            .single();
          
          if (data) {
            set({
              storeName: data.store_name,
              currency: data.currency,
              theme: data.theme,
              autoPrint: data.auto_print,
              initialized: true
            });
            
            // Apply theme on load
            if (data.theme === 'light') {
              document.documentElement.classList.add('light');
            } else {
              document.documentElement.classList.remove('light');
            }
          }
        } catch (error) {
          console.error('Error fetching settings:', error);
        } finally {
          set({ loading: false });
        }
      },

      updateStoreName: async (name) => {
        set({ storeName: name });
        await syncToSupabase({ store_name: name });
      },

      updateCurrency: async (currency) => {
        set({ currency });
        await syncToSupabase({ currency });
      },

      updateTheme: async (theme) => {
        set({ theme });
        if (theme === 'light') {
          document.documentElement.classList.add('light');
        } else {
          document.documentElement.classList.remove('light');
        }
        await syncToSupabase({ theme });
      },

      toggleAutoPrint: async () => {
        const newAutoPrint = !get().autoPrint;
        set({ autoPrint: newAutoPrint });
        await syncToSupabase({ auto_print: newAutoPrint });
      },
    }),
    {
      name: 'settings-storage',
      partialize: (state) => ({ 
        storeName: state.storeName, 
        currency: state.currency, 
        theme: state.theme, 
        autoPrint: state.autoPrint 
      }),
    }
  )
);
