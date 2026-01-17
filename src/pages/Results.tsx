import { useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, AlertTriangle, Sparkles } from 'lucide-react';
import VehicleCard from '../components/VehicleCard';
import { useBooking } from '../context/BookingContext';
import type { SearchResult } from '../lib/api';
import { useLanguage } from '../context/LanguageContext';
import type { VehicleType } from '../lib/price';
import { Calendar, MapPin, Users } from 'lucide-react';

type PriceOption = { currency: string; amount: number };

type GroupedVehicle = {
  id: string;
  name: string;
  type: VehicleType;
  capacity: { passengers: number; luggage: number };
  imageUrl?: string;
  vehicleTypeId?: string | number;
  seats?: number;
  bags?: number;
  routeUrl?: string;
  priceOneWay?: number;
  priceTotal?: number;
  prices: PriceOption[];
  primaryPrice: PriceOption;
  badge?: string | null;
};

const defaultCurrency = (import.meta.env.VITE_DEFAULT_CURRENCY as string | undefined)?.toUpperCase();

function groupResults(items: SearchResult[]): GroupedVehicle[] {
  const map = new Map<string, GroupedVehicle>();

  for (const item of items) {
    const passengers = item.capacity.passengers;
    const luggage = item.capacity.luggage;
    const key = `${item.vehicleTypeId ?? item.name ?? item.id}-${passengers}-${luggage}`;
    const priceOption: PriceOption = { currency: item.currency, amount: item.price };
    const existing = map.get(key);

    if (existing) {
      const hasCurrency = existing.prices.some((p) => p.currency === priceOption.currency);
      if (!hasCurrency) {
        existing.prices.push(priceOption);
      }
      map.set(key, {
        ...existing,
        primaryPrice: selectPrimaryPrice(existing.prices),
      });
      continue;
    }

    const prices = item.priceOptions && item.priceOptions.length > 0 ? item.priceOptions : [priceOption];
    const primaryPrice = selectPrimaryPrice(prices);

    map.set(key, {
      id: key,
      name: item.name,
      type: item.type,
      imageUrl: item.imageUrl,
      vehicleTypeId: item.vehicleTypeId,
      seats: item.seats ?? passengers,
      bags: item.bags ?? luggage,
      routeUrl: item.routeUrl ?? item.provider,
      priceOneWay: item.priceOneWay,
      priceTotal: item.priceTotal ?? item.price,
      capacity: {
        passengers,
        luggage,
      },
      prices,
      primaryPrice,
      badge: null,
    });
  }

  return Array.from(map.values());
}

function selectPrimaryPrice(prices: PriceOption[]): PriceOption {
  const normalized = prices.map((p) => ({ ...p, currency: p.currency.toUpperCase() }));
  const preferred = defaultCurrency
    ? normalized.find((p) => p.currency === defaultCurrency)
    : undefined;
  return preferred ?? normalized[0];
}

function pickPrice(prices: PriceOption[], currency: string): PriceOption | undefined {
  return prices.find((p) => p.currency.toUpperCase() === currency.toUpperCase());
}

function DetailCard({
  icon,
  title,
  value,
  badge,
}: {
  icon: ReactNode;
  title: string;
  value: string;
  badge?: string;
}) {
  return (
    <div className="relative rounded-3xl border border-white/70 bg-white/80 backdrop-blur-sm p-4 shadow-inner shadow-slate-900/5">
      <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold uppercase tracking-[0.15em]">
        {icon}
        <span>{title}</span>
        {badge && (
          <span className="ml-auto inline-flex items-center rounded-full bg-brand-50 text-brand-700 px-2 py-0.5 text-[10px] font-bold">
            {badge}
          </span>
        )}
      </div>
      <p className="mt-2 text-base font-semibold text-slate-900 leading-relaxed">{value}</p>
    </div>
  );
}

type SortKey = 'recommended' | 'cheapest' | 'spacious' | 'vip';

export default function Results() {
  const navigate = useNavigate();
  const { searchParams, searchResults, setSelectedVehicle } = useBooking();
  const { dictionary, locale } = useLanguage();
  const tripBadge = searchParams?.roundTrip ? 'Gidiş-Dönüş' : 'Tek Yön';
  const currencyOptions: Array<'GBP' | 'EUR' | 'USD' | 'TRY'> = ['GBP', 'EUR', 'USD', 'TRY'];
  const [selectedCurrency, setSelectedCurrency] = useState<'GBP' | 'EUR' | 'USD' | 'TRY'>(currencyOptions[0]);
  const [sortKey, setSortKey] = useState<SortKey>('recommended');

  useEffect(() => {
    if (!searchParams) {
      navigate('/');
    }
  }, [searchParams, navigate]);

  if (!searchParams) {
    return null;
  }

  const grouped = useMemo(() => groupResults(searchResults ?? []), [searchResults]);
  const withBadges = useMemo(() => {
    if (!grouped.length) return grouped;
    const cheapest = [...grouped].sort((a, b) => a.primaryPrice.amount - b.primaryPrice.amount)[0];
    const largest = [...grouped].sort((a, b) => b.capacity.passengers - a.capacity.passengers)[0];
    return grouped.map((item, idx) => {
      if (item.id === cheapest.id) return { ...item, badge: 'En Uygun' };
      if (item.id === largest.id) return { ...item, badge: 'En Geniş' };
      if (idx === 0) return { ...item, badge: 'Önerilen' };
      return item;
    });
  }, [grouped]);

  const sortedVehicles = useMemo(() => {
    return [...withBadges].sort((a, b) => {
      const priceA = pickPrice(a.prices, selectedCurrency)?.amount ?? a.primaryPrice.amount;
      const priceB = pickPrice(b.prices, selectedCurrency)?.amount ?? b.primaryPrice.amount;
      switch (sortKey) {
        case 'cheapest':
          return priceA - priceB;
        case 'spacious':
          return b.capacity.passengers - a.capacity.passengers;
        case 'vip':
          return (b.type === 'vip-vito' ? 1 : 0) - (a.type === 'vip-vito' ? 1 : 0) || priceA - priceB;
        case 'recommended':
        default:
          return priceA - priceB;
      }
    });
  }, [withBadges, selectedCurrency, sortKey]);

  const handleSelectVehicle = (vehicle: GroupedVehicle, selectedPrice?: { currency: string; amount: number }) => {
    const priceToUse = selectedPrice ?? pickPrice(vehicle.prices, selectedCurrency) ?? vehicle.primaryPrice;
    setSelectedVehicle({
      id: vehicle.id,
      name: vehicle.name,
      type: vehicle.type,
      price: priceToUse.amount,
      currency: priceToUse.currency,
      imageUrl: vehicle.imageUrl,
      vehicleTypeId: vehicle.vehicleTypeId,
      seats: vehicle.seats ?? vehicle.capacity.passengers,
      bags: vehicle.bags ?? vehicle.capacity.luggage,
      routeUrl: vehicle.routeUrl,
      priceOneWay:
        vehicle.priceOneWay ??
        (searchParams?.roundTrip ? priceToUse.amount / 2 : priceToUse.amount),
      priceTotal: vehicle.priceTotal ?? priceToUse.amount,
      capacity: vehicle.capacity,
      features: [],
      priceOptions: vehicle.prices,
    });

    navigate('/booking');
  };

  return (
    <div className="min-h-screen py-10">
      <div className="page-shell space-y-8">
        <div className="sticky top-0 z-30 -mx-4 md:-mx-0 mb-4">
          <div className="rounded-2xl border border-white/70 bg-white/90 backdrop-blur-xl shadow-card px-4 py-3 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-brand-700">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-brand-100 text-brand-700">2</span>
              <span>Araç seçimi</span>
              <span className="text-slate-400 text-xs">Adım 2 / 3</span>
            </div>
            <div className="flex flex-wrap gap-3 text-xs md:text-sm text-slate-700">
              <Chip label={`${searchParams.from.description} → ${searchParams.to.description}`} />
              <Chip label={new Date(searchParams.datetime).toLocaleString(locale)} />
              <Chip label={`${searchParams.passengers} ${dictionary.results.passengersSuffix}`} />
              {searchParams.roundTrip && <Chip label={dictionary.results.labels.return} helper={searchParams.returnDatetime ? new Date(searchParams.returnDatetime).toLocaleString(locale) : undefined} />}
            </div>
          </div>
        </div>
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-2 text-slate-600 hover:text-brand-600 transition-colors"
        >
          <ArrowLeft size={20} />
          <span className="font-semibold">{dictionary.results.backButton}</span>
        </button>

        <div className="relative overflow-hidden rounded-[32px] border border-white/70 bg-white shadow-[0_30px_70px_rgba(15,23,42,0.08)]">
          <div className="absolute inset-0 bg-gradient-to-br from-white via-white to-slate-50" aria-hidden />
          <div className="relative p-6 md:p-8 lg:p-10 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold tracking-[0.2em] text-slate-400 uppercase">Rezervasyon</p>
                <h2 className="text-2xl md:text-3xl font-heading font-semibold text-slate-900 mt-1">
                  {dictionary.results.searchDetailsTitle}
                </h2>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <DetailCard
                icon={<MapPin size={18} className="text-brand-600" />}
                title={dictionary.results.labels.from}
                value={searchParams.from.description}
              />
              <DetailCard
                icon={<MapPin size={18} className="text-brand-600" />}
                title={dictionary.results.labels.to}
                value={searchParams.to.description}
              />
              <DetailCard
                icon={<Calendar size={18} className="text-brand-600" />}
                title={dictionary.results.labels.datetime}
                value={new Date(searchParams.datetime).toLocaleString(locale)}
                badge={tripBadge}
              />
              <DetailCard
                icon={<Users size={18} className="text-brand-600" />}
                title={dictionary.results.labels.passengers}
                value={`${searchParams.passengers} ${dictionary.results.passengersSuffix}`}
              />
            </div>

            {searchParams.roundTrip && searchParams.returnDatetime && (
              <div className="grid gap-4">
                <DetailCard
                  icon={<Calendar size={18} className="text-brand-600" />}
                  title={dictionary.results.labels.return}
                  value={new Date(searchParams.returnDatetime).toLocaleString(locale)}
                  badge="Gidiş-Dönüş"
                />
              </div>
            )}
          </div>
        </div>

        <div>
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="text-sm font-semibold text-slate-600">Sıralama:</span>
            {(['recommended', 'cheapest', 'spacious', 'vip'] as SortKey[]).map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => setSortKey(key)}
                className={`px-3 py-1.5 rounded-full text-sm font-semibold transition ${
                  sortKey === key
                    ? 'bg-brand-500 text-white shadow-glow'
                    : 'bg-white border border-white/80 text-slate-600 hover:text-brand-600'
                }`}
              >
                {key === 'recommended' && 'Önerilen'}
                {key === 'cheapest' && 'En ucuz'}
                {key === 'spacious' && 'En geniş'}
                {key === 'vip' && 'En VIP'}
              </button>
            ))}
            <div className="flex items-center gap-2 ml-auto">
              <Sparkles size={18} className="text-brand-600" />
              <span className="text-sm font-semibold text-slate-700">Para birimi:</span>
              <div className="flex rounded-full border border-white/70 bg-white shadow-inner shadow-slate-900/5 overflow-hidden">
                {currencyOptions.map((cur) => (
                  <button
                    key={cur}
                    type="button"
                    onClick={() => setSelectedCurrency(cur)}
                    className={`px-3 py-1.5 text-sm font-semibold transition ${
                      selectedCurrency === cur ? 'bg-brand-500 text-white' : 'text-slate-600 hover:text-brand-600'
                    }`}
                  >
                    {cur}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <h1 className="text-3xl font-heading font-semibold text-slate-900 mb-6">
            {dictionary.results.availableVehiclesTitle}
          </h1>
          {sortedVehicles && sortedVehicles.length > 0 ? (
            <div className="grid grid-cols-1 gap-6">
              {sortedVehicles.map((vehicle) => (
                <VehicleCard
                  key={vehicle.id}
                  type={vehicle.type}
                  name={vehicle.name}
                  capacity={vehicle.capacity}
                  price={pickPrice(vehicle.prices, selectedCurrency)?.amount ?? vehicle.primaryPrice.amount}
                  currency={selectedCurrency}
                  prices={vehicle.prices}
                  imageUrl={vehicle.imageUrl}
                  badge={vehicle.badge ?? null}
                  features={[]}
                  onSelect={(selectedPrice) => handleSelectVehicle(vehicle, selectedPrice)}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-amber-200 bg-amber-50 text-amber-800 p-6 flex items-center gap-3">
              <AlertTriangle size={24} />
              <div>
                <p className="font-semibold">{dictionary.reservationBar.comingSoon}</p>
                <button
                  onClick={() => navigate('/')}
                  className="mt-2 text-sm font-semibold text-brand-600 hover:text-brand-500"
                >
                  {dictionary.header.nav.reservation}
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="rounded-3xl border border-brand-500/30 bg-brand-500/10 p-6 text-brand-700 font-semibold">
          {dictionary.results.cashWarning}
        </div>
      </div>
    </div>
  );
}

function Chip({ label, helper }: { label: string; helper?: string }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-white/80 bg-white px-3 py-1 shadow-inner shadow-slate-900/5">
      <span className="font-semibold text-slate-800">{label}</span>
      {helper && <span className="text-slate-500 text-xs">{helper}</span>}
    </span>
  );
}
