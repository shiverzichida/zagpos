'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

interface LoginFormProps {
  onSuccess: () => void;
}

export function LoginForm({ onSuccess }: LoginFormProps) {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      if (isRegister) {
        const { error: signUpError, data } = await supabase.auth.signUp({
          email,
          password,
        });

        if (signUpError) {
          setError(signUpError.message);
        } else if (data.user && data.session) {
          // Auto login after signup if email confirmation is disabled
          onSuccess();
        } else {
          setMessage('Periksa email Anda untuk link konfirmasi.');
        }
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (signInError) {
          setError(signInError.message);
        } else {
          onSuccess();
        }
      }
    } catch {
      setError('Terjadi kesalahan yang tidak terduga');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-[var(--accent)] rounded-2xl flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">
          {isRegister ? 'Buat Akun' : 'Selamat Datang'}
        </h1>
        <p className="text-[var(--text-secondary)] mt-2">
          {isRegister ? 'Daftar untuk memulai' : 'Masuk ke aplikasi POS Anda'}
        </p>
      </div>

      {error && (
        <div className="p-3 bg-[var(--danger)]/10 border border-[var(--danger)]/20 rounded-lg text-[var(--danger)] text-sm">
          {error}
        </div>
      )}

      {message && (
        <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg text-green-500 text-sm">
          {message}
        </div>
      )}

      <Input
        type="email"
        label="Email"
        placeholder="Masukkan email Anda"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <Input
        type="password"
        label="Kata Sandi"
        placeholder="Masukkan kata sandi Anda"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        minLength={6}
      />

      <Button type="submit" className="w-full" disabled={loading}>
        {loading 
          ? (isRegister ? 'Membuat Akun...' : 'Masuk...') 
          : (isRegister ? 'Daftar' : 'Masuk')}
      </Button>

      <div className="text-center mt-4">
        <button
          type="button"
          onClick={() => {
            setIsRegister(!isRegister);
            setError('');
            setMessage('');
          }}
          className="text-sm text-[var(--accent)] hover:underline"
        >
          {isRegister 
            ? 'Sudah punya akun? Masuk' 
            : "Belum punya akun? Daftar"}
        </button>
      </div>
    </form>
  );
}
