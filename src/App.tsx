import { BrowserRouter, Navigate, Outlet, Route, Routes } from 'react-router-dom';
import { BookingProvider } from './context/BookingContext';
import { AdminAuthProvider } from './context/AdminAuthContext';
import Header from './components/Header';
import Footer from './components/Footer';
import WhatsAppFloat from './components/WhatsAppFloat';
import Home from './pages/Home';
import Results from './pages/Results';
import Booking from './pages/Booking';
import Confirm from './pages/Confirm';
import About from './pages/About';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';
import RequireAdmin from './components/admin/RequireAdmin';
import AdminLayout from './components/admin/AdminLayout';
import AdminLoginPage from './pages/admin/AdminLogin';
import AdminDashboardPage from './pages/admin/AdminDashboard';
import AdminBookingsPage from './pages/admin/AdminBookings';
import AdminBookingDetailPage from './pages/admin/AdminBookingDetail';
import AdminDistancePricingPage from './pages/admin/AdminDistancePricing';

function PublicLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AdminAuthProvider>
        <BookingProvider>
          <Routes>
            <Route element={<PublicLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/results" element={<Results />} />
              <Route path="/booking" element={<Booking />} />
              <Route path="/confirm" element={<Confirm />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="*" element={<NotFound />} />
            </Route>

            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route path="/admin" element={<RequireAdmin />}>
              <Route element={<AdminLayout />}>
                <Route index element={<Navigate to="/admin/dashboard" replace />} />
                <Route path="dashboard" element={<AdminDashboardPage />} />
                <Route path="bookings" element={<AdminBookingsPage />} />
                <Route path="bookings/:bookingId" element={<AdminBookingDetailPage />} />
                <Route path="pricing/distance-tiers" element={<AdminDistancePricingPage />} />
                <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
              </Route>
            </Route>
          </Routes>
        </BookingProvider>
      </AdminAuthProvider>
    </BrowserRouter>
  );
}

export default App;
