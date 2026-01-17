import { useState } from 'react';
import { Users, Luggage, CheckCircle, Crown } from 'lucide-react';
import { formatPrice, VehicleType } from '../lib/price';
import { useLanguage } from '../context/LanguageContext';

export interface VehicleCardProps {
  type: VehicleType;
  name: string;
  capacity: {
    passengers: number;
    luggage: number;
  };
  price: number;
  currency?: string;
  prices?: { currency: string; amount: number }[];
  imageUrl?: string;
  features?: string[];
  badge?: string | null;
  onSelect: (selectedPrice: { currency: string; amount: number }) => void;
}

export default function VehicleCard({
  name,
  capacity,
  price,
  currency = 'TRY',
  prices = [],
  imageUrl,
  features = [],
  badge,
  onSelect,
}: VehicleCardProps) {
  const { dictionary, locale } = useLanguage();
  const { vehicles } = dictionary;

  const priceOptions = prices.length ? prices : [{ currency, amount: price }];
  const [selectedPrice, setSelectedPrice] = useState(
    priceOptions.find((p) => p.currency === currency) ?? priceOptions[0],
  );

  return (
    <div className="group relative overflow-hidden rounded-[32px] bg-white border border-slate-100 p-4 transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1">
      {badge && (
        <div className="absolute top-6 left-6 z-10 inline-flex items-center gap-1.5 rounded-full bg-amber-500 text-white px-3 py-1 text-xs font-bold uppercase tracking-wider shadow-lg shadow-amber-500/20">
          <Crown size={12} fill="currentColor" /> {badge}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-[1.2fr_1.5fr_auto] gap-6 items-center">
        {/* Image Section */}
        <div className="relative aspect-[16/10] overflow-hidden rounded-3xl bg-slate-50">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={name}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              loading="lazy"
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center text-slate-300">
              <span className="text-sm font-medium">{vehicles.estimatedPrice}</span>
            </div>
          )}
        </div>

        {/* Info Section */}
        <div className="space-y-4">
          <div>
            <h3 className="text-2xl font-heading font-semibold text-slate-900 mb-1">{name}</h3>
            <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed">Konforlu ve güvenli yolculuk deneyimi.</p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Badge icon={<Users size={16} />}>{capacity.passengers} Yolcu</Badge>
            <Badge icon={<Luggage size={16} />}>{capacity.luggage} Bagaj</Badge>
          </div>

          <div className="flex flex-wrap gap-2">
            {features.slice(0, 3).map((feature, index) => (
              <span key={index} className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg">
                <CheckCircle size={12} className="text-emerald-500" /> {feature}
              </span>
            ))}
          </div>
        </div>

        {/* Action Section */}
        <div className="flex flex-col items-end gap-3 min-w-[140px] pl-4 border-l border-slate-50">
          <div className="text-right">
            <span className="block text-xs uppercase tracking-wider text-slate-400 mb-1">Toplam Fiyat</span>
            <div className="text-3xl font-bold text-brand-700 tracking-tight">
              {formatPrice(selectedPrice.amount, locale, selectedPrice.currency)}
            </div>
          </div>

          {priceOptions.length > 1 && (
            <div className="flex flex-wrap gap-1.5 justify-end">
              {priceOptions.map((p) => {
                const active = p.currency === selectedPrice.currency;
                return (
                  <button
                    key={`${p.currency}-${p.amount}`}
                    type="button"
                    onClick={() => setSelectedPrice(p)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${active
                        ? 'bg-slate-900 text-white shadow-md'
                        : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                      }`}
                  >
                    {p.currency}
                  </button>
                );
              })}
            </div>
          )}

          <button
            onClick={() => onSelect(selectedPrice)}
            className="w-full mt-2 px-6 py-3.5 rounded-2xl bg-brand-600 text-white font-bold shadow-lg shadow-brand-500/25 hover:bg-brand-700 hover:shadow-brand-600/30 active:scale-95 transition-all text-sm"
          >
            {vehicles.selectButton}
          </button>
        </div>
      </div>
    </div>
  );
}

function Badge({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-white/80 border border-white/70 px-2.5 py-1 text-xs font-semibold text-slate-700">
      {icon}
      {children}
    </span>
  );
}
