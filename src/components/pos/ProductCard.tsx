'use client';

import Image from 'next/image';
import { Product } from '@/types';
import { Card } from '@/components/ui/Card';
import { useSettingsStore } from '@/stores/settingsStore';
import { formatCurrency } from '@/lib/formatters';

interface ProductCardProps {
  product: Product;
  onClick: () => void;
}

export function ProductCard({ product, onClick }: ProductCardProps) {
  const { currency } = useSettingsStore();

  return (
    <Card hover onClick={onClick} className="p-4 flex flex-col">
      <div className="w-full aspect-square bg-[var(--bg-secondary)] rounded-lg mb-3 flex items-center justify-center overflow-hidden relative">
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 20vw"
          />
        ) : (
          <svg className="w-12 h-12 text-[var(--text-secondary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        )}
      </div>
      <h3 className="font-medium text-[var(--text-primary)] text-sm mb-1 line-clamp-2">{product.name}</h3>
      <p className="text-[var(--accent)] font-semibold mt-auto">{formatCurrency(product.price, currency)}</p>
    </Card>
  );
}
