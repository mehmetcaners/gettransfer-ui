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
    <div className="relative overflow-hidden rounded-3xl border border-white/70 bg-white/90 backdrop-blur-xl p-5 shadow-card transition-all hover:-translate-y-1 hover:shadow-[0_25px_60px_rgba(15,23,42,0.12)]">
      {badge && (
        <div className="absolute top-4 left-4 inline-flex items-center gap-1 rounded-full bg-amber-100 text-amber-800 px-3 py-1 text-xs font-semibold shadow-sm">
          <Crown size={14} /> {badge}
        </div>
      )}
      <div className="grid grid-cols-[1fr_2fr_auto] gap-4 items-center">
        <div className="overflow-hidden rounded-2xl border border-white/60 shadow-inner bg-gradient-to-br from-slate-50 to-white">
          {imageUrl ? (
            <img src={imageUrl} alt={name} className="w-full h-full object-cover min-h-[140px]" loading="lazy" />
          ) : (
            <div className="h-full min-h-[140px] flex items-center justify-center text-slate-400 text-sm px-4 py-3">
              {vehicles.estimatedPrice}
            </div>
          )}
        </div>

        <div className="space-y-3">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-slate-400">{vehicles.estimatedPrice}</p>
            <h3 className="text-lg font-heading text-slate-900 line-clamp-2">{name}</h3>
            <p className="text-sm text-slate-500 line-clamp-2">Konforlu ve hızlı ulaşım için ideal seçim.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge icon={<Users size={14} />}>{capacity.passengers}</Badge>
            <Badge icon={<Luggage size={14} />}>{capacity.luggage}</Badge>
            {features.slice(0, 3).map((feature, index) => (
              <Badge key={index} icon={<CheckCircle size={14} className="text-emerald-500" />}>
                {feature}
              </Badge>
            ))}
          </div>
        </div>

        <div className="flex flex-col items-end gap-2">
          <div className="text-2xl font-bold text-brand-600">
            {formatPrice(selectedPrice.amount, locale, selectedPrice.currency)}
          </div>
          <div className="text-xs text-slate-500">{vehicles.estimatedPrice}</div>
          {priceOptions.length > 1 && (
            <div className="mt-2 flex flex-wrap gap-2 justify-end">
              {priceOptions.map((p) => {
                const active = p.currency === selectedPrice.currency;
                return (
                  <button
                    key={`${p.currency}-${p.amount}`}
                    type="button"
                    onClick={() => setSelectedPrice(p)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold border transition ${
                      active
                        ? 'bg-brand-500 text-white border-brand-500 shadow-glow'
                        : 'bg-white text-brand-700 border-white/70 hover:border-brand-300'
                    }`}
                  >
                    {formatPrice(p.amount, locale, p.currency)}
                  </button>
                );
              })}
            </div>
          )}
          <button
            onClick={() => onSelect(selectedPrice)}
            className="mt-2 px-4 py-2 rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 text-white font-semibold shadow-glow hover:-translate-y-0.5 active:scale-95 transition-all"
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
