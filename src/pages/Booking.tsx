import { useState, useEffect, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBooking } from '../context/BookingContext';
import { createBooking } from '../lib/api';
import { formatPrice } from '../lib/price';
import { ArrowLeft, User, Phone, FileText, Mail } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function Booking() {
  const navigate = useNavigate();
  const { searchParams, selectedVehicle, setBookingReference, setBookingData } = useBooking();
  const { dictionary, locale } = useLanguage();
  const { booking } = dictionary;
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
  }>({});

  useEffect(() => {
    if (!searchParams || !selectedVehicle) {
      navigate('/');
    }
  }, [searchParams, selectedVehicle, navigate]);

  if (!searchParams || !selectedVehicle) {
    return null;
  }

  const validateForm = () => {
    const newErrors: {
      firstName?: string;
      lastName?: string;
      email?: string;
      phone?: string;
    } = {};

    if (!firstName.trim()) {
      newErrors.firstName = booking.errors.firstNameRequired;
    }

    if (!lastName.trim()) {
      newErrors.lastName = booking.errors.lastNameRequired;
    }

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      newErrors.email = booking.errors.emailRequired;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      newErrors.email = booking.errors.emailInvalid;
    }

    if (!phone.trim()) {
      newErrors.phone = booking.errors.phoneRequired;
    } else if (phone.replace(/\D/g, '').length < 10) {
      newErrors.phone = booking.errors.phoneInvalid;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    const safeFullName = [firstName, lastName].map((part) => part.trim()).filter(Boolean).join(' ');

    try {
      const response = await createBooking({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        fullName: safeFullName,
        email: email.trim(),
        phone,
        from: searchParams.from,
        to: searchParams.to,
        datetime: searchParams.datetime,
        returnDatetime: searchParams.returnDatetime,
        passengers: searchParams.passengers,
        vehicleType: selectedVehicle.type,
        vehicleId: selectedVehicle.id,
        vehicleTypeId: selectedVehicle.vehicleTypeId ?? selectedVehicle.id,
        vehicleName: selectedVehicle.name,
        price: selectedVehicle.priceTotal ?? selectedVehicle.price,
        priceOneWay: selectedVehicle.priceOneWay,
        priceTotal: selectedVehicle.priceTotal ?? selectedVehicle.price,
        currency: selectedVehicle.currency,
        seats: selectedVehicle.seats ?? selectedVehicle.capacity.passengers,
        bags: selectedVehicle.bags ?? selectedVehicle.capacity.luggage,
        routeUrl: selectedVehicle.routeUrl,
        notes,
      });

      setBookingReference(response.pnrCode ?? response.id ?? null);
      setBookingData(response);

      const confirmTarget =
        response.confirmPath ??
        (response.confirmUrl
          ? (() => {
              try {
                const url = new URL(response.confirmUrl);
                return url.pathname + url.search;
              } catch {
                return response.confirmUrl;
              }
            })()
          : response.id
            ? `/confirm?booking_id=${response.id}${
                response.confirmToken ? `&token=${response.confirmToken}` : ''
              }`
            : '/confirm');

      navigate(confirmTarget);
    } catch (error) {
      console.error('Booking error:', error);
      alert(booking.alerts.genericError);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatPhoneInput = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 10) {
      return numbers.replace(/(\d{3})(\d{3})(\d{2})(\d{2})/, '($1) $2 $3 $4');
    }
    return value;
  };

  return (
    <div className="min-h-screen py-10">
      <div className="page-shell">
        <button
          onClick={() => navigate('/results')}
          className="inline-flex items-center gap-2 text-slate-600 hover:text-brand-600 mb-6 transition-colors"
        >
          <ArrowLeft size={20} />
          <span className="font-semibold">{booking.backButton}</span>
        </button>

        <h1 className="text-3xl font-heading font-semibold text-slate-900 mb-8">{booking.title}</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <form
              onSubmit={handleSubmit}
              className="rounded-[32px] border border-white/70 bg-white/80 backdrop-blur-2xl shadow-card p-8"
            >
              <h2 className="text-xl font-heading font-semibold text-slate-900 mb-6">
                {booking.contactTitle}
              </h2>

              <div className="space-y-6">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-semibold text-slate-700 mb-2">
                    {booking.fields.firstName} <span className="text-brand-600">*</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input
                      id="firstName"
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className={`w-full h-14 rounded-2xl border px-4 pl-11 bg-white/80 backdrop-blur-sm shadow-inner shadow-slate-900/5 focus:border-brand-200 focus:ring-4 focus:ring-brand-500/15 transition outline-none ${
                        errors.firstName ? 'border-red-400' : 'border-white/70'
                      }`}
                      placeholder={booking.fields.firstNamePlaceholder}
                    />
                  </div>
                  {errors.firstName && (
                    <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="lastName" className="block text-sm font-semibold text-slate-700 mb-2">
                    {booking.fields.lastName} <span className="text-brand-600">*</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input
                      id="lastName"
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className={`w-full h-14 rounded-2xl border px-4 pl-11 bg-white/80 backdrop-blur-sm shadow-inner shadow-slate-900/5 focus:border-brand-200 focus:ring-4 focus:ring-brand-500/15 transition outline-none ${
                        errors.lastName ? 'border-red-400' : 'border-white/70'
                      }`}
                      placeholder={booking.fields.lastNamePlaceholder}
                    />
                  </div>
                  {errors.lastName && (
                    <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-2">
                    {booking.fields.email} <span className="text-brand-600">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={`w-full h-14 rounded-2xl border px-4 pl-11 bg-white/80 backdrop-blur-sm shadow-inner shadow-slate-900/5 focus:border-brand-200 focus:ring-4 focus:ring-brand-500/15 transition outline-none ${
                        errors.email ? 'border-red-400' : 'border-white/70'
                      }`}
                      placeholder={booking.fields.emailPlaceholder}
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-semibold text-slate-700 mb-2">
                    {booking.fields.phone} <span className="text-brand-600">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input
                      id="phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(formatPhoneInput(e.target.value))}
                      className={`w-full h-14 rounded-2xl border px-4 pl-11 bg-white/80 backdrop-blur-sm shadow-inner shadow-slate-900/5 focus:border-brand-200 focus:ring-4 focus:ring-brand-500/15 transition outline-none ${
                        errors.phone ? 'border-red-400' : 'border-white/70'
                      }`}
                      placeholder={booking.fields.phonePlaceholder}
                    />
                  </div>
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="notes" className="block text-sm font-semibold text-slate-700 mb-2">
                    {booking.fields.notes}
                  </label>
                  <div className="relative">
                    <FileText className="absolute left-4 top-4 text-slate-400" size={20} />
                    <textarea
                      id="notes"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows={4}
                      className="w-full rounded-2xl border border-white/70 bg-white/80 backdrop-blur-sm px-4 pl-11 py-3 shadow-inner shadow-slate-900/5 focus:border-brand-200 focus:ring-4 focus:ring-brand-500/15 transition outline-none resize-none"
                      placeholder={booking.fields.notesPlaceholder}
                    />
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-14 rounded-2xl bg-gradient-to-r from-brand-500 to-brand-600 text-white font-semibold shadow-glow hover:-translate-y-0.5 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? booking.submitting : booking.submit}
                </button>
              </div>
            </form>
          </div>

          <div className="lg:col-span-1">
            <div className="rounded-3xl border border-white/70 bg-white/80 backdrop-blur-xl p-6 shadow-card sticky top-24">
              <h3 className="text-lg font-heading font-semibold text-slate-900 mb-4">{booking.summaryTitle}</h3>

              <div className="space-y-4 mb-6 text-sm">
                <div className="rounded-2xl border border-white/60 bg-white/60 p-4">
                  <p className="text-slate-500">{booking.summary.route}</p>
                  <p className="font-semibold text-slate-900">
                    {searchParams.from.description} → {searchParams.to.description}
                  </p>
                </div>

                <div className="rounded-2xl border border-white/60 bg-white/60 p-4">
                  <p className="text-slate-500">{booking.summary.datetime}</p>
                  <p className="font-semibold text-slate-900">
                    {new Date(searchParams.datetime).toLocaleString(locale)}
                  </p>
                </div>

                {searchParams.roundTrip && searchParams.returnDatetime && (
                  <div className="rounded-2xl border border-white/60 bg-white/60 p-4">
                    <p className="text-slate-500">{booking.summary.return}</p>
                    <p className="font-semibold text-slate-900">
                      {new Date(searchParams.returnDatetime).toLocaleString(locale)}
                    </p>
                  </div>
                )}

                <div className="rounded-2xl border border-white/60 bg-white/60 p-4">
                  <p className="text-slate-500">{booking.summary.passengers}</p>
                  <p className="font-semibold text-slate-900">
                    {searchParams.passengers} {booking.summary.passengersSuffix}
                  </p>
                </div>

                <div className="rounded-2xl border border-white/60 bg-white/60 p-4">
                  <p className="text-slate-500">{booking.summary.vehicle}</p>
                  <p className="font-semibold text-slate-900">{selectedVehicle.name}</p>
                </div>
              </div>

              <div className="border-t border-white/60 pt-4 mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold text-slate-900">{booking.summary.estimatedPrice}</span>
                  <span className="text-2xl font-bold text-brand-600">
                    {formatPrice(selectedVehicle.price, locale, selectedVehicle.currency ?? 'TRY')}
                  </span>
                </div>
              </div>

              <div className="rounded-2xl border border-brand-500/30 bg-brand-500/10 p-4 text-sm font-semibold text-brand-700">
                {booking.summary.cashNote}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
