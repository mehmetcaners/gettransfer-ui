import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Calendar, Users, ArrowLeftRight } from 'lucide-react';
import { useBooking, type SearchParams } from '../context/BookingContext';
import { useLanguage } from '../context/LanguageContext';
import { fetchPlaceSuggestions, searchTransfers, type PlaceSelection, type PlaceSuggestion } from '../lib/api';

type Tab = 'transfer' | 'hourly' | 'tours';
const tabKeys: Tab[] = ['transfer', 'hourly', 'tours'];

const fieldClasses =
  'w-full h-14 rounded-2xl border border-white/60 bg-white/80 text-slate-900 placeholder:text-slate-500 px-4 pl-12 shadow-inner shadow-slate-900/5 focus:bg-white focus:border-brand-200 focus:ring-4 focus:ring-brand-500/15 transition outline-none backdrop-blur';

const formatDisplayDateTime = (value: string, locale: string) => {
  if (!value) return '';
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return '';
  try {
    return parsed.toLocaleString(locale || 'tr-TR', { dateStyle: 'medium', timeStyle: 'short' });
  } catch {
    return parsed.toLocaleString();
  }
};

export default function ReservationBar() {
  const navigate = useNavigate();
  const { setSearchParams, setSearchResults, setSearchSummary, setSelectedVehicle } = useBooking();
  const { dictionary, locale } = useLanguage();
  const { reservationBar } = dictionary;
  const [activeTab, setActiveTab] = useState<Tab>('transfer');
  const [fromInput, setFromInput] = useState('');
  const [toInput, setToInput] = useState('');
  const [fromSelection, setFromSelection] = useState<PlaceSelection | null>(null);
  const [toSelection, setToSelection] = useState<PlaceSelection | null>(null);
  const [datetime, setDatetime] = useState('');
  const [roundTrip, setRoundTrip] = useState(false);
  const [returnDatetime, setReturnDatetime] = useState('');
  const [passengers, setPassengers] = useState(2);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [fromSuggestions, setFromSuggestions] = useState<PlaceSuggestion[]>([]);
  const [toSuggestions, setToSuggestions] = useState<PlaceSuggestion[]>([]);
  const [activeField, setActiveField] = useState<'from' | 'to' | null>(null);
  const [passengerOpen, setPassengerOpen] = useState(false);
  const passengerRef = useRef<HTMLDivElement | null>(null);

  const handleSwap = () => {
    setFromInput(toInput);
    setToInput(fromInput);
    setFromSelection(toSelection);
    setToSelection(fromSelection);
  };

  const handleSearch = async () => {
    const chosenFrom =
      fromSelection ??
      (fromSuggestions.length > 0
        ? { placeId: fromSuggestions[0].placeId, description: fromSuggestions[0].description }
        : null);
    const chosenTo =
      toSelection ??
      (toSuggestions.length > 0
        ? { placeId: toSuggestions[0].placeId, description: toSuggestions[0].description }
        : null);

    if (!chosenFrom) {
      setError(true);
      setApiError('Lütfen kalkış lokasyonu seçin.');
      setTimeout(() => setError(false), 500);
      return;
    }

    if (!chosenTo) {
      setError(true);
      setApiError('Lütfen varış lokasyonu seçin.');
      setTimeout(() => setError(false), 500);
      return;
    }

    if (!fromInput || !toInput || !datetime) {
      setError(true);
      setTimeout(() => setError(false), 500);
      return;
    }

    if (roundTrip && !returnDatetime) {
      setError(true);
      setTimeout(() => setError(false), 500);
      return;
    }

    // Seçimleri kesinleştir
    setFromSelection(chosenFrom);
    setToSelection(chosenTo);
    setFromInput(chosenFrom.description);
    setToInput(chosenTo.description);

    setLoading(true);
    setApiError(null);
    setSelectedVehicle(null);

    const params: SearchParams = {
      from: chosenFrom,
      to: chosenTo,
      datetime,
      roundTrip,
      returnDatetime: roundTrip ? returnDatetime : undefined,
      passengers,
    };

    try {
      const response = await searchTransfers(params);
      if (response.results.length === 0) {
        setApiError(reservationBar.comingSoon);
        setSearchResults(null);
        setSearchSummary(null);
        return;
      }

      setSearchParams(params);
      setSearchResults(response.results);
      setSearchSummary({
        distanceKm: response.distanceKm,
        durationMin: response.durationMin,
      });
      navigate('/results');
    } catch (err) {
      console.error('Search error', err);
      setApiError(err instanceof Error ? err.message : reservationBar.comingSoon);
      setSearchResults(null);
      setSearchSummary(null);
    } finally {
      setLoading(false);
    }
  };

  usePlaceAutocomplete(fromInput, setFromSuggestions);
  usePlaceAutocomplete(toInput, setToSuggestions);

  useEffect(() => {
    const closeOnClickOutside = (event: MouseEvent) => {
      if (passengerRef.current && !passengerRef.current.contains(event.target as Node)) {
        setPassengerOpen(false);
      }
    };
    document.addEventListener('mousedown', closeOnClickOutside);
    return () => document.removeEventListener('mousedown', closeOnClickOutside);
  }, []);

  if (activeTab !== 'transfer') {
    return (
      <div className="rounded-[32px] border border-white/70 bg-white/80 backdrop-blur-2xl shadow-card p-8">
        <div className="flex border-b border-white/60 mb-6 overflow-x-auto">
          {tabKeys.map((key) => (
            <TabButton key={key} active={activeTab === key} onClick={() => setActiveTab(key)}>
              {reservationBar.tabs[key]}
            </TabButton>
          ))}
        </div>
        <div className="text-center py-12 text-slate-600">
          {reservationBar.comingSoon}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`relative overflow-visible rounded-[32px] border border-white/70 bg-white/90 backdrop-blur-2xl shadow-card p-6 md:p-8 transition-all ${
        error ? 'animate-shake' : ''
      }`}
    >
      <div className="pointer-events-none absolute inset-0 opacity-70" aria-hidden>
        <div className="absolute inset-0 bg-gradient-to-br from-brand-500/8 via-transparent to-indigo-500/10" />
      </div>
      <div className="relative flex flex-wrap gap-3 border-b border-white/60 pb-4 mb-6">
        {tabKeys.map((key) => (
          <TabButton key={key} active={activeTab === key} onClick={() => setActiveTab(key)}>
            {reservationBar.tabs[key]}
          </TabButton>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-3 relative">
          <label htmlFor="from" className="sr-only">
            {reservationBar.placeholders.from}
          </label>
          <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-600 opacity-80" size={20} />
          <input
            id="from"
            type="text"
            placeholder={reservationBar.placeholders.from}
            value={fromInput}
            onChange={(e) => {
              setFromInput(e.target.value);
              setFromSelection(null);
            }}
            autoComplete="off"
            onFocus={() => setActiveField('from')}
            onBlur={() => setTimeout(() => setActiveField((prev) => (prev === 'from' ? null : prev)), 150)}
            className={`${fieldClasses} ${!fromSelection && fromInput ? 'border-amber-300' : ''}`}
          />
          {!fromSelection && fromInput && (
            <p className="mt-1 text-xs text-amber-600">Listeden seç veya Enter/Arama ile ilk sonucu kullan.</p>
          )}
          {activeField === 'from' && fromSuggestions.length > 0 && (
            <SuggestionList
              suggestions={fromSuggestions}
              onSelect={(suggestion) => {
                const label = suggestion.description || suggestion.mainText;
                setFromSelection({ placeId: suggestion.placeId, description: label });
                setFromInput(label);
                setFromSuggestions([]);
                setActiveField(null);
              }}
            />
          )}
        </div>

        <div className="lg:col-span-1 flex items-center justify-center">
          <button
            onClick={handleSwap}
            className="p-3 rounded-2xl border border-white/70 bg-white/80 text-brand-600 shadow-inner shadow-slate-900/5 hover:-translate-y-0.5 hover:rotate-180 transition-all duration-300"
            aria-label={reservationBar.swapAria}
          >
            <ArrowLeftRight size={20} />
          </button>
        </div>

        <div className="lg:col-span-3 relative">
          <label htmlFor="to" className="sr-only">
            {reservationBar.placeholders.to}
          </label>
          <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-600 opacity-80" size={20} />
          <input
            id="to"
            type="text"
            placeholder={reservationBar.placeholders.to}
            value={toInput}
            onChange={(e) => {
              setToInput(e.target.value);
              setToSelection(null);
            }}
            autoComplete="off"
            onFocus={() => setActiveField('to')}
            onBlur={() => setTimeout(() => setActiveField((prev) => (prev === 'to' ? null : prev)), 150)}
            className={`${fieldClasses} ${!toSelection && toInput ? 'border-amber-300' : ''}`}
          />
          {!toSelection && toInput && (
            <p className="mt-1 text-xs text-amber-600">Listeden seç veya Enter/Arama ile ilk sonucu kullan.</p>
          )}
          {activeField === 'to' && toSuggestions.length > 0 && (
            <SuggestionList
              suggestions={toSuggestions}
              onSelect={(suggestion) => {
                const label = suggestion.description || suggestion.mainText;
                setToSelection({ placeId: suggestion.placeId, description: label });
                setToInput(label);
                setToSuggestions([]);
                setActiveField(null);
              }}
            />
          )}
        </div>

        <div className="lg:col-span-2">
          <DateInputCard
            id="datetime"
            label="TARİH & SAAT"
            helper="Başlangıç Tarihi"
            value={datetime}
            onChange={(value) => setDatetime(value)}
            locale={locale}
          />
        </div>

        <div className="lg:col-span-2">
          <div ref={passengerRef} className="relative">
            <label className="sr-only" htmlFor="passenger-btn">
              {dictionary.vehicles.passengersLabel}
            </label>
            <button
              id="passenger-btn"
              type="button"
              onClick={() => setPassengerOpen((open) => !open)}
              className="w-full h-14 rounded-2xl border border-white/70 bg-white/90 px-4 flex items-center justify-between text-slate-900 shadow-inner shadow-slate-900/5 hover:border-brand-200 hover:shadow-lg transition"
              aria-haspopup="true"
              aria-expanded={passengerOpen}
            >
              <div className="flex items-center gap-2">
                <Users size={20} className="text-brand-600" />
                <span className="font-semibold text-left">{passengers}</span>
              </div>
              <span className="text-xs text-slate-400">Seç</span>
            </button>

            {passengerOpen && (
              <div className="absolute left-0 right-0 top-full translate-y-2 rounded-2xl border border-white/80 bg-white shadow-xl shadow-slate-900/10 p-3 grid grid-cols-2 md:grid-cols-4 gap-2 z-40">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => {
                  const active = passengers === num;
                  return (
                    <button
                      key={num}
                      type="button"
                      onClick={() => {
                        setPassengers(num);
                        setPassengerOpen(false);
                      }}
                      className={`flex items-center justify-center rounded-xl px-3 py-3 text-sm font-semibold transition ${
                        active
                          ? 'bg-gradient-to-r from-brand-500 to-brand-600 text-white shadow-glow'
                          : 'bg-white/80 text-slate-700 border border-white/70 hover:border-brand-200 hover:text-brand-600'
                      }`}
                    >
                      {num}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-1">
          <button
            onClick={handleSearch}
            disabled={loading}
            className="w-full h-14 px-8 rounded-2xl bg-gradient-to-r from-brand-500 to-brand-600 text-white font-semibold shadow-glow hover:-translate-y-0.5 active:scale-95 transition-all flex items-center justify-center space-x-2"
            aria-label={reservationBar.searchAria}
          >
            <Search size={20} />
            <span className="hidden sm:inline">
              {loading ? `${reservationBar.searchButton}...` : reservationBar.searchButton}
            </span>
          </button>
        </div>
      </div>

      <div className="relative z-10 mt-6 flex flex-col gap-4 lg:flex-row lg:items-center">
        <div className="flex items-center bg-white/70 rounded-2xl px-4 py-3 shadow-inner shadow-slate-900/5">
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              role="switch"
              checked={roundTrip}
              onChange={(e) => setRoundTrip(e.target.checked)}
              className="sr-only"
            />
            <div
              className={`relative w-12 h-6 rounded-full transition-colors shadow-inner ${
                roundTrip ? 'bg-gradient-to-r from-brand-500 to-brand-600' : 'bg-slate-300'
              }`}
            >
              <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${roundTrip ? 'translate-x-6' : ''}`} />
            </div>
            <span className="ml-3 text-sm font-semibold text-slate-800">{reservationBar.roundTrip}</span>
          </label>
        </div>
      </div>

      {roundTrip && (
        <div className="mt-4 animate-slideDown max-w-md">
          <DateInputCard
            id="returnDatetime"
            label="TARİH & SAAT"
            helper={reservationBar.placeholders.returnDatetime}
            value={returnDatetime}
            onChange={(value) => setReturnDatetime(value)}
            locale={locale}
          />
        </div>
      )}

      {apiError && (
        <div className="mt-4 rounded-2xl bg-white/70 border border-white/70 px-4 py-3 text-sm text-slate-700">
          {apiError}
        </div>
      )}
    </div>
  );
}

function TabButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`px-5 py-2 rounded-full font-semibold text-sm whitespace-nowrap transition-all ${
        active
          ? 'bg-gradient-to-r from-brand-500 to-brand-600 text-white shadow-glow'
          : 'text-slate-600 hover:text-brand-600 bg-white/60'
      }`}
    >
      {children}
    </button>
  );
}

type SuggestionItem = PlaceSuggestion;

function SuggestionList({ suggestions, onSelect }: { suggestions: SuggestionItem[]; onSelect: (suggestion: SuggestionItem) => void }) {
  return (
    <div className="absolute z-20 mt-2 w-full rounded-3xl border border-white/80 bg-white shadow-xl shadow-slate-900/10 max-h-72 overflow-auto">
      {suggestions.map((item, index) => (
        <button
          type="button"
          key={`${item.placeId}-${index}`}
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => onSelect(item)}
          className="w-full px-4 py-3 text-left hover:bg-brand-50 transition flex items-start gap-3"
        >
          <div className="mt-1 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-2xl bg-brand-500/10 text-brand-600">
            <MapPin size={16} />
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-slate-900">{item.mainText}</span>
            {item.secondaryText && <span className="text-xs text-slate-500">{item.secondaryText}</span>}
          </div>
        </button>
      ))}
    </div>
  );
}

type DateInputCardProps = {
  id: string;
  label: string;
  helper: string;
  value: string;
  onChange: (value: string) => void;
  locale: string;
};

function DateInputCard({ id, label, helper, value, onChange, locale }: DateInputCardProps) {
  const displayValue = formatDisplayDateTime(value, locale) || helper;
  const isFilled = Boolean(value);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const openPicker = () => {
    const el = inputRef.current;
    if (!el) return;
    if (typeof el.showPicker === 'function') {
      el.showPicker();
    } else {
      el.focus();
      el.click();
    }
  };

  return (
    <div className="relative" onClick={openPicker}>
      <input
        id={id}
        type="datetime-local"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
        ref={inputRef}
        aria-label={label}
      />
      <div
        className={`flex items-center gap-3 rounded-3xl border border-white/70 bg-white/90 px-4 py-3 shadow-inner shadow-slate-900/5 transition ${
          isFilled ? 'text-slate-900' : 'text-slate-500'
        }`}
      >
        <Calendar size={24} className="text-brand-600" />
        <div className="flex flex-col">
          <span className="text-xs font-bold tracking-wide text-slate-800 uppercase">{label}</span>
          <span className={`text-sm font-semibold ${isFilled ? 'text-slate-900' : 'text-slate-400'}`}>{displayValue}</span>
        </div>
      </div>
    </div>
  );
}

function usePlaceAutocomplete(query: string, setter: (suggestions: SuggestionItem[]) => void) {
  useEffect(() => {
    const term = query.trim();
    if (term.length < 1) {
      setter([]);
      return;
    }

    const controller = new AbortController();
    const timeout = setTimeout(async () => {
      try {
        const suggestions = await fetchPlaceSuggestions(term, controller.signal);
        setter(suggestions);
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          setter([]);
        }
      }
    }, 250);

    return () => {
      controller.abort();
      clearTimeout(timeout);
    };
  }, [query, setter]);
}
