import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Calendar, Users, ArrowLeftRight, Minus, Plus, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import { useBooking, type SearchParams } from '../context/BookingContext';
import { useLanguage } from '../context/LanguageContext';
import { fetchPlaceSuggestions, searchTransfers, type PlaceSelection, type PlaceSuggestion } from '../lib/api';

type Tab = 'transfer' | 'hourly' | 'tours';
const tabKeys: Tab[] = ['transfer', 'hourly', 'tours'];

type ReservationBarProps = {
  activeTab?: Tab;
  onTabChange?: (tab: Tab) => void;
};

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

export default function ReservationBar({ activeTab: controlledTab, onTabChange }: ReservationBarProps = {}) {
  const navigate = useNavigate();
  const { setSearchParams, setSearchResults, setSearchSummary, setSelectedVehicle } = useBooking();
  const { dictionary, locale } = useLanguage();
  const { reservationBar } = dictionary;
  const [activeTab, setActiveTab] = useState<Tab>(controlledTab ?? 'transfer');
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

  useEffect(() => {
    if (controlledTab && controlledTab !== activeTab) {
      setActiveTab(controlledTab);
    }
  }, [controlledTab, activeTab]);

  const handleSwap = () => {
    setFromInput(toInput);
    setToInput(fromInput);
    setFromSelection(toSelection);
    setToSelection(fromSelection);
  };

  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);
    onTabChange?.(tab);
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
      <div className="glass-panel p-8 rounded-[48px]">
        <div className="flex border-b border-brand-100 mb-8 overflow-x-auto pb-2">
          {tabKeys.map((key) => (
            <TabButton key={key} active={activeTab === key} onClick={() => handleTabChange(key)}>
              {reservationBar.tabs[key]}
            </TabButton>
          ))}
        </div>
        <div className="text-center py-16">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-brand-50 text-brand-300 mb-4">
            <Search size={32} className="opacity-50" />
          </div>
          <p className="text-lg text-brand-900/60 font-medium">{reservationBar.comingSoon}</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`relative rounded-[48px] bg-white/90 backdrop-blur-xl border border-white/60 shadow-glass p-6 md:p-8 transition-all duration-500 ${error ? 'animate-shake ring-2 ring-red-400/50' : ''
        }`}
    >
      <div className="relative flex flex-wrap gap-2 md:gap-4 border-b border-slate-100 pb-6 mb-8">
        {tabKeys.map((key) => (
          <TabButton key={key} active={activeTab === key} onClick={() => handleTabChange(key)}>
            {reservationBar.tabs[key]}
          </TabButton>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-3 relative group">
          <label htmlFor="from" className="sr-only">
            {reservationBar.placeholders.from}
          </label>
          <div className={`absolute inset-0 bg-brand-50/30 rounded-2xl transition-colors duration-300 ${activeField === 'from' ? 'bg-white ring-2 ring-brand-100' : 'group-hover:bg-brand-50/50'}`} />
          <MapPin className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300 ${activeField === 'from' ? 'text-brand-600' : 'text-brand-400/60'}`} size={20} />
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
            className={`relative bg-transparent w-full h-16 pl-12 pr-4 rounded-2xl text-slate-900 placeholder:text-slate-400 font-medium focus:outline-none transition-all`}
          />
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
            className="p-4 rounded-2xl bg-brand-50/30 text-brand-400 hover:bg-brand-50 hover:text-brand-600 hover:rotate-180 transition-all duration-500 shadow-sm"
            aria-label={reservationBar.swapAria}
          >
            <ArrowLeftRight size={20} />
          </button>
        </div>

        <div className="lg:col-span-3 relative group">
          <label htmlFor="to" className="sr-only">
            {reservationBar.placeholders.to}
          </label>
          <div className={`absolute inset-0 bg-brand-50/30 rounded-2xl transition-colors duration-300 ${activeField === 'to' ? 'bg-white ring-2 ring-brand-100' : 'group-hover:bg-brand-50/50'}`} />
          <MapPin className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300 ${activeField === 'to' ? 'text-brand-600' : 'text-brand-400/60'}`} size={20} />
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
            className={`relative bg-transparent w-full h-16 pl-12 pr-4 rounded-2xl text-slate-900 placeholder:text-slate-400 font-medium focus:outline-none transition-all`}
          />
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
            helper="Seçiniz"
            value={datetime}
            onChange={(value) => setDatetime(value)}
            locale={locale}
          />
        </div>

        <div className="lg:col-span-2">
          <div ref={passengerRef} className="relative h-full">
            <label className="sr-only" htmlFor="passenger-btn">
              {dictionary.vehicles.passengersLabel}
            </label>
            <button
              id="passenger-btn"
              type="button"
              onClick={() => setPassengerOpen((open) => !open)}
              className="w-full h-16 rounded-2xl bg-brand-50/50 hover:bg-brand-50 border border-transparent hover:border-brand-100 flex items-center justify-between px-4 transition-all duration-300 group ring-inset focus:ring-2 focus:ring-brand-100"
              aria-haspopup="true"
              aria-expanded={passengerOpen}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-brand-600 shadow-sm">
                  <Users size={16} />
                </div>
                <div className="flex flex-col items-start">
                  <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase group-hover:text-brand-500 transition-colors">YOLCU</span>
                  <span className="font-semibold text-lg text-slate-900">{passengers} Kişi</span>
                </div>
              </div>
            </button>

            {passengerOpen && (
              <div className="absolute right-0 top-full mt-2 w-72 rounded-3xl border border-brand-100 bg-white shadow-xl shadow-brand-900/10 p-4 z-40 animate-scale-in">
                <div className="flex items-center justify-between p-2">
                  <span className="font-medium text-slate-600">Yolcu Sayısı</span>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setPassengers(p => Math.max(1, p - 1))}
                      disabled={passengers <= 1}
                      className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 hover:border-brand-500 hover:text-brand-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      <Minus size={18} />
                    </button>
                    <span className="w-8 text-center font-bold text-lg text-slate-900">{passengers}</span>
                    <button
                      type="button"
                      onClick={() => setPassengers(p => Math.min(16, p + 1))}
                      disabled={passengers >= 16}
                      className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 hover:border-brand-500 hover:text-brand-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      <Plus size={18} />
                    </button>
                  </div>
                </div>
                <div className="mt-2 pt-2 border-t border-slate-100 text-center">
                  <button
                    onClick={() => setPassengerOpen(false)}
                    className="text-xs font-bold text-brand-600 hover:text-brand-700 uppercase tracking-widest py-2"
                  >
                    Tamam
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-1">
          <button
            onClick={handleSearch}
            disabled={loading}
            className="w-full h-16 rounded-2xl bg-brand-600 text-white font-semibold shadow-lg shadow-brand-500/30 hover:bg-brand-700 hover:shadow-brand-600/40 hover:-translate-y-0.5 active:scale-95 transition-all flex items-center justify-center"
            aria-label={reservationBar.searchAria}
          >
            {loading ? <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white" /> : <Search size={24} />}
          </button>
        </div>
      </div>

      <div className="relative z-10 mt-6 flex flex-col gap-4 lg:flex-row lg:items-center">
        <label className="flex items-center gap-3 cursor-pointer group select-none">
          <div className="relative">
            <input
              type="checkbox"
              className="peer sr-only"
              checked={roundTrip}
              onChange={(e) => setRoundTrip(e.target.checked)}
            />
            <div className="h-6 w-11 rounded-full bg-slate-200 peer-checked:bg-brand-500 transition-colors duration-300" />
            <div className="absolute left-1 top-1 h-4 w-4 rounded-full bg-white transition-transform duration-300 peer-checked:translate-x-5 shadow-sm" />
          </div>
          <span className="text-sm font-medium text-slate-600 group-hover:text-brand-600 transition-colors">
            {reservationBar.roundTrip}
          </span>
        </label>
      </div>

      {roundTrip && (
        <div className="mt-6 animate-slideDown max-w-sm">
          <DateInputCard
            id="returnDatetime"
            label="DÖNÜŞ TARİHİ"
            helper={reservationBar.placeholders.returnDatetime}
            value={returnDatetime}
            onChange={(value) => setReturnDatetime(value)}
            locale={locale}
          />
        </div>
      )}

      {apiError && (
        <div className="mt-4 rounded-2xl bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-600 flex items-center gap-2 animate-shake">
          <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
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
      className={`px-6 py-2.5 rounded-full font-bold text-sm tracking-wide transition-all duration-300 ${active
        ? 'bg-brand-600 text-white shadow-lg shadow-brand-500/25'
        : 'text-slate-500 hover:text-brand-600 hover:bg-brand-50'
        }`}
    >
      {children}
    </button>
  );
}

type SuggestionItem = PlaceSuggestion;

function SuggestionList({ suggestions, onSelect }: { suggestions: SuggestionItem[]; onSelect: (suggestion: SuggestionItem) => void }) {
  return (
    <div className="absolute z-20 mt-2 w-full rounded-3xl border border-black/5 bg-white/90 backdrop-blur-xl shadow-2xl shadow-slate-900/10 max-h-80 overflow-auto py-2 animate-scale-in">
      {suggestions.map((item, index) => (
        <button
          type="button"
          key={`${item.placeId}-${index}`}
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => onSelect(item)}
          className="w-full px-5 py-3.5 text-left hover:bg-brand-50 transition-colors flex items-start gap-4 group"
        >
          <div className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-400 group-hover:bg-brand-100 group-hover:text-brand-600 transition-colors">
            <MapPin size={16} />
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-slate-900 group-hover:text-brand-900 transition-colors">{item.mainText}</span>
            {item.secondaryText && <span className="text-xs text-slate-500 group-hover:text-brand-500/80">{item.secondaryText}</span>}
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

// Basit yardımcı fonksiyonlar
const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
const getFirstDayOfMonth = (year: number, month: number) => {
  const day = new Date(year, month, 1).getDay();
  return day === 0 ? 6 : day - 1; // Pzt=0 yapıyoruz (TR)
};

const MONTHS = [
  'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
  'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
];

const DAYS = ['P', 'S', 'Ç', 'P', 'C', 'C', 'P'];

const TIMES = Array.from({ length: 96 }).map((_, i) => {
  const h = Math.floor(i / 4).toString().padStart(2, '0');
  const m = ((i % 4) * 15).toString().padStart(2, '0');
  return `${h}:${m}`;
});

function DateInputCard({ id, label, helper, value, onChange, locale }: DateInputCardProps) {
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<'date' | 'time'>('date');
  const [currentDate, setCurrentDate] = useState(new Date());

  // Seçili değerleri parse et
  const selectedDate = value ? new Date(value) : null;
  const selectedTimeStr = selectedDate ? `${selectedDate.getHours().toString().padStart(2, '0')}:${selectedDate.getMinutes().toString().padStart(2, '0')}` : '';

  // Calendar state
  const [viewYear, setViewYear] = useState(selectedDate?.getFullYear() || new Date().getFullYear());
  const [viewMonth, setViewMonth] = useState(selectedDate?.getMonth() || new Date().getMonth());

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setView('date');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleDateSelect = (day: number) => {
    const newDate = new Date(viewYear, viewMonth, day);

    // Eğer saat daha önce seçilmişse koru, yoksa varsayılan veya şu anki saati kullan
    let h = 12, m = 0;
    if (selectedDate) {
      h = selectedDate.getHours();
      m = selectedDate.getMinutes();
    }

    newDate.setHours(h, m);

    // ISO string oluştur (Timezone issue simplistic handle)
    // Local zamana göre ISO formatı oluşturmamız lazım
    // Basitçe: YYYY-MM-DDTHH:mm
    const isoStr = `${newDate.getFullYear()}-${(newDate.getMonth() + 1).toString().padStart(2, '0')}-${newDate.getDate().toString().padStart(2, '0')}T${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;

    onChange(isoStr);
    setView('time'); // Tarih seçince saate geç
  };

  const handleTimeSelect = (timeStr: string) => {
    const [h, m] = timeStr.split(':').map(Number);
    const baseDate = selectedDate || new Date(); // Fallback to today if no date selected yet (shouldn't happen in flow)
    const newDate = new Date(baseDate);
    newDate.setFullYear(selectedDate ? selectedDate.getFullYear() : viewYear);
    newDate.setMonth(selectedDate ? selectedDate.getMonth() : viewMonth);
    newDate.setDate(selectedDate ? selectedDate.getDate() : baseDate.getDate());

    newDate.setHours(h, m);

    const isoStr = `${newDate.getFullYear()}-${(newDate.getMonth() + 1).toString().padStart(2, '0')}-${newDate.getDate().toString().padStart(2, '0')}T${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;

    onChange(isoStr);
    setOpen(false); // Bitti
    setView('date'); // Reset view loop
  };

  const nextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(y => y + 1);
    } else {
      setViewMonth(m => m + 1);
    }
  };

  const prevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(y => y - 1);
    } else {
      setViewMonth(m => m - 1);
    }
  };

  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDay = getFirstDayOfMonth(viewYear, viewMonth);
  const blanks = Array(firstDay).fill(null);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const displayDate = value && selectedDate
    ? selectedDate.toLocaleDateString(locale || 'tr-TR', { day: 'numeric', month: 'short', year: 'numeric' })
    : '';
  const displayTime = value && selectedDate
    ? selectedDate.toLocaleTimeString(locale || 'tr-TR', { hour: '2-digit', minute: '2-digit' })
    : '';
  const isFilled = Boolean(displayDate);

  return (
    <div className="relative h-16 w-full group" ref={containerRef}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`w-full h-full flex items-center gap-4 rounded-2xl border transition-all duration-300 px-4 text-left min-w-0 ${isFilled || open
          ? 'bg-white border-brand-100 shadow-sm ring-1 ring-brand-100'
          : 'bg-brand-50/50 border-transparent hover:bg-brand-50 hover:border-brand-100'
          }`}
      >
        <div className={`p-2 rounded-full transition-colors ${isFilled || open ? 'bg-brand-100 text-brand-600' : 'bg-white text-slate-400 shadow-sm'}`}>
          <Calendar size={18} />
        </div>
        <div className="flex flex-col min-w-0 leading-tight">
          <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase group-hover:text-brand-600 transition-colors">{label}</span>
          <span className={`text-sm font-semibold ${isFilled ? 'text-slate-900' : 'text-slate-500'}`}>{displayDate || helper}</span>
          {isFilled && (
            <span className="text-xs font-semibold text-slate-500">{displayTime}</span>
          )}
        </div>
      </button>

      {open && (
        <div className="absolute left-0 top-full mt-2 z-50 bg-white rounded-3xl shadow-xl shadow-brand-900/10 border border-brand-100 p-4 w-[320px] animate-scale-in">
          {view === 'date' ? (
            <div className="flex flex-col">
              <div className="flex items-center justify-between mb-4 px-1">
                <button onClick={prevMonth} className="p-1 hover:bg-brand-50 text-slate-400 hover:text-brand-600 rounded-full transition-colors"><ChevronLeft size={20} /></button>
                <div className="font-bold text-slate-900 text-lg">
                  {MONTHS[viewMonth]} {viewYear}
                </div>
                <button onClick={nextMonth} className="p-1 hover:bg-brand-50 text-slate-400 hover:text-brand-600 rounded-full transition-colors"><ChevronRight size={20} /></button>
              </div>

              <div className="grid grid-cols-7 mb-2 text-center">
                {DAYS.map(d => (
                  <div key={d} className="text-xs font-bold text-slate-400 py-1">{d}</div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1 text-center">
                {blanks.map((_, i) => <div key={`blank-${i}`} />)}
                {days.map(d => {
                  const isSelected = selectedDate && selectedDate.getDate() === d && selectedDate.getMonth() === viewMonth && selectedDate.getFullYear() === viewYear;
                  return (
                    <button
                      key={d}
                      onClick={() => handleDateSelect(d)}
                      className={`h-9 w-9 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${isSelected
                          ? 'bg-brand-600 text-white shadow-md shadow-brand-500/30'
                          : 'text-slate-700 hover:bg-brand-50 hover:text-brand-600'
                        }`}
                    >
                      {d}
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="flex flex-col h-[320px]">
              <div className="flex items-center gap-2 mb-3 pb-3 border-b border-brand-50">
                <button onClick={() => setView('date')} className="flex items-center gap-1 text-xs font-bold text-brand-600 hover:text-brand-700 uppercase tracking-widest">
                  <ChevronLeft size={14} /> Tarih
                </button>
                <div className="flex-1 text-center font-semibold text-slate-900">
                  {selectedDate ? selectedDate.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' }) : ''}
                </div>
              </div>
              <div className="flex-1 overflow-y-auto pr-1">
                <div className="grid grid-cols-3 gap-2">
                  {TIMES.map(t => (
                    <button
                      key={t}
                      onClick={() => handleTimeSelect(t)}
                      className={`py-2 rounded-xl text-sm font-semibold transition-all ${selectedTimeStr === t
                          ? 'bg-brand-600 text-white shadow-md'
                          : 'bg-slate-50 text-slate-600 hover:bg-brand-50 hover:text-brand-600'
                        }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
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
