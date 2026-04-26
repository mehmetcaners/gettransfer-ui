import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Calendar, Users, ArrowLeftRight, Minus, Plus, Clock, ChevronLeft, ChevronRight, Car } from 'lucide-react';
import { useBooking, type SearchParams } from '../context/BookingContext';
import { useLanguage } from '../context/LanguageContext';
import { fetchPlaceSuggestions, searchTransfers, type PlaceSelection, type PlaceSuggestion } from '../lib/api';

type Tab = 'transfer' | 'hourly' | 'tours';

type ReservationBarProps = {
  activeTab?: Tab;
  onTabChange?: (tab: Tab) => void;
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
  const desktopPassengerRef = useRef<HTMLDivElement | null>(null);
  const mobilePassengerRef = useRef<HTMLDivElement | null>(null);

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
      const isInsideDesktop = desktopPassengerRef.current?.contains(event.target as Node) ?? false;
      const isInsideMobile = mobilePassengerRef.current?.contains(event.target as Node) ?? false;
      if (!isInsideDesktop && !isInsideMobile) {
        setPassengerOpen(false);
      }
    };
    document.addEventListener('mousedown', closeOnClickOutside);
    return () => document.removeEventListener('mousedown', closeOnClickOutside);
  }, []);

  const renderTabs = () => (
    <div className="mb-2 flex w-full gap-1 overflow-x-auto rounded-[30px] bg-white/95 px-3 pt-3 shadow-md sm:mb-3 sm:w-fit sm:rounded-[26px] sm:p-1.5">
      <TabButton icon={<Car size={18} />} active={activeTab === 'transfer'} onClick={() => handleTabChange('transfer')}>
        {reservationBar.tabs['transfer']}
      </TabButton>
      <TabButton icon={<Clock size={18} />} active={activeTab === 'hourly'} onClick={() => handleTabChange('hourly')}>
        {reservationBar.tabs['hourly']}
      </TabButton>
      <TabButton icon={<MapPin size={18} />} active={activeTab === 'tours'} onClick={() => handleTabChange('tours')}>
        {reservationBar.tabs['tours']}
      </TabButton>
    </div>
  );

  if (activeTab !== 'transfer') {
    return (
      <div className="flex flex-col">
        {renderTabs()}
        <div className="rounded-3xl bg-white p-5 shadow-xl sm:p-8">
          <div className="py-12 text-center sm:py-16">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-brand-50 text-brand-300 mb-4">
              <Search size={32} className="opacity-50" />
            </div>
            <p className="text-lg text-brand-900/60 font-medium">{reservationBar.comingSoon}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {renderTabs()}

      <div
        className={`relative rounded-[30px] bg-white p-4 shadow-2xl transition-all duration-500 sm:rounded-3xl sm:p-6 md:p-8 ${error ? 'animate-shake ring-2 ring-red-400/50' : ''
          }`}
      >

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-12">
          <div className="relative group sm:col-span-2 lg:col-span-3">
            <label htmlFor="from" className="sr-only">
              {reservationBar.placeholders.from}
            </label>
            <div className={`absolute inset-0 bg-white rounded-2xl border-2 border-brand-500 transition-all duration-300 ${activeField === 'from' ? 'ring-2 ring-brand-100' : ''}`} />
            <MapPin className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300 text-brand-600`} size={20} />
            <span className="pointer-events-none absolute left-12 top-3 text-[10px] font-bold uppercase tracking-[0.18em] text-brand-500 sm:hidden">
              {dictionary.results.labels.from}
            </span>
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
              className={`relative h-16 w-full rounded-2xl bg-transparent pl-12 pr-4 text-base font-medium text-slate-900 placeholder:text-slate-500 transition-all focus:outline-none sm:text-base sm:placeholder:text-slate-500 ${fromInput ? 'pt-4 sm:pt-0' : 'pt-4 sm:pt-0'}`}
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

          <div className="relative z-10 -my-1 flex items-center justify-center sm:col-span-2 sm:my-0 lg:col-span-1">
            <button
              onClick={handleSwap}
              className="inline-flex h-14 w-14 items-center justify-center rounded-full border border-brand-100 bg-white text-brand-500 shadow-[0_10px_30px_rgba(161,128,114,0.18)] transition-all duration-500 hover:bg-brand-50 hover:text-brand-600 sm:h-auto sm:w-auto sm:max-w-none sm:rounded-2xl sm:border-0 sm:bg-brand-50/40 sm:p-4 sm:shadow-sm sm:hover:rotate-180"
              aria-label={reservationBar.swapAria}
            >
              <ArrowLeftRight size={20} />
            </button>
          </div>

          <div className="relative group sm:col-span-2 lg:col-span-3">
            <label htmlFor="to" className="sr-only">
              {reservationBar.placeholders.to}
            </label>
            <div className={`absolute inset-0 bg-white rounded-2xl border-2 border-brand-500 transition-all duration-300 ${activeField === 'to' ? 'ring-2 ring-brand-100' : ''}`} />
            <MapPin className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300 text-brand-600`} size={20} />
            <span className="pointer-events-none absolute left-12 top-3 text-[10px] font-bold uppercase tracking-[0.18em] text-brand-500 sm:hidden">
              {dictionary.results.labels.to}
            </span>
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
              className={`relative h-16 w-full rounded-2xl bg-transparent pl-12 pr-4 text-base font-medium text-slate-900 placeholder:text-slate-500 transition-all focus:outline-none ${toInput ? 'pt-4 sm:pt-0' : 'pt-4 sm:pt-0'}`}
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

          <div className="sm:col-span-1 lg:col-span-2">
            <DateInputCard
              id="datetime"
              label="TARİH & SAAT"
              helper="Seçiniz"
              value={datetime}
              onChange={(value) => setDatetime(value)}
              locale={locale}
            />
          </div>

          <div className="hidden sm:col-span-1 sm:block lg:col-span-2">
            <div ref={desktopPassengerRef} className="relative h-full">
              <label className="sr-only" htmlFor="passenger-btn">
                {dictionary.vehicles.passengersLabel}
              </label>
              <button
                id="passenger-btn"
                type="button"
                onClick={() => setPassengerOpen((open) => !open)}
                className="w-full h-16 rounded-2xl bg-white hover:bg-brand-50/50 border-2 border-brand-500 flex items-center justify-between px-4 transition-all duration-300 group ring-inset focus:ring-2 focus:ring-brand-200 shadow-sm"
                aria-haspopup="true"
                aria-expanded={passengerOpen}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 shadow-sm">
                    <Users size={16} />
                  </div>
                  <div className="flex min-w-0 flex-col items-start">
                    <span className="text-[10px] font-bold tracking-wider text-brand-500 uppercase transition-colors">YOLCU</span>
                    <span className="text-base font-semibold text-slate-900 sm:text-lg">{passengers} Kişi</span>
                  </div>
                </div>
              </button>

              {passengerOpen && (
                <div className="absolute left-1/2 top-full z-40 mt-2 w-[min(20rem,calc(100vw-2.5rem))] -translate-x-1/2 rounded-3xl border border-brand-100 bg-white p-4 shadow-xl shadow-brand-900/10 animate-scale-in sm:left-auto sm:right-0 sm:w-72 sm:translate-x-0">
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

          <div className="hidden sm:col-span-2 sm:block lg:col-span-1">
            <button
              onClick={handleSearch}
              disabled={loading}
              className="flex h-16 w-full items-center justify-center gap-2 rounded-2xl border-2 border-brand-500 bg-white px-4 font-semibold text-brand-600 shadow-sm transition-all hover:-translate-y-0.5 hover:bg-brand-50/50 active:scale-95"
              aria-label={reservationBar.searchAria}
            >
              {loading ? (
                <div className="h-6 w-6 animate-spin rounded-full border-b-2 border-brand-600" />
              ) : (
                <>
                  <Search size={22} />
                  <span className="text-sm sm:text-base">{reservationBar.searchButton}</span>
                </>
              )}
            </button>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-3 sm:hidden">
          <label className="flex min-h-[9rem] cursor-pointer flex-col justify-between rounded-[24px] border border-brand-100 bg-[#fbfbfb] px-4 py-4 shadow-[0_12px_32px_rgba(15,23,42,0.05)]">
            <div className="space-y-3">
              <span className="block text-[10px] font-bold uppercase tracking-[0.18em] text-brand-500">
                {reservationBar.roundTrip}
              </span>
              <div className="relative">
                <input
                  type="checkbox"
                  className="peer sr-only"
                  checked={roundTrip}
                  onChange={(e) => setRoundTrip(e.target.checked)}
                />
                <div className="h-12 w-20 rounded-full bg-slate-200 transition-colors duration-300 peer-checked:bg-brand-500/80" />
                <div className="absolute left-2 top-2 h-8 w-8 rounded-full bg-white shadow-sm transition-transform duration-300 peer-checked:translate-x-8" />
              </div>
            </div>
          </label>

          <div ref={mobilePassengerRef} className="relative">
            <button
              id="passenger-btn-mobile"
              type="button"
              onClick={() => setPassengerOpen((open) => !open)}
              className="flex min-h-[9rem] w-full flex-col items-start justify-between rounded-[24px] border border-brand-100 bg-[#fbfbfb] px-4 py-4 text-left shadow-[0_12px_32px_rgba(15,23,42,0.05)]"
              aria-haspopup="true"
              aria-expanded={passengerOpen}
            >
              <span className="block text-[10px] font-bold uppercase tracking-[0.18em] text-brand-500">
                YOLCU
              </span>
              <div className="flex w-full items-end justify-between gap-3">
                <span className="text-[1.75rem] font-semibold leading-none text-slate-900">{passengers}</span>
                <span className="text-sm font-medium text-slate-600">Kişi</span>
              </div>
            </button>

            {passengerOpen && (
              <>
                <button
                  type="button"
                  aria-label="Close passenger selector"
                  onClick={() => setPassengerOpen(false)}
                  className="fixed inset-0 z-40 bg-slate-950/20 backdrop-blur-[1px] sm:hidden"
                />
                <div className="fixed inset-x-4 top-1/2 z-50 w-auto -translate-y-1/2 rounded-[28px] border border-brand-100 bg-white p-5 shadow-2xl shadow-brand-900/20 animate-scale-in sm:absolute sm:inset-x-auto sm:right-0 sm:top-full sm:mt-2 sm:w-72 sm:translate-y-0">
                  <div className="mb-4 flex items-start justify-between gap-4">
                    <div>
                      <span className="block text-[11px] font-bold uppercase tracking-[0.18em] text-brand-500">
                        Yolcu
                      </span>
                      <span className="mt-1 block text-sm font-medium text-slate-500">
                        Toplam yolcu sayisini secin
                      </span>
                    </div>
                    <span className="rounded-full bg-brand-50 px-3 py-1 text-sm font-semibold text-brand-600">
                      {passengers} Kisi
                    </span>
                  </div>
                  <div className="flex items-center justify-between rounded-[22px] bg-slate-50 px-3 py-3">
                    <button
                      type="button"
                      onClick={() => setPassengers((p) => Math.max(1, p - 1))}
                      disabled={passengers <= 1}
                      className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition-all hover:border-brand-500 hover:text-brand-600 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <Minus size={18} />
                    </button>
                    <div className="flex flex-col items-center">
                      <span className="text-[2rem] font-semibold leading-none text-slate-900">{passengers}</span>
                      <span className="mt-1 text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                        Kisi
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setPassengers((p) => Math.min(16, p + 1))}
                      disabled={passengers >= 16}
                      className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition-all hover:border-brand-500 hover:text-brand-600 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <Plus size={18} />
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => setPassengerOpen(false)}
                    className="mt-4 flex h-12 w-full items-center justify-center rounded-2xl bg-brand-600 text-sm font-semibold text-white shadow-lg shadow-brand-700/20 transition-colors hover:bg-brand-700"
                  >
                    Tamam
                  </button>
                </div>
              </>
            )}
          </div>

          <button
            onClick={handleSearch}
            disabled={loading}
            className="flex min-h-[9rem] w-full flex-col items-center justify-center gap-3 rounded-[24px] bg-gradient-to-br from-brand-700 to-brand-500 px-4 py-4 text-white shadow-[0_20px_45px_rgba(93,64,55,0.35)] transition-all hover:-translate-y-0.5 active:scale-95 disabled:cursor-not-allowed disabled:opacity-70"
            aria-label={reservationBar.searchAria}
          >
            {loading ? (
              <div className="h-7 w-7 animate-spin rounded-full border-b-2 border-white" />
            ) : (
              <>
                <Search size={28} />
                <span className="text-base font-semibold">{reservationBar.searchButton}</span>
              </>
            )}
          </button>
        </div>

        <div className="relative z-10 mt-6 hidden flex-col gap-4 sm:flex lg:flex-row lg:items-center">
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
          <div className="mt-6 max-w-full animate-slideDown sm:max-w-sm">
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
    </div>
  );
}

function TabButton({ active, onClick, children, icon }: { active: boolean; onClick: () => void; children: React.ReactNode; icon?: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`flex min-w-[7.5rem] flex-1 items-center justify-center gap-2 border-b-[3px] px-3 pb-4 pt-2 text-center text-xs font-bold tracking-[0.18em] transition-all duration-300 sm:min-w-0 sm:flex-none sm:rounded-xl sm:border-b-0 sm:px-5 sm:py-2.5 sm:text-sm sm:tracking-widest ${active
        ? 'border-brand-500 text-brand-600 sm:bg-transparent'
        : 'border-transparent text-slate-700 hover:text-brand-600 sm:hover:bg-slate-50'
        }`}
    >
      {icon && <span className={`${active ? 'text-brand-600' : 'text-slate-400'}`}>{icon}</span>}
      {children}
    </button>
  );
}

type SuggestionItem = PlaceSuggestion;

function SuggestionList({ suggestions, onSelect }: { suggestions: SuggestionItem[]; onSelect: (suggestion: SuggestionItem) => void }) {
  return (
    <div className="absolute z-20 mt-2 max-h-64 w-full overflow-auto rounded-3xl border border-black/5 bg-white/90 py-2 shadow-2xl shadow-slate-900/10 backdrop-blur-xl animate-scale-in sm:max-h-80">
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

const HOURS = Array.from({ length: 24 }).map((_, i) => i.toString().padStart(2, '0'));
const MINUTES = ['00', '15', '30', '45'];
const TIMES = HOURS.flatMap((hour) => MINUTES.map((minute) => `${hour}:${minute}`));
const WHEEL_ITEM_HEIGHT = 44;

function DateInputCard({ id, label, helper, value, onChange, locale }: DateInputCardProps) {
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<'date' | 'time'>('date');

  // Seçili değerleri parse et
  const selectedDate = value ? new Date(value) : null;
  const selectedTimeStr = selectedDate ? `${selectedDate.getHours().toString().padStart(2, '0')}:${selectedDate.getMinutes().toString().padStart(2, '0')}` : '';
  const normalizedHour = selectedDate ? selectedDate.getHours().toString().padStart(2, '0') : '12';
  const normalizedMinuteValue = selectedDate ? Math.round(selectedDate.getMinutes() / 15) * 15 : 0;
  const normalizedMinute = Math.min(45, Math.max(0, normalizedMinuteValue)).toString().padStart(2, '0');
  const [mobileHour, setMobileHour] = useState(normalizedHour);
  const [mobileMinute, setMobileMinute] = useState(normalizedMinute);

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

  useEffect(() => {
    setMobileHour(normalizedHour);
    setMobileMinute(normalizedMinute);
  }, [normalizedHour, normalizedMinute]);

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
        id={id}
        type="button"
        onClick={() => setOpen(!open)}
        className={`w-full h-full flex items-center gap-4 rounded-2xl border-2 border-brand-500 transition-all duration-300 px-4 text-left min-w-0 ${isFilled || open
          ? 'bg-white shadow-sm ring-1 ring-brand-100'
          : 'bg-white hover:bg-brand-50/50 shadow-sm'
          }`}
      >
        <div className={`p-2 rounded-full transition-colors bg-brand-100 text-brand-600`}>
          <Calendar size={18} />
        </div>
        <div className="flex flex-col min-w-0 leading-tight">
          <span className="text-[10px] font-bold tracking-wider text-brand-500 uppercase transition-colors">{label}</span>
          <span className={`text-sm font-semibold ${isFilled ? 'text-slate-900' : 'text-slate-600'}`}>{displayDate || helper}</span>
          {isFilled && (
            <span className="text-xs font-semibold text-slate-500">{displayTime}</span>
          )}
        </div>
      </button>

      {open && (
        <>
          <button
            type="button"
            aria-label="Close date selector"
            onClick={() => {
              setOpen(false);
              setView('date');
            }}
            className="fixed inset-0 z-[80] bg-slate-950/20 backdrop-blur-[1px] sm:hidden"
          />
          <div className="fixed inset-x-0 bottom-0 z-[90] max-h-[82vh] overflow-y-auto rounded-t-[30px] border-x border-t border-brand-100 bg-white px-4 pb-[calc(1rem+env(safe-area-inset-bottom))] pt-4 shadow-[0_-18px_50px_rgba(15,23,42,0.18)] animate-scale-in sm:absolute sm:inset-x-auto sm:bottom-auto sm:left-0 sm:top-full sm:z-50 sm:mt-2 sm:max-h-none sm:w-[320px] sm:overflow-hidden sm:rounded-[28px] sm:border sm:p-4 sm:shadow-2xl sm:shadow-brand-900/20">
            <div className="mb-4 flex justify-center sm:hidden">
              <span className="h-1.5 w-14 rounded-full bg-slate-200" />
            </div>
            {view === 'date' ? (
              <div className="flex flex-col">
                <div className="mb-4 flex items-center justify-between px-1">
                  <button onClick={prevMonth} className="rounded-full p-1 text-slate-400 transition-colors hover:bg-brand-50 hover:text-brand-600"><ChevronLeft size={20} /></button>
                  <div className="text-lg font-bold text-slate-900">
                    {MONTHS[viewMonth]} {viewYear}
                  </div>
                  <button onClick={nextMonth} className="rounded-full p-1 text-slate-400 transition-colors hover:bg-brand-50 hover:text-brand-600"><ChevronRight size={20} /></button>
                </div>

                <div className="mb-2 grid grid-cols-7 text-center">
                  {DAYS.map(d => (
                    <div key={d} className="py-1 text-xs font-bold text-slate-400">{d}</div>
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
                        className={`mx-auto flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold transition-all ${isSelected
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
              <>
                <div className="flex min-h-full flex-col sm:hidden">
                  <div className="mb-4 flex items-center gap-2 border-b border-brand-50 pb-3">
                    <button onClick={() => setView('date')} className="flex items-center gap-1 text-xs font-bold uppercase tracking-widest text-brand-600 hover:text-brand-700">
                      <ChevronLeft size={14} /> Tarih
                    </button>
                    <div className="flex-1 text-center font-semibold text-slate-900">
                      {selectedDate ? selectedDate.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' }) : ''}
                    </div>
                  </div>
                  <div className="rounded-[24px] bg-slate-50/80 px-3 py-4">
                    <div className="grid grid-cols-2 gap-3">
                      <TimeWheelColumn label="Saat" values={HOURS} selectedValue={mobileHour} onChange={setMobileHour} />
                      <TimeWheelColumn label="Dakika" values={MINUTES} selectedValue={mobileMinute} onChange={setMobileMinute} />
                    </div>
                  </div>
                  <div className="sticky bottom-0 mt-4 bg-white/95 pt-3 backdrop-blur">
                    <div className="flex items-center justify-between rounded-2xl bg-brand-50 px-4 py-3">
                      <span className="text-xs font-bold uppercase tracking-[0.16em] text-brand-500">
                        Seçilen Saat
                      </span>
                      <span className="text-lg font-semibold text-brand-700">
                        {mobileHour}:{mobileMinute}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleTimeSelect(`${mobileHour}:${mobileMinute}`)}
                      className="mt-4 flex h-12 w-full items-center justify-center rounded-2xl bg-brand-600 text-sm font-semibold text-white shadow-lg shadow-brand-700/20 transition-colors hover:bg-brand-700"
                    >
                      Saati Onayla
                    </button>
                  </div>
                </div>

                <div className="hidden h-[320px] flex-col sm:flex">
                  <div className="mb-3 flex items-center gap-2 border-b border-brand-50 pb-3">
                    <button onClick={() => setView('date')} className="flex items-center gap-1 text-xs font-bold uppercase tracking-widest text-brand-600 hover:text-brand-700">
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
                          className={`rounded-xl py-2 text-sm font-semibold transition-all ${selectedTimeStr === t
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
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}

type TimeWheelColumnProps = {
  label: string;
  values: string[];
  selectedValue: string;
  onChange: (value: string) => void;
};

function TimeWheelColumn({ label, values, selectedValue, onChange }: TimeWheelColumnProps) {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const paddedValues = ['', '', ...values, '', ''];

  const commitSelection = (index: number, behavior: ScrollBehavior) => {
    const clampedIndex = Math.max(0, Math.min(values.length - 1, index));
    const nextValue = values[clampedIndex];

    onChange(nextValue);
    scrollRef.current?.scrollTo({
      top: clampedIndex * WHEEL_ITEM_HEIGHT,
      behavior,
    });
  };

  useEffect(() => {
    const selectedIndex = Math.max(0, values.indexOf(selectedValue));
    scrollRef.current?.scrollTo({
      top: selectedIndex * WHEEL_ITEM_HEIGHT,
      behavior: 'auto',
    });
  }, [selectedValue, values]);

  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  const handleScroll = () => {
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    scrollTimeoutRef.current = setTimeout(() => {
      const currentTop = scrollRef.current?.scrollTop ?? 0;
      const nextIndex = Math.round(currentTop / WHEEL_ITEM_HEIGHT);
      commitSelection(nextIndex, 'smooth');
    }, 80);
  };

  return (
    <div className="rounded-[22px] bg-white px-2 py-3 shadow-inner shadow-slate-900/5">
      <div className="mb-2 text-center text-[11px] font-bold uppercase tracking-[0.18em] text-brand-500">
        {label}
      </div>
      <div className="relative">
        <div className="pointer-events-none absolute inset-x-0 top-1/2 z-0 h-11 -translate-y-1/2 rounded-2xl border border-brand-100 bg-brand-50/70 shadow-sm" />
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="relative z-10 h-[176px] snap-y snap-mandatory overflow-y-auto [scrollbar-width:none] sm:h-[220px] [&::-webkit-scrollbar]:hidden"
        >
          {paddedValues.map((item, index) => {
            const isActive = item === selectedValue;

            return (
              <button
                key={`${label}-${item || 'blank'}-${index}`}
                type="button"
                disabled={!item}
                onClick={() => {
                  if (!item) return;
                  commitSelection(values.indexOf(item), 'smooth');
                }}
                className={`flex h-11 w-full snap-center items-center justify-center text-xl font-semibold transition-all ${item
                  ? isActive
                    ? 'text-brand-700'
                    : 'text-slate-400'
                  : 'cursor-default opacity-0'
                  }`}
              >
                {item || '00'}
              </button>
            );
          })}
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
