import { FormEvent, useEffect, useMemo, useState } from 'react';
import { Plus, RefreshCcw, Save } from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import {
  createAdminDistancePriceTier,
  fetchAdminDistancePriceTiers,
  updateAdminDistancePriceTier,
  type AdminDistancePriceTier,
} from '../../lib/adminApi';

type FormState = {
  minKm: string;
  maxKm: string;
  price: string;
  currency: string;
  isActive: boolean;
};

const defaultFormState: FormState = {
  minKm: '',
  maxKm: '',
  price: '',
  currency: 'EUR',
  isActive: true,
};

function toFormState(tier: AdminDistancePriceTier): FormState {
  return {
    minKm: String(tier.minKm),
    maxKm: String(tier.maxKm),
    price: String(tier.price),
    currency: tier.currency,
    isActive: tier.isActive,
  };
}

function formatRange(tier: AdminDistancePriceTier) {
  return `${tier.minKm} - ${tier.maxKm} km`;
}

function formatPrice(tier: AdminDistancePriceTier) {
  return `${tier.price} ${tier.currency}`;
}

export default function AdminDistancePricingPage() {
  const { token } = useAdminAuth();
  const [tiers, setTiers] = useState<AdminDistancePriceTier[]>([]);
  const [form, setForm] = useState<FormState>(defaultFormState);
  const [editingTierId, setEditingTierId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadTiers() {
      if (!token) return;

      try {
        setIsLoading(true);
        setError(null);
        const response = await fetchAdminDistancePriceTiers(token);
        if (cancelled) return;
        setTiers(response.items);
      } catch (loadError) {
        if (!cancelled) {
          setError(loadError instanceof Error ? loadError.message : 'KM fiyatlari yuklenemedi.');
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    void loadTiers();
    return () => {
      cancelled = true;
    };
  }, [token]);

  const activeCount = useMemo(() => tiers.filter((tier) => tier.isActive).length, [tiers]);
  const currencyCount = useMemo(() => new Set(tiers.map((tier) => tier.currency)).size, [tiers]);

  const resetForm = () => {
    setEditingTierId(null);
    setForm(defaultFormState);
  };

  const upsertLocalTier = (nextTier: AdminDistancePriceTier) => {
    setTiers((current) => {
      const exists = current.some((item) => item.id === nextTier.id);
      const nextItems = exists
        ? current.map((item) => (item.id === nextTier.id ? nextTier : item))
        : [...current, nextTier];

      return nextItems.sort((left, right) => {
        if (left.currency !== right.currency) return left.currency.localeCompare(right.currency);
        return Number(left.minKm) - Number(right.minKm);
      });
    });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!token) return;

    const minKm = Number(form.minKm);
    const maxKm = Number(form.maxKm);
    const price = Number(form.price);

    if (!form.minKm || !form.maxKm || !form.price || !form.currency.trim()) {
      setError('Tum alanlari doldurun.');
      return;
    }
    if (!Number.isFinite(minKm) || !Number.isFinite(maxKm) || !Number.isFinite(price)) {
      setError('KM ve fiyat alanlari gecerli sayilar olmali.');
      return;
    }
    if (minKm < 0 || maxKm <= minKm || price < 0) {
      setError('KM araligi ve fiyat degerlerini kontrol edin.');
      return;
    }

    try {
      setIsSaving(true);
      setError(null);
      setSuccessMessage(null);

      const payload = {
        minKm: form.minKm,
        maxKm: form.maxKm,
        price: form.price,
        currency: form.currency.trim().toUpperCase(),
        isActive: form.isActive,
      };

      const savedTier = editingTierId
        ? await updateAdminDistancePriceTier(token, editingTierId, payload)
        : await createAdminDistancePriceTier(token, payload);

      upsertLocalTier(savedTier);
      setSuccessMessage(
        editingTierId ? 'KM fiyat araligi guncellendi.' : 'Yeni KM fiyat araligi eklendi.',
      );
      resetForm();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'KM fiyat araligi kaydedilemedi.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (tier: AdminDistancePriceTier) => {
    setEditingTierId(tier.id);
    setForm(toFormState(tier));
    setError(null);
    setSuccessMessage(null);
  };

  const handleToggleActive = async (tier: AdminDistancePriceTier) => {
    if (!token) return;

    try {
      setError(null);
      setSuccessMessage(null);
      const updated = await updateAdminDistancePriceTier(token, tier.id, {
        isActive: !tier.isActive,
      });
      upsertLocalTier(updated);
      setSuccessMessage(updated.isActive ? 'Tier aktif edildi.' : 'Tier pasif yapildi.');
    } catch (toggleError) {
      setError(toggleError instanceof Error ? toggleError.message : 'Tier durumu guncellenemedi.');
    }
  };

  return (
    <div className="space-y-6">
      <section className="rounded-[32px] border border-white/10 bg-slate-950/50 p-6 sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="text-xs uppercase tracking-[0.28em] text-cyan-200/80">Fiyatlama</div>
            <h1 className="mt-3 text-3xl sm:text-4xl font-heading font-semibold text-white">
              KM Fiyatlari
            </h1>
            <p className="mt-3 max-w-2xl text-sm text-slate-400">
              Mesafe araliklarini ve sabit fiyat tierlerini buradan yonetin. Arama ve rezervasyon
              fiyati bu tabloya gore hesaplanir.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
              <div className="text-xs uppercase tracking-[0.18em] text-slate-500">Toplam Tier</div>
              <div className="mt-2 text-2xl font-semibold text-white">{tiers.length}</div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
              <div className="text-xs uppercase tracking-[0.18em] text-slate-500">Aktif Tier</div>
              <div className="mt-2 text-2xl font-semibold text-white">{activeCount}</div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 col-span-2 sm:col-span-1">
              <div className="text-xs uppercase tracking-[0.18em] text-slate-500">Para Birimi</div>
              <div className="mt-2 text-2xl font-semibold text-white">{currencyCount}</div>
            </div>
          </div>
        </div>
      </section>

      {error ? (
        <div className="rounded-3xl border border-rose-400/20 bg-rose-400/10 px-5 py-4 text-sm text-rose-100">
          {error}
        </div>
      ) : null}

      {successMessage ? (
        <div className="rounded-3xl border border-emerald-400/20 bg-emerald-400/10 px-5 py-4 text-sm text-emerald-100">
          {successMessage}
        </div>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[1.1fr,0.9fr]">
        <section className="rounded-[32px] border border-white/10 bg-slate-950/50 p-6 sm:p-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-heading font-semibold text-white">Mevcut Tierler</h2>
              <p className="mt-2 text-sm text-slate-400">
                Aktif tierler ayni para biriminde cakismaz. Kenar degerleri birbirine degebilir.
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            {isLoading ? (
              <div className="rounded-3xl border border-white/10 bg-white/5 px-5 py-12 text-center text-sm text-slate-300">
                KM fiyatlari yukleniyor...
              </div>
            ) : tiers.length > 0 ? (
              tiers.map((tier) => (
                <div
                  key={tier.id}
                  className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-[0_16px_40px_rgba(2,6,23,0.18)]"
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-lg font-semibold text-white">{formatRange(tier)}</span>
                        <span
                          className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${
                            tier.isActive
                              ? 'border-emerald-400/20 bg-emerald-400/10 text-emerald-200'
                              : 'border-slate-400/20 bg-slate-400/10 text-slate-300'
                          }`}
                        >
                          {tier.isActive ? 'Aktif' : 'Pasif'}
                        </span>
                        <span className="inline-flex rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-semibold text-cyan-100">
                          {tier.currency}
                        </span>
                      </div>
                      <div className="mt-3 text-2xl font-heading font-semibold text-white">
                        {formatPrice(tier)}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      <button
                        type="button"
                        onClick={() => handleEdit(tier)}
                        className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/15"
                      >
                        <Save size={16} />
                        Duzenle
                      </button>
                      <button
                        type="button"
                        onClick={() => handleToggleActive(tier)}
                        className="inline-flex items-center gap-2 rounded-2xl border border-cyan-400/20 bg-cyan-400/10 px-4 py-2.5 text-sm font-semibold text-cyan-100 transition-colors hover:bg-cyan-400/15"
                      >
                        <RefreshCcw size={16} />
                        {tier.isActive ? 'Pasif Yap' : 'Aktif Yap'}
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-3xl border border-dashed border-white/10 px-5 py-12 text-center text-sm text-slate-400">
                Henuz KM fiyat araligi bulunmuyor.
              </div>
            )}
          </div>
        </section>

        <section className="rounded-[32px] border border-white/10 bg-white/5 p-6 sm:p-8 backdrop-blur-xl">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-heading font-semibold text-white">
                {editingTierId ? 'Tier Duzenle' : 'Yeni Tier'}
              </h2>
              <p className="mt-2 text-sm text-slate-400">
                {editingTierId
                  ? `Secili kayit ID: ${editingTierId}`
                  : 'Yeni bir km fiyat araligi ekleyin.'}
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setError(null);
                setSuccessMessage(null);
                resetForm();
              }}
              className="inline-flex items-center gap-2 rounded-2xl border border-white/10 px-4 py-2.5 text-sm text-slate-200 transition-colors hover:bg-white/10"
            >
              <Plus size={16} />
              Yeni Form
            </button>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-sm text-slate-300">Min KM</span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={form.minKm}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, minKm: event.target.value }))
                  }
                  className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 outline-none"
                  placeholder="0"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm text-slate-300">Max KM</span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={form.maxKm}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, maxKm: event.target.value }))
                  }
                  className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 outline-none"
                  placeholder="10"
                />
              </label>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-sm text-slate-300">Fiyat</span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={form.price}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, price: event.target.value }))
                  }
                  className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 outline-none"
                  placeholder="25"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm text-slate-300">Para Birimi</span>
                <input
                  type="text"
                  maxLength={8}
                  value={form.currency}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, currency: event.target.value.toUpperCase() }))
                  }
                  className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 uppercase outline-none"
                  placeholder="EUR"
                />
              </label>
            </div>

            <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-3 text-sm text-slate-200">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(event) =>
                  setForm((current) => ({ ...current, isActive: event.target.checked }))
                }
                className="h-4 w-4 rounded border-white/20 bg-slate-950/70"
              />
              Tier aktif olsun
            </label>

            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-cyan-400 px-5 py-3.5 text-sm font-semibold text-slate-950 transition-all hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70"
            >
              <Save size={16} />
              {isSaving
                ? 'Kaydediliyor...'
                : editingTierId
                  ? 'Tier Guncelle'
                  : 'Tier Ekle'}
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}
