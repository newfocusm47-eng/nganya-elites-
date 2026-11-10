import React, { useState, useEffect } from 'react';
import { 
  User, Phone, Mail, Lock, LogOut, CheckCircle2, AlertCircle, 
  ShoppingBag, Image as ImageIcon, Calendar, X, Sparkles, Music, 
  Send, Plus, Trash2, RefreshCw, ArrowRight, Search, Check, 
  BarChart3, Layers, Tag, Shield, Clock, MapPin, Smartphone, Bell,
  MessageSquare
} from 'lucide-react';

// ===================================================================
// NGANYA ELITES - PRODUCTION WEB APP (2026)
// Modern Urban Futuristic / Streetwear & Neon Urban Aesthetic
// ===================================================================

export default function NganyaElitesApp() {
  // Inject Google Fonts & Fluid Typography Styles dynamically on mount
  useEffect(() => {
    const fontId = 'nganya-google-fonts';
    if (!document.getElementById(fontId)) {
      const link = document.createElement('link');
      link.id = fontId;
      link.rel = 'stylesheet';
      link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Montserrat:ital,wght@0,800;0,900;1,900&family=Permanent+Marker&display=swap';
      document.head.appendChild(link);
    }
  }, []);

  // Theme & Dynamic Hero Background State
  const [cinematicBg, setCinematicBg] = useState(
    'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1920&q=80'
  );

  // Authentication & Session States
  const [currentViewMode, setCurrentViewMode] = useState('CLIENT'); // 'CLIENT' | 'ADMIN'
  const [currentUser, setCurrentUser] = useState(null); // null if logged out
  const [isAdmin, setIsAdmin] = useState(false);
  const [authView, setAuthView] = useState('login'); // 'login' | 'register' | 'verify' | 'admin_login'

  const [authForm, setAuthForm] = useState({
    name: '', email: '', phone: '', password: '', verificationCode: '',
    adminEmail: 'elcartel4760@gmail.com', adminPassword: ''
  });
  const [authError, setAuthError] = useState('');

  // Database States (Initialized empty for superadmin population)
  const [trips, setTrips] = useState([]);
  const [events, setEvents] = useState([]);
  const [merchandise, setMerchandise] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [shopOrders, setShopOrders] = useState([]);
  const [payments, setPayments] = useState([]);
  const [messages, setMessages] = useState([]);
  const [notifications, setNotifications] = useState([]);

  // Navigation Tabs
  const [clientTab, setClientTab] = useState('trips'); // 'trips'|'events'|'merch'|'gallery'|'about'|'contact'|'account'
  const [adminTab, setAdminTab] = useState('trips'); // 'trips'|'merch'|'gallery'|'manifest'|'orders'|'shop_orders'|'reports'|'messages'|'notifications'|'theme'

  // Interactive UI States
  const [activeBookingTrip, setActiveBookingTrip] = useState(null);
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [aiDrawerOpen, setAiDrawerOpen] = useState(false);
  const [aiMessages, setAiMessages] = useState([
    { sender: 'bot', text: 'Sasa! I am AI Elites. How can I help you pick your seat, roadtrip, or official Nganya merch today?' }
  ]);
  const [aiInput, setAiInput] = useState('');
  const [manifestSearch, setManifestSearch] = useState('');

  // Toast Feedback System
  const [toast, setToast] = useState(null);
  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Form Management States
  const [tripForm, setTripForm] = useState({
    id: '', title: '', destination: '', nganyaName: '', date: '', departureTime: '',
    fare: '', totalSeats: 28, meetingPoint: '', posterUrl: ''
  });

  const [merchForm, setMerchForm] = useState({
    id: '', title: '', category: 'Apparel', price: '', sizes: 'S, M, L, XL', pickUpPoint: 'Nairobi CBD Store', description: '', imageUrl: ''
  });

  const [galleryForm, setGalleryForm] = useState({ matatuName: '', sacco: '', imageUrl: '' });
  const [paymentTxCode, setPaymentTxCode] = useState('');
  const [contactMessage, setContactMessage] = useState({ name: '', message: '' });
  const [broadcastText, setBroadcastText] = useState('');

  // -------------------------------------------------------------------
  // AUTHENTICATION HANDLERS
  // -------------------------------------------------------------------
  const handleRegister = (e) => {
    e.preventDefault();
    if (!authForm.name || !authForm.phone || !authForm.password) {
      setAuthError('Please fill in all required fields.');
      return;
    }
    setAuthError('');
    setAuthView('verify');
    showToast('6-digit security code sent to your phone!', 'info');
  };

  const handleVerifyCode = (e) => {
    e.preventDefault();
    if (authForm.verificationCode !== '476088' && authForm.verificationCode.length !== 6) {
      setAuthError('Invalid verification code. Use demo code: 476088');
      return;
    }
    const userObj = {
      id: 'USR-' + Date.now(),
      name: authForm.name,
      phone: authForm.phone,
      verified: true
    };
    setCurrentUser(userObj);
    setIsAdmin(false);
    setCurrentViewMode('CLIENT');
    setAuthError('');
    showToast(`Account verified! Welcome to Nganya Elites, ${userObj.name}!`, 'success');
  };

  const handleCustomerLogin = (e) => {
    e.preventDefault();
    if (!authForm.phone || !authForm.password) {
      setAuthError('Please enter your phone number and password.');
      return;
    }
    const userObj = {
      id: 'USR-' + Date.now(),
      name: 'Nganya Rider',
      phone: authForm.phone,
      verified: true
    };
    setCurrentUser(userObj);
    setIsAdmin(false);
    setCurrentViewMode('CLIENT');
    setAuthError('');
    showToast('Logged into rider portal!');
  };

  const handleAdminLogin = (e) => {
    e.preventDefault();
    if (authForm.adminEmail.trim().toLowerCase() === 'elcartel4760@gmail.com' && authForm.adminPassword) {
      const adminObj = {
        id: 'ADMIN-001', name: 'El Cartel Superadmin', email: 'elcartel4760@gmail.com', phone: '0712898398'
      };
      setCurrentUser(adminObj);
      setIsAdmin(true);
      setCurrentViewMode('ADMIN');
      setAuthError('');
      showToast('Superadmin access granted. Command Studio unlocked!', 'success');
    } else {
      setAuthError('Unauthorized access. Admin email must be elcartel4760@gmail.com');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setIsAdmin(false);
    setAuthView('login');
    showToast('Logged out of session.');
  };

  // -------------------------------------------------------------------
  // CLIENT WORKFLOW HANDLERS
  // -------------------------------------------------------------------
  const handleConfirmSeatBooking = (e) => {
    e.preventDefault();
    if (!selectedSeat) return showToast('Please select a seat number first', 'error');
    if (!paymentTxCode || paymentTxCode.length < 5) return showToast('Enter your M-Pesa transaction code', 'error');

    const bookingId = 'BK-' + Math.floor(100000 + Math.random() * 900000);
    const newBooking = {
      id: bookingId, tripId: activeBookingTrip.id, tripTitle: activeBookingTrip.title,
      customerName: currentUser.name, customerPhone: currentUser.phone, seatNumber: selectedSeat,
      amountPaid: activeBookingTrip.fare, mpesaCode: paymentTxCode.toUpperCase(), status: 'PENDING_VERIFICATION', boarded: false
    };

    setBookings([newBooking, ...bookings]);
    setPayments([{
      id: 'PAY-' + Date.now(), bookingId, customer: currentUser.name, phone: currentUser.phone,
      amount: activeBookingTrip.fare, txCode: paymentTxCode.toUpperCase(), type: 'SEAT_BOOKING', status: 'PENDING'
    }, ...payments]);

    setTrips(trips.map(t => t.id === activeBookingTrip.id ? { ...t, bookedSeats: [...(t.bookedSeats || []), selectedSeat] } : t));
    showToast('Booking submitted for Pochi verification (0712898398)!', 'success');
    setActiveBookingTrip(null);
    setSelectedSeat(null);
    setPaymentTxCode('');
  };

  const addToCart = (item) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) return prev.map(i => i.id === item.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { ...item, qty: 1 }];
    });
    showToast(`${item.title} added to cart!`);
  };

  const handleCheckoutMerch = (e) => {
    e.preventDefault();
    if (cart.length === 0 || !paymentTxCode) return;
    const totalAmount = cart.reduce((sum, item) => sum + (Number(item.price) * item.qty), 0);
    const orderId = 'ORD-' + Math.floor(100000 + Math.random() * 900000);

    setShopOrders([{
      id: orderId, customerName: currentUser.name, customerPhone: currentUser.phone,
      items: cart, totalAmount, txCode: paymentTxCode.toUpperCase(), status: 'PENDING_VERIFICATION'
    }, ...shopOrders]);

    setPayments([{
      id: 'PAY-' + Date.now(), orderId, customer: currentUser.name, phone: currentUser.phone,
      amount: totalAmount, txCode: paymentTxCode.toUpperCase(), type: 'SHOP_MERCH', status: 'PENDING'
    }, ...payments]);

    setCart([]); setIsCartOpen(false); setPaymentTxCode('');
    showToast('Merchandise order placed! Pending Pochi code verification.', 'success');
  };

  const handleSendContactMessage = (e) => {
    e.preventDefault();
    if (!contactMessage.name || !contactMessage.message) return;
    setMessages([{
      id: 'MSG-' + Date.now(), name: contactMessage.name, phone: currentUser?.phone || 'N/A',
      message: contactMessage.message, date: new Date().toLocaleDateString()
    }, ...messages]);
    setContactMessage({ name: '', message: '' });
    showToast('Message sent to Nganya Elites support!');
  };

  const handleSendAiMessage = (e) => {
    e.preventDefault();
    if (!aiInput.trim()) return;
    const text = aiInput.trim();
    setAiMessages(prev => [...prev, { sender: 'user', text }]);
    setAiInput('');

    setTimeout(() => {
      let reply = 'Sasa! Submit your Pochi la Biashara transaction code to 0712898398 after picking your trip seat or merch.';
      const query = text.toLowerCase();
      if (query.includes('pochi') || query.includes('pay') || query.includes('money')) {
        reply = 'Send M-Pesa payments directly to Pochi la Biashara number: 0712898398.';
      } else if (query.includes('trip') || query.includes('seat')) {
        reply = 'Check "TRIPS ON WHEELS" to select your specific seat and reserve your space!';
      }
      setAiMessages(prev => [...prev, { sender: 'bot', text: reply }]);
    }, 500);
  };

  // -------------------------------------------------------------------
  // ADMIN SAVE & DELETE HANDLERS
  // -------------------------------------------------------------------
  const handleSaveTrip = (e) => {
    e.preventDefault();
    if (!tripForm.title || !tripForm.fare) return;
    const newTrip = { ...tripForm, id: 'TRIP-' + Date.now(), bookedSeats: [] };
    setTrips([newTrip, ...trips]);
    setTripForm({ id: '', title: '', destination: '', nganyaName: '', date: '', departureTime: '', fare: '', totalSeats: 28, meetingPoint: '', posterUrl: '' });
    showToast('Roadtrip published successfully!');
  };

  const handleDeleteTripPermanently = (tripId) => {
    setTrips(trips.filter(t => t.id !== tripId));
    showToast('Trip deleted permanently', 'info');
  };

  const handleTripPosterUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setTripForm(prev => ({ ...prev, posterUrl: reader.result }));
        showToast('Trip poster uploaded successfully!');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveMerch = (e) => {
    e.preventDefault();
    if (!merchForm.title || !merchForm.price) return;
    const newItem = { ...merchForm, id: 'MERCH-' + Date.now() };
    setMerchandise([newItem, ...merchandise]);
    setMerchForm({ id: '', title: '', category: 'Apparel', price: '', sizes: 'S, M, L, XL', pickUpPoint: 'Nairobi CBD Store', description: '', imageUrl: '' });
    showToast('Merchandise item added!');
  };

  const handleDeleteMerchPermanently = (merchId) => {
    setMerchandise(merchandise.filter(m => m.id !== merchId));
    showToast('Merchandise item removed permanently', 'info');
  };

  const handleMerchImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setMerchForm(prev => ({ ...prev, imageUrl: reader.result }));
        showToast('Merchandise image uploaded!');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveGallery = (e) => {
    e.preventDefault();
    if (!galleryForm.matatuName || !galleryForm.imageUrl) return;
    setGallery([{ ...galleryForm, id: 'GAL-' + Date.now() }, ...gallery]);
    setGalleryForm({ matatuName: '', sacco: '', imageUrl: '' });
    showToast('Poster image uploaded & published to gallery!');
  };

  const handleGalleryFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setGalleryForm(prev => ({ ...prev, imageUrl: reader.result }));
        showToast('Gallery poster uploaded!');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteGalleryItem = (id) => {
    setGallery(gallery.filter(g => g.id !== id));
    showToast('Poster removed from gallery', 'info');
  };

  const handleToggleBoardedStatus = (bookingId) => {
    setBookings(bookings.map(b => b.id === bookingId ? { ...b, boarded: !b.boarded } : b));
    showToast('Passenger boarding status updated');
  };

  const handleCustomBgUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCinematicBg(reader.result);
        showToast('Custom cinematic background updated!');
      };
      reader.readAsDataURL(file);
    }
  };

  // -------------------------------------------------------------------
  // 1. MANDATORY AUTHENTICATION GATEWAY
  // -------------------------------------------------------------------
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-[#05070a] text-slate-100 flex flex-col justify-center items-center p-4 relative font-['Inter'] overflow-hidden">
        {/* Dynamic Background Image */}
        <div className="absolute inset-0 bg-cover bg-center opacity-25 transition-all duration-700 filter brightness-75 scale-105" style={{ backgroundImage: `url(${cinematicBg})` }} />
        <div className="absolute inset-0 bg-gradient-to-t from-[#05070a] via-[#05070a]/85 to-black/95 pointer-events-none" />

        <div className="w-full max-w-md bg-[#12181f]/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative z-10 backdrop-blur-2xl">
          <div className="text-center mb-8">
            <h1 className="text-[clamp(32px,4vw,48px)] font-black tracking-tighter text-white uppercase font-['Montserrat'] leading-none">
              NGANYA <span className="font-['Permanent_Marker'] text-[#ff5500] font-normal italic ml-1">ELITES</span>
            </h1>
            <p className="text-[clamp(11px,0.3vw+9px,12px)] font-['Permanent_Marker'] text-[#00e5ff] tracking-widest uppercase mt-2">
              EXPLORE CONNECT EXPERIENCE
            </p>
          </div>

          <div className="flex bg-[#05070a] p-1.5 rounded-full mb-6 border border-slate-800 text-[clamp(12px,0.4vw+10px,13px)] font-bold">
            <button 
              onClick={() => { setAuthView('login'); setAuthError(''); }} 
              className={`flex-1 py-2.5 rounded-full transition-all font-['Montserrat'] ${authView === 'login' ? 'bg-[#ff5500] text-black font-extrabold shadow-lg shadow-[#ff5500]/30' : 'text-slate-400 hover:text-white'}`}
            >
              Rider Login
            </button>
            <button 
              onClick={() => { setAuthView('register'); setAuthError(''); }} 
              className={`flex-1 py-2.5 rounded-full transition-all font-['Montserrat'] ${authView === 'register' ? 'bg-[#ff5500] text-black font-extrabold shadow-lg shadow-[#ff5500]/30' : 'text-slate-400 hover:text-white'}`}
            >
              Sign Up
            </button>
            <button 
              onClick={() => { setAuthView('admin_login'); setAuthError(''); }} 
              className={`flex-1 py-2.5 rounded-full transition-all font-['Montserrat'] ${authView === 'admin_login' ? 'bg-[#00e5ff] text-black font-extrabold shadow-lg shadow-[#00e5ff]/30' : 'text-slate-400 hover:text-white'}`}
            >
              Admin Access
            </button>
          </div>

          {authError && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 text-red-400 text-[clamp(12px,0.4vw+10px,13px)] rounded-2xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          {authView === 'login' && (
            <form onSubmit={handleCustomerLogin} className="space-y-4">
              <div>
                <label className="block text-[clamp(12px,0.4vw+10px,13px)] font-semibold text-slate-300 mb-1 uppercase tracking-wider font-['Inter']">Phone Number</label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-4 top-3.5 text-slate-500" />
                  <input type="text" placeholder="0712345678" value={authForm.phone} onChange={e => setAuthForm({ ...authForm, phone: e.target.value })} required className="w-full bg-[#05070a] border border-slate-700 rounded-full pl-11 pr-4 py-3 text-[clamp(12px,0.4vw+10px,13px)] text-white focus:outline-none focus:border-[#ff5500]" />
                </div>
              </div>
              <div>
                <label className="block text-[clamp(12px,0.4vw+10px,13px)] font-semibold text-slate-300 mb-1 uppercase tracking-wider font-['Inter']">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-4 top-3.5 text-slate-500" />
                  <input type="password" placeholder="••••••••" value={authForm.password} onChange={e => setAuthForm({ ...authForm, password: e.target.value })} required className="w-full bg-[#05070a] border border-slate-700 rounded-full pl-11 pr-4 py-3 text-[clamp(12px,0.4vw+10px,13px)] text-white focus:outline-none focus:border-[#ff5500]" />
                </div>
              </div>
              <button type="submit" className="w-full py-3.5 bg-[#ff5500] hover:bg-[#e04b00] text-black font-black text-[clamp(15px,0.5vw+13px,16px)] font-['Montserrat'] rounded-full transition-all shadow-xl shadow-[#ff5500]/25 flex items-center justify-center gap-2 uppercase tracking-widest">
                <span>Login to Rider Portal</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {authView === 'register' && (
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-[clamp(12px,0.4vw+10px,13px)] font-semibold text-slate-300 mb-1 uppercase tracking-wider font-['Inter']">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-4 top-3.5 text-slate-500" />
                  <input type="text" placeholder="Brian Omondi" value={authForm.name} onChange={e => setAuthForm({ ...authForm, name: e.target.value })} required className="w-full bg-[#05070a] border border-slate-700 rounded-full pl-11 pr-4 py-3 text-[clamp(12px,0.4vw+10px,13px)] text-white focus:outline-none focus:border-[#ff5500]" />
                </div>
              </div>
              <div>
                <label className="block text-[clamp(12px,0.4vw+10px,13px)] font-semibold text-slate-300 mb-1 uppercase tracking-wider font-['Inter']">Phone Number</label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-4 top-3.5 text-slate-500" />
                  <input type="text" placeholder="0712345678" value={authForm.phone} onChange={e => setAuthForm({ ...authForm, phone: e.target.value })} required className="w-full bg-[#05070a] border border-slate-700 rounded-full pl-11 pr-4 py-3 text-[clamp(12px,0.4vw+10px,13px)] text-white focus:outline-none focus:border-[#ff5500]" />
                </div>
              </div>
              <div>
                <label className="block text-[clamp(12px,0.4vw+10px,13px)] font-semibold text-slate-300 mb-1 uppercase tracking-wider font-['Inter']">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-4 top-3.5 text-slate-500" />
                  <input type="password" placeholder="••••••••" value={authForm.password} onChange={e => setAuthForm({ ...authForm, password: e.target.value })} required className="w-full bg-[#05070a] border border-slate-700 rounded-full pl-11 pr-4 py-3 text-[clamp(12px,0.4vw+10px,13px)] text-white focus:outline-none focus:border-[#ff5500]" />
                </div>
              </div>
              <button type="submit" className="w-full py-3.5 bg-[#ff5500] hover:bg-[#e04b00] text-black font-black text-[clamp(15px,0.5vw+13px,16px)] font-['Montserrat'] rounded-full transition-all shadow-xl shadow-[#ff5500]/25 uppercase tracking-widest">
                Send SMS Code
              </button>
            </form>
          )}

          {authView === 'verify' && (
            <form onSubmit={handleVerifyCode} className="space-y-4">
              <div className="text-center p-3 bg-[#ff5500]/10 rounded-2xl border border-[#ff5500]/20 mb-2">
                <p className="text-[clamp(12px,0.4vw+10px,13px)] text-[#ff5500] font-bold">Verification Code Dispatched</p>
                <p className="text-[clamp(11px,0.3vw+9px,12px)] text-slate-400 mt-1">Check mobile phone SMS</p>
              </div>
              <div>
                <label className="block text-[clamp(12px,0.4vw+10px,13px)] font-semibold text-slate-300 mb-1 text-center uppercase tracking-wider font-['Inter']">6-Digit Code</label>
                <input type="text" maxLength={6} placeholder="476088" value={authForm.verificationCode} onChange={e => setAuthForm({ ...authForm, verificationCode: e.target.value })} required className="w-full bg-[#05070a] border border-[#ff5500]/60 rounded-2xl px-4 py-3 text-center text-xl font-mono tracking-widest text-[#ff5500] focus:outline-none" />
                <button type="button" onClick={() => setAuthForm({ ...authForm, verificationCode: '476088' })} className="mt-2 text-[clamp(11px,0.3vw+9px,12px)] text-[#ff5500] underline w-full text-center font-bold">Quick Fill Demo Code (476088)</button>
              </div>
              <button type="submit" className="w-full py-3.5 bg-[#ff5500] hover:bg-[#e04b00] text-black font-black text-[clamp(15px,0.5vw+13px,16px)] font-['Montserrat'] rounded-full shadow-xl shadow-[#ff5500]/25 uppercase tracking-widest">
                Verify & Unlock Account
              </button>
            </form>
          )}

          {authView === 'admin_login' && (
            <form onSubmit={handleAdminLogin} className="space-y-4">
              <div className="p-3 bg-[#00e5ff]/10 border border-[#00e5ff]/20 rounded-2xl text-[clamp(12px,0.4vw+10px,13px)] text-[#00e5ff] mb-2 font-semibold">
                Superadmin Command Studio Access
              </div>
              <div>
                <label className="block text-[clamp(12px,0.4vw+10px,13px)] font-semibold text-slate-300 mb-1 uppercase tracking-wider font-['Inter']">Admin Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-4 top-3.5 text-slate-500" />
                  <input type="email" value={authForm.adminEmail} onChange={e => setAuthForm({ ...authForm, adminEmail: e.target.value })} required className="w-full bg-[#05070a] border border-slate-700 rounded-full pl-11 pr-4 py-3 text-[clamp(12px,0.4vw+10px,13px)] text-white focus:outline-none focus:border-[#00e5ff]" />
                </div>
              </div>
              <div>
                <label className="block text-[clamp(12px,0.4vw+10px,13px)] font-semibold text-slate-300 mb-1 uppercase tracking-wider font-['Inter']">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-4 top-3.5 text-slate-500" />
                  <input type="password" placeholder="••••••••" value={authForm.adminPassword} onChange={e => setAuthForm({ ...authForm, adminPassword: e.target.value })} required className="w-full bg-[#05070a] border border-slate-700 rounded-full pl-11 pr-4 py-3 text-[clamp(12px,0.4vw+10px,13px)] text-white focus:outline-none focus:border-[#00e5ff]" />
                </div>
              </div>
              <button type="submit" className="w-full py-3.5 bg-[#00e5ff] hover:bg-cyan-400 text-black font-black text-[clamp(15px,0.5vw+13px,16px)] font-['Montserrat'] rounded-full transition-all shadow-xl shadow-[#00e5ff]/25 uppercase tracking-widest">
                Enter Command Studio
              </button>
            </form>
          )}
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------------
  // 2. MAIN APPLICATION CONTAINER
  // -------------------------------------------------------------------
  return (
    <div className="min-h-screen bg-[#05070a] text-slate-100 font-['Inter'] flex flex-col justify-between selection:bg-[#ff5500] selection:text-black relative">
      
      {/* Toast Overlay */}
      {toast && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-3 bg-[#12181f] border border-slate-700 text-white px-5 py-3 rounded-full shadow-2xl animate-bounce">
          {toast.type === 'error' ? <AlertCircle className="w-5 h-5 text-red-400" /> : <CheckCircle2 className="w-5 h-5 text-[#00ff66]" />}
          <span className="text-[clamp(12px,0.4vw+10px,13px)] font-semibold">{toast.msg}</span>
        </div>
      )}

      <div>
        {/* HEADER BAR */}
        <header className="sticky top-0 z-40 bg-[#05070a]/90 backdrop-blur-xl border-b border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
            {/* Logo with Tagline */}
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => setClientTab('trips')}>
              <div>
                <span className="text-[clamp(20px,2vw,28px)] font-black tracking-tighter text-white uppercase font-['Montserrat'] block leading-none">
                  NGANYA <span className="font-['Permanent_Marker'] text-[#ff5500] font-normal italic ml-1">ELITES</span>
                </span>
                <span className="text-[clamp(11px,0.3vw+9px,12px)] font-['Permanent_Marker'] text-[#00e5ff] tracking-widest uppercase block mt-1">
                  EXPLORE CONNECT EXPERIENCE
                </span>
              </div>
            </div>

            {/* Client Navigation Items */}
            {currentViewMode === 'CLIENT' && (
              <nav className="hidden lg:flex items-center gap-1 bg-[#12181f] p-1.5 rounded-full border border-slate-800">
                {[
                  { id: 'trips', label: 'TRIPS ON WHEELS' },
                  { id: 'events', label: 'Events after dark' },
                  { id: 'merch', label: 'The merch drop' },
                  { id: 'gallery', label: 'Poster wall' },
                  { id: 'about', label: 'Street culture, elevated' },
                  { id: 'contact', label: 'Get in touch' },
                  { id: 'account', label: 'Account' }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setClientTab(tab.id)}
                    className={`px-3.5 py-2 text-[clamp(14px,0.5vw+12px,15px)] font-semibold rounded-full transition-all ${
                      clientTab === tab.id ? 'bg-[#ff5500] text-black font-black font-['Montserrat'] shadow-lg shadow-[#ff5500]/20' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </nav>
            )}

            {/* Right Header Action Icons */}
            <div className="flex items-center gap-3">
              {isAdmin && (
                <button 
                  onClick={() => setCurrentViewMode(prev => prev === 'ADMIN' ? 'CLIENT' : 'ADMIN')} 
                  className="px-4 py-2 bg-[#12181f] border border-slate-700 hover:border-[#00e5ff] text-slate-200 text-[clamp(12px,0.4vw+10px,13px)] font-bold rounded-full flex items-center gap-2 transition-all font-['Montserrat']"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-[#00e5ff]" />
                  <span className="hidden sm:inline">{currentViewMode === 'ADMIN' ? 'Client Portal' : 'Command Studio'}</span>
                </button>
              )}

              {currentViewMode === 'CLIENT' && (
                <>
                  {/* Header Notification Bell Icon */}
                  <button 
                    onClick={() => showToast(notifications.length > 0 ? notifications[0].text : 'No new notifications', 'info')}
                    className="relative p-2.5 bg-[#12181f] hover:bg-slate-800 rounded-full border border-slate-700 text-slate-200 transition-all"
                    title="Notifications"
                  >
                    <Bell className="w-4 h-4 text-[#00e5ff]" />
                    {notifications.length > 0 && (
                      <span className="absolute -top-1 -right-1 bg-[#00e5ff] text-black text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                        {notifications.length}
                      </span>
                    )}
                  </button>

                  {/* Shopping Cart Drawer */}
                  <button 
                    onClick={() => setIsCartOpen(true)} 
                    className="relative p-2.5 bg-[#12181f] hover:bg-slate-800 rounded-full border border-slate-700 text-slate-200 transition-all"
                  >
                    <ShoppingBag className="w-4 h-4 text-[#ff5500]" />
                    {cart.length > 0 && (
                      <span className="absolute -top-1 -right-1 bg-[#ff5500] text-black text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                        {cart.reduce((s, i) => s + i.qty, 0)}
                      </span>
                    )}
                  </button>

                  <button 
                    onClick={() => setClientTab('account')} 
                    className={`px-4 py-2 rounded-full text-[clamp(14px,0.5vw+12px,15px)] font-bold flex items-center gap-2 border transition-all font-['Montserrat'] ${
                      clientTab === 'account' ? 'bg-[#00e5ff] text-black border-[#00e5ff] font-extrabold' : 'bg-[#12181f] text-slate-200 border-slate-700 hover:border-[#00e5ff]'
                    }`}
                  >
                    <User className="w-4 h-4 text-[#ff5500]" />
                    <span>Account</span>
                  </button>
                </>
              )}

              {currentUser && (
                <div className="flex items-center gap-2 bg-[#12181f] border border-slate-800 p-1.5 pl-3 rounded-full">
                  <div className="text-right hidden sm:block">
                    <p className="text-[clamp(12px,0.4vw+10px,13px)] font-bold text-white leading-none">{currentUser.name}</p>
                    <p className="text-[clamp(11px,0.3vw+9px,12px)] text-[#00ff66] font-semibold">{isAdmin ? 'SUPERADMIN' : 'VERIFIED RIDER'}</p>
                  </div>
                  <button onClick={handleLogout} className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-full transition-all" title="Logout">
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Mobile Navigation Scrollbar */}
        {currentViewMode === 'CLIENT' && (
          <div className="lg:hidden flex overflow-x-auto gap-2 p-2 bg-[#05070a] border-t border-slate-800 no-scrollbar">
            {[
              { id: 'trips', label: 'TRIPS ON WHEELS' },
              { id: 'events', label: 'Events after dark' },
              { id: 'merch', label: 'The merch drop' },
              { id: 'gallery', label: 'Poster wall' },
              { id: 'about', label: 'Street culture, elevated' },
              { id: 'contact', label: 'Get in touch' },
              { id: 'account', label: 'Account' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setClientTab(tab.id)}
                className={`px-3 py-1.5 text-[clamp(14px,0.5vw+12px,15px)] font-bold rounded-full shrink-0 whitespace-nowrap font-['Montserrat'] ${
                  clientTab === tab.id ? 'bg-[#ff5500] text-black font-extrabold' : 'text-slate-400 bg-[#12181f]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        )}

        {/* =================================================================== */}
        {/* A. SUPERADMIN CONTROL STUDIO */}
        {/* =================================================================== */}
        {currentViewMode === 'ADMIN' ? (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
            {/* Header Banner */}
            <div className="bg-[#12181f] border border-[#00e5ff]/30 rounded-3xl p-6 relative overflow-hidden">
              <span className="px-3 py-1 bg-[#00e5ff]/10 text-[#00e5ff] text-[clamp(11px,0.3vw+9px,12px)] font-extrabold rounded-full uppercase tracking-wider font-['Montserrat']">
                CONTROL ROOM STUDIO
              </span>
              <h2 className="text-[clamp(24px,2vw+14px,28px)] font-black text-white uppercase font-['Montserrat'] mt-2">
                Superadmin Dashboard
              </h2>
              <p className="text-[clamp(12px,0.4vw+10px,13px)] text-slate-400 mt-1">Logged in as: elcartel4760@gmail.com • Central Pochi la Biashara: 0712898398</p>
            </div>

            {/* Complete Admin Navigation Tab Strip */}
            <div className="flex overflow-x-auto gap-2 bg-[#05070a] p-2 rounded-full border border-slate-800 no-scrollbar">
              {[
                { id: 'trips', label: 'Trips Management' },
                { id: 'merch', label: 'Merchandise Management' },
                { id: 'gallery', label: 'Poster Gallery CRUD' },
                { id: 'manifest', label: 'Manifest & Check-In' },
                { id: 'orders', label: 'Orders Ledger' },
                { id: 'shop_orders', label: 'Shop Orders' },
                { id: 'reports', label: 'Reports' },
                { id: 'messages', label: 'Messages' },
                { id: 'notifications', label: 'Notifications' },
                { id: 'theme', label: 'Custom Background' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setAdminTab(tab.id)}
                  className={`px-4 py-2 text-[clamp(14px,0.5vw+12px,15px)] font-bold rounded-full shrink-0 transition-all font-['Montserrat'] ${
                    adminTab === tab.id ? 'bg-[#ff5500] text-black font-extrabold shadow-lg shadow-[#ff5500]/20' : 'text-slate-400 bg-[#12181f]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* ADMIN TAB 1: TRIPS MANAGEMENT (Creation & Permanent Deletion) */}
            {adminTab === 'trips' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="bg-[#12181f] border border-slate-800 p-6 rounded-3xl space-y-4">
                  <h3 className="text-[clamp(20px,1.2vw+14px,22px)] font-black text-white uppercase font-['Montserrat']">Publish Roadtrip / Event</h3>
                  <form onSubmit={handleSaveTrip} className="space-y-3">
                    <div>
                      <label className="block text-[clamp(12px,0.4vw+10px,13px)] font-semibold text-slate-300 mb-1">Trip Title</label>
                      <input type="text" placeholder="Naivasha Sunset Convoy" value={tripForm.title} onChange={e => setTripForm({ ...tripForm, title: e.target.value })} required className="w-full bg-[#05070a] border border-slate-700 rounded-full px-4 py-2 text-[clamp(12px,0.4vw+10px,13px)] text-white" />
                    </div>
                    <div>
                      <label className="block text-[clamp(12px,0.4vw+10px,13px)] font-semibold text-slate-300 mb-1">Destination</label>
                      <input type="text" placeholder="Lake Naivasha Crescent Island" value={tripForm.destination} onChange={e => setTripForm({ ...tripForm, destination: e.target.value })} required className="w-full bg-[#05070a] border border-slate-700 rounded-full px-4 py-2 text-[clamp(12px,0.4vw+10px,13px)] text-white" />
                    </div>
                    <div>
                      <label className="block text-[clamp(12px,0.4vw+10px,13px)] font-semibold text-slate-300 mb-1">Nganya Assigned</label>
                      <input type="text" placeholder="CATALYST / MATRIX" value={tripForm.nganyaName} onChange={e => setTripForm({ ...tripForm, nganyaName: e.target.value })} required className="w-full bg-[#05070a] border border-slate-700 rounded-full px-4 py-2 text-[clamp(12px,0.4vw+10px,13px)] text-white" />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[clamp(12px,0.4vw+10px,13px)] font-semibold text-slate-300 mb-1">Date</label>
                        <input type="text" placeholder="Sat, 28th Nov" value={tripForm.date} onChange={e => setTripForm({ ...tripForm, date: e.target.value })} required className="w-full bg-[#05070a] border border-slate-700 rounded-full px-3 py-2 text-[clamp(12px,0.4vw+10px,13px)] text-white" />
                      </div>
                      <div>
                        <label className="block text-[clamp(12px,0.4vw+10px,13px)] font-semibold text-slate-300 mb-1">Time</label>
                        <input type="text" placeholder="07:00 AM" value={tripForm.departureTime} onChange={e => setTripForm({ ...tripForm, departureTime: e.target.value })} required className="w-full bg-[#05070a] border border-slate-700 rounded-full px-3 py-2 text-[clamp(12px,0.4vw+10px,13px)] text-white" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[clamp(12px,0.4vw+10px,13px)] font-semibold text-slate-300 mb-1">Fare / Seat (KES)</label>
                        <input type="number" placeholder="2500" value={tripForm.fare} onChange={e => setTripForm({ ...tripForm, fare: e.target.value })} required className="w-full bg-[#05070a] border border-slate-700 rounded-full px-3 py-2 text-[clamp(12px,0.4vw+10px,13px)] text-white" />
                      </div>
                      <div>
                        <label className="block text-[clamp(12px,0.4vw+10px,13px)] font-semibold text-slate-300 mb-1">Meeting Point</label>
                        <input type="text" placeholder="Kencom CBD" value={tripForm.meetingPoint} onChange={e => setTripForm({ ...tripForm, meetingPoint: e.target.value })} required className="w-full bg-[#05070a] border border-slate-700 rounded-full px-3 py-2 text-[clamp(12px,0.4vw+10px,13px)] text-white" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[clamp(12px,0.4vw+10px,13px)] font-semibold text-slate-300 mb-1">Trip Poster (URL or Upload)</label>
                      <input type="text" placeholder="Image URL" value={tripForm.posterUrl} onChange={e => setTripForm({ ...tripForm, posterUrl: e.target.value })} className="w-full bg-[#05070a] border border-slate-700 rounded-full px-4 py-2 text-[clamp(12px,0.4vw+10px,13px)] text-white mb-2" />
                      <label className="w-full flex items-center justify-center gap-2 py-2 bg-[#05070a] border border-dashed border-slate-700 rounded-full cursor-pointer text-[clamp(12px,0.4vw+10px,13px)] text-slate-300">
                        <ImageIcon className="w-4 h-4 text-[#00e5ff]" /> Upload Custom Poster
                        <input type="file" accept="image/*" onChange={handleTripPosterUpload} className="hidden" />
                      </label>
                    </div>
                    <button type="submit" className="w-full py-3 bg-[#ff5500] text-black font-black text-[clamp(15px,0.5vw+13px,16px)] font-['Montserrat'] rounded-full">
                      Publish Trip
                    </button>
                  </form>
                </div>

                <div className="lg:col-span-2 bg-[#12181f] border border-slate-800 p-6 rounded-3xl space-y-4">
                  <h3 className="text-[clamp(20px,1.2vw+14px,22px)] font-black text-white uppercase font-['Montserrat']">Active Published Trips</h3>
                  {trips.length === 0 ? (
                    <p className="text-[clamp(12px,0.4vw+10px,13px)] text-slate-500">No active trips published yet.</p>
                  ) : (
                    <div className="space-y-3">
                      {trips.map(t => (
                        <div key={t.id} className="p-4 bg-[#05070a] border border-slate-800 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                          <div>
                            <span className="px-2 py-0.5 bg-[#00e5ff]/10 text-[#00e5ff] text-[clamp(11px,0.3vw+9px,12px)] font-extrabold rounded-full">{t.nganyaName || 'NGANYA'}</span>
                            <h4 className="text-[clamp(16px,1vw+12px,18px)] font-extrabold text-white mt-1 font-['Montserrat']">{t.title}</h4>
                            <p className="text-[clamp(12px,0.4vw+10px,13px)] text-slate-400">Destination: {t.destination} • {t.date} @ {t.departureTime}</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-[clamp(16px,1vw+12px,18px)] font-black text-[#00ff66]">KES {t.fare}</span>
                            <button
                              onClick={() => handleDeleteTripPermanently(t.id)}
                              className="p-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-full border border-red-500/20"
                              title="Delete Permanently"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ADMIN TAB 2: MERCHANDISE MANAGEMENT (Add & Remove, Sizes, Pick-Up Point) */}
            {adminTab === 'merch' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="bg-[#12181f] border border-slate-800 p-6 rounded-3xl space-y-4">
                  <h3 className="text-[clamp(20px,1.2vw+14px,22px)] font-black text-white uppercase font-['Montserrat']">Add Shop Merchandise</h3>
                  <form onSubmit={handleSaveMerch} className="space-y-3">
                    <div>
                      <label className="block text-[clamp(12px,0.4vw+10px,13px)] font-semibold text-slate-300 mb-1">Item Title</label>
                      <input type="text" placeholder="Nganya Cyber Hoodie" value={merchForm.title} onChange={e => setMerchForm({ ...merchForm, title: e.target.value })} required className="w-full bg-[#05070a] border border-slate-700 rounded-full px-4 py-2 text-[clamp(12px,0.4vw+10px,13px)] text-white" />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[clamp(12px,0.4vw+10px,13px)] font-semibold text-slate-300 mb-1">Price (KES)</label>
                        <input type="number" placeholder="3500" value={merchForm.price} onChange={e => setMerchForm({ ...merchForm, price: e.target.value })} required className="w-full bg-[#05070a] border border-slate-700 rounded-full px-3 py-2 text-[clamp(12px,0.4vw+10px,13px)] text-white" />
                      </div>
                      <div>
                        <label className="block text-[clamp(12px,0.4vw+10px,13px)] font-semibold text-slate-300 mb-1">Available Sizes</label>
                        <input type="text" placeholder="S, M, L, XL, XXL" value={merchForm.sizes} onChange={e => setMerchForm({ ...merchForm, sizes: e.target.value })} required className="w-full bg-[#05070a] border border-slate-700 rounded-full px-3 py-2 text-[clamp(12px,0.4vw+10px,13px)] text-white" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[clamp(12px,0.4vw+10px,13px)] font-semibold text-slate-300 mb-1">Pick-Up Point</label>
                      <input type="text" placeholder="Nairobi CBD Store / Event Stall" value={merchForm.pickUpPoint} onChange={e => setMerchForm({ ...merchForm, pickUpPoint: e.target.value })} required className="w-full bg-[#05070a] border border-slate-700 rounded-full px-4 py-2 text-[clamp(12px,0.4vw+10px,13px)] text-white" />
                    </div>
                    <div>
                      <label className="block text-[clamp(12px,0.4vw+10px,13px)] font-semibold text-slate-300 mb-1">Merchandise Photo</label>
                      <input type="text" placeholder="Photo URL" value={merchForm.imageUrl} onChange={e => setMerchForm({ ...merchForm, imageUrl: e.target.value })} className="w-full bg-[#05070a] border border-slate-700 rounded-full px-4 py-2 text-[clamp(12px,0.4vw+10px,13px)] text-white mb-2" />
                      <label className="w-full flex items-center justify-center gap-2 py-2 bg-[#05070a] border border-dashed border-slate-700 rounded-full cursor-pointer text-[clamp(12px,0.4vw+10px,13px)] text-slate-300">
                        <ImageIcon className="w-4 h-4 text-[#00e5ff]" /> Upload File
                        <input type="file" accept="image/*" onChange={handleMerchImageUpload} className="hidden" />
                      </label>
                    </div>
                    <button type="submit" className="w-full py-3 bg-[#ff5500] text-black font-black text-[clamp(15px,0.5vw+13px,16px)] font-['Montserrat'] rounded-full">
                      Add Merchandise
                    </button>
                  </form>
                </div>

                <div className="lg:col-span-2 bg-[#12181f] border border-slate-800 p-6 rounded-3xl space-y-4">
                  <h3 className="text-[clamp(20px,1.2vw+14px,22px)] font-black text-white uppercase font-['Montserrat']">Current Merch Inventory</h3>
                  {merchandise.length === 0 ? (
                    <p className="text-[clamp(12px,0.4vw+10px,13px)] text-slate-500">No merchandise items added yet.</p>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {merchandise.map(m => (
                        <div key={m.id} className="p-4 bg-[#05070a] border border-slate-800 rounded-2xl flex flex-col justify-between">
                          <div>
                            <h4 className="text-[clamp(16px,1vw+12px,18px)] font-extrabold text-white font-['Montserrat']">{m.title}</h4>
                            <p className="text-[clamp(12px,0.4vw+10px,13px)] text-slate-400 mt-1">Sizes: {m.sizes} • Pick-up: {m.pickUpPoint}</p>
                          </div>
                          <div className="mt-4 pt-3 border-t border-slate-800 flex justify-between items-center">
                            <span className="text-[clamp(16px,1vw+12px,18px)] font-black text-[#00ff66]">KES {m.price}</span>
                            <button
                              onClick={() => handleDeleteMerchPermanently(m.id)}
                              className="px-3 py-1 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-full border border-red-500/20 text-[clamp(11px,0.3vw+9px,12px)] font-bold flex items-center gap-1"
                            >
                              <Trash2 className="w-3.5 h-3.5" /> Remove
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ADMIN TAB 3: POSTER GALLERY CRUD */}
            {adminTab === 'gallery' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="bg-[#12181f] border border-slate-800 p-6 rounded-3xl space-y-4">
                  <h3 className="text-[clamp(20px,1.2vw+14px,22px)] font-black text-white uppercase font-['Montserrat']">Upload Poster Photo</h3>
                  <form onSubmit={handleSaveGallery} className="space-y-4">
                    <div>
                      <label className="block text-[clamp(12px,0.4vw+10px,13px)] font-semibold text-slate-300 mb-1">Matatu Name</label>
                      <input type="text" placeholder="CATALYST 125" value={galleryForm.matatuName} onChange={e => setGalleryForm({ ...galleryForm, matatuName: e.target.value })} required className="w-full bg-[#05070a] border border-slate-700 rounded-full px-4 py-2 text-[clamp(12px,0.4vw+10px,13px)] text-white" />
                    </div>
                    <div>
                      <label className="block text-[clamp(12px,0.4vw+10px,13px)] font-semibold text-slate-300 mb-1">Image URL or File</label>
                      <input type="text" placeholder="https://..." value={galleryForm.imageUrl} onChange={e => setGalleryForm({ ...galleryForm, imageUrl: e.target.value })} className="w-full bg-[#05070a] border border-slate-700 rounded-full px-4 py-2 text-[clamp(12px,0.4vw+10px,13px)] text-white mb-2" />
                      <label className="w-full flex items-center justify-center gap-2 py-2 bg-[#05070a] border border-dashed border-slate-700 rounded-full cursor-pointer text-[clamp(12px,0.4vw+10px,13px)] text-slate-300">
                        <ImageIcon className="w-4 h-4 text-[#00e5ff]" /> Choose File
                        <input type="file" accept="image/*" onChange={handleGalleryFileUpload} className="hidden" />
                      </label>
                    </div>
                    <button type="submit" className="w-full py-3 bg-[#00e5ff] text-black font-black text-[clamp(15px,0.5vw+13px,16px)] font-['Montserrat'] rounded-full">
                      Publish to Poster Wall
                    </button>
                  </form>
                </div>

                <div className="lg:col-span-2 bg-[#12181f] border border-slate-800 p-6 rounded-3xl space-y-4">
                  <h3 className="text-[clamp(20px,1.2vw+14px,22px)] font-black text-white uppercase font-['Montserrat']">Poster Gallery Collection</h3>
                  {gallery.length === 0 ? (
                    <p className="text-[clamp(12px,0.4vw+10px,13px)] text-slate-500">No poster photos uploaded yet.</p>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {gallery.map(g => (
                        <div key={g.id} className="bg-[#05070a] border border-slate-800 rounded-2xl p-2 relative group">
                          <img src={g.imageUrl} alt={g.matatuName} className="w-full h-32 object-cover rounded-xl" />
                          <p className="text-[clamp(12px,0.4vw+10px,13px)] font-bold text-white mt-2 truncate">{g.matatuName}</p>
                          <button
                            onClick={() => handleDeleteGalleryItem(g.id)}
                            className="mt-2 w-full py-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 font-bold text-[clamp(11px,0.3vw+9px,12px)] rounded-lg flex items-center justify-center gap-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" /> Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ADMIN TAB 4: MANIFEST & CHECK-IN */}
            {adminTab === 'manifest' && (
              <div className="bg-[#12181f] border border-slate-800 rounded-3xl p-6 space-y-4">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                  <h3 className="text-[clamp(20px,1.2vw+14px,22px)] font-black text-white uppercase font-['Montserrat']">Digital Manifest & Boarding Check-In</h3>
                  <div className="relative w-full sm:w-64">
                    <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
                    <input
                      type="text"
                      placeholder="Search passenger or ticket..."
                      value={manifestSearch}
                      onChange={e => setManifestSearch(e.target.value)}
                      className="w-full bg-[#05070a] border border-slate-700 rounded-full pl-9 pr-4 py-2 text-[clamp(12px,0.4vw+10px,13px)] text-white"
                    />
                  </div>
                </div>

                {bookings.length === 0 ? (
                  <p className="text-[clamp(12px,0.4vw+10px,13px)] text-slate-500">No active manifests.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-[clamp(12px,0.4vw+10px,13px)]">
                      <thead className="bg-[#05070a] text-slate-400">
                        <tr>
                          <th className="p-3">Ticket</th>
                          <th className="p-3">Passenger</th>
                          <th className="p-3">Seat</th>
                          <th className="p-3">Code</th>
                          <th className="p-3">Boarding Status</th>
                          <th className="p-3 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800">
                        {bookings
                          .filter(b => b.customerName.toLowerCase().includes(manifestSearch.toLowerCase()) || b.id.toLowerCase().includes(manifestSearch.toLowerCase()))
                          .map(b => (
                            <tr key={b.id}>
                              <td className="p-3 font-mono text-[#00e5ff] font-bold">{b.id}</td>
                              <td className="p-3 font-bold text-white">{b.customerName}</td>
                              <td className="p-3 font-black text-[#ff5500]">#{b.seatNumber}</td>
                              <td className="p-3 font-mono text-amber-400">{b.mpesaCode}</td>
                              <td className="p-3">
                                {b.boarded ? (
                                  <span className="px-2 py-0.5 bg-[#00ff66]/10 text-[#00ff66] font-bold rounded-full border border-[#00ff66]/20">BOARDED</span>
                                ) : (
                                  <span className="px-2 py-0.5 bg-slate-800 text-slate-400 font-bold rounded-full">NOT BOARDED</span>
                                )}
                              </td>
                              <td className="p-3 text-right">
                                <button
                                  onClick={() => handleToggleBoardedStatus(b.id)}
                                  className="px-3 py-1 bg-[#00e5ff] text-black font-extrabold text-[clamp(11px,0.3vw+9px,12px)] rounded-full font-['Montserrat']"
                                >
                                  {b.boarded ? 'Uncheck' : 'Mark Boarded'}
                                </button>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* ADMIN TAB 5: ORDERS LEDGER */}
            {adminTab === 'orders' && (
              <div className="bg-[#12181f] border border-slate-800 rounded-3xl p-6 space-y-4">
                <h3 className="text-[clamp(20px,1.2vw+14px,22px)] font-black text-white uppercase font-['Montserrat']">Customer Seat Bookings Ledger</h3>
                {bookings.length === 0 ? (
                  <p className="text-[clamp(12px,0.4vw+10px,13px)] text-slate-500">No seat bookings submitted yet.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-[clamp(12px,0.4vw+10px,13px)]">
                      <thead className="bg-[#05070a] text-slate-400">
                        <tr>
                          <th className="p-3">Booking ID</th>
                          <th className="p-3">Customer</th>
                          <th className="p-3">Trip</th>
                          <th className="p-3">Seat</th>
                          <th className="p-3">Fare</th>
                          <th className="p-3">M-Pesa Code</th>
                          <th className="p-3">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800">
                        {bookings.map(b => (
                          <tr key={b.id}>
                            <td className="p-3 font-mono text-[#00e5ff] font-bold">{b.id}</td>
                            <td className="p-3 font-bold text-white">{b.customerName} ({b.customerPhone})</td>
                            <td className="p-3 text-slate-300">{b.tripTitle}</td>
                            <td className="p-3 font-black text-[#ff5500]">#{b.seatNumber}</td>
                            <td className="p-3 font-black text-[#00ff66]">KES {b.amountPaid}</td>
                            <td className="p-3 font-mono text-amber-400">{b.mpesaCode}</td>
                            <td className="p-3"><span className="px-2 py-0.5 bg-[#00ff66]/10 text-[#00ff66] border border-[#00ff66]/20 rounded-full font-bold">{b.status}</span></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* ADMIN TAB 6: SHOP ORDERS */}
            {adminTab === 'shop_orders' && (
              <div className="bg-[#12181f] border border-slate-800 rounded-3xl p-6 space-y-4">
                <h3 className="text-[clamp(20px,1.2vw+14px,22px)] font-black text-white uppercase font-['Montserrat']">Shop Merchandise Orders</h3>
                {shopOrders.length === 0 ? (
                  <p className="text-[clamp(12px,0.4vw+10px,13px)] text-slate-500">No merch orders submitted.</p>
                ) : (
                  <div className="space-y-3">
                    {shopOrders.map(o => (
                      <div key={o.id} className="p-4 bg-[#05070a] rounded-2xl border border-slate-800 flex justify-between items-center text-[clamp(12px,0.4vw+10px,13px)]">
                        <div>
                          <span className="font-mono text-[#00e5ff] font-bold">{o.id}</span>
                          <p className="font-bold text-white mt-1">{o.customerName} ({o.customerPhone})</p>
                          <p className="text-slate-400">Items: {o.items.map(i => `${i.title} (x${i.qty})`).join(', ')}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-black text-[#00ff66]">KES {o.totalAmount}</p>
                          <p className="font-mono text-amber-400 mt-0.5">CODE: {o.txCode}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ADMIN TAB 7: REPORTS */}
            {adminTab === 'reports' && (
              <div className="bg-[#12181f] border border-slate-800 rounded-3xl p-6 space-y-6">
                <h3 className="text-[clamp(20px,1.2vw+14px,22px)] font-black text-white uppercase font-['Montserrat']">Financial Metrics & Analytics</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 bg-[#05070a] rounded-2xl border border-slate-800">
                    <p className="text-[clamp(12px,0.4vw+10px,13px)] text-slate-400">Total Bookings Revenue</p>
                    <p className="text-[clamp(24px,2vw+14px,28px)] font-black text-[#00ff66] font-mono mt-1">
                      KES {bookings.reduce((sum, b) => sum + Number(b.amountPaid || 0), 0)}
                    </p>
                  </div>
                  <div className="p-4 bg-[#05070a] rounded-2xl border border-slate-800">
                    <p className="text-[clamp(12px,0.4vw+10px,13px)] text-slate-400">Merchandise Store Revenue</p>
                    <p className="text-[clamp(24px,2vw+14px,28px)] font-black text-[#00e5ff] font-mono mt-1">
                      KES {shopOrders.reduce((sum, o) => sum + Number(o.totalAmount || 0), 0)}
                    </p>
                  </div>
                  <div className="p-4 bg-[#05070a] rounded-2xl border border-slate-800">
                    <p className="text-[clamp(12px,0.4vw+10px,13px)] text-slate-400">Verified Payments</p>
                    <p className="text-[clamp(24px,2vw+14px,28px)] font-black text-[#ff5500] font-mono mt-1">
                      {payments.length}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* ADMIN TAB 8: MESSAGES */}
            {adminTab === 'messages' && (
              <div className="bg-[#12181f] border border-slate-800 p-6 rounded-3xl space-y-4">
                <h3 className="text-[clamp(20px,1.2vw+14px,22px)] font-black text-white uppercase font-['Montserrat']">Messages Inbox</h3>
                {messages.length === 0 ? <p className="text-[clamp(12px,0.4vw+10px,13px)] text-slate-500">No messages received.</p> : (
                  <div className="space-y-2">
                    {messages.map(m => (
                      <div key={m.id} className="p-3 bg-[#05070a] rounded-2xl text-[clamp(12px,0.4vw+10px,13px)]">
                        <p className="font-bold text-white">{m.name} ({m.phone})</p>
                        <p className="text-slate-300 mt-1">{m.message}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ADMIN TAB 9: NOTIFICATIONS */}
            {adminTab === 'notifications' && (
              <div className="bg-[#12181f] border border-slate-800 p-6 rounded-3xl max-w-xl space-y-4">
                <h3 className="text-[clamp(20px,1.2vw+14px,22px)] font-black text-white uppercase font-['Montserrat']">Broadcast System Notification</h3>
                <textarea
                  rows={3}
                  placeholder="🔥 Naivasha Convoy seats filling up fast!"
                  value={broadcastText}
                  onChange={e => setBroadcastText(e.target.value)}
                  className="w-full bg-[#05070a] border border-slate-700 rounded-2xl p-3 text-[clamp(12px,0.4vw+10px,13px)] text-white"
                />
                <button
                  onClick={() => {
                    if (!broadcastText) return;
                    setNotifications([{ id: 'N-' + Date.now(), text: broadcastText }, ...notifications]);
                    setBroadcastText('');
                    showToast('Broadcast published!');
                  }}
                  className="px-6 py-2.5 bg-[#00e5ff] text-black font-black text-[clamp(15px,0.5vw+13px,16px)] font-['Montserrat'] rounded-full"
                >
                  Broadcast Alert
                </button>
              </div>
            )}

            {/* ADMIN TAB 10: CUSTOM BACKGROUND */}
            {adminTab === 'theme' && (
              <div className="bg-[#12181f] border border-slate-800 p-6 rounded-3xl max-w-xl space-y-4">
                <h3 className="text-[clamp(20px,1.2vw+14px,22px)] font-black text-white uppercase font-['Montserrat']">Custom Background Customizer</h3>
                <div>
                  <label className="block text-[clamp(12px,0.4vw+10px,13px)] font-semibold text-slate-300 mb-1">Background Image URL</label>
                  <input
                    type="text"
                    value={cinematicBg}
                    onChange={e => setCinematicBg(e.target.value)}
                    className="w-full bg-[#05070a] border border-slate-700 rounded-full px-4 py-2 text-[clamp(12px,0.4vw+10px,13px)] text-white mb-3"
                  />
                  <label className="w-full flex items-center justify-center gap-2 py-2.5 bg-[#05070a] border border-dashed border-slate-700 rounded-full cursor-pointer text-[clamp(12px,0.4vw+10px,13px)] text-slate-300">
                    <ImageIcon className="w-4 h-4 text-[#00e5ff]" /> Upload Background Photo
                    <input type="file" accept="image/*" onChange={handleCustomBgUpload} className="hidden" />
                  </label>
                </div>
              </div>
            )}
          </div>
        ) : (

          /* =================================================================== */
          /* B. CLIENT EXPERIENCE FRONTEND */
          /* =================================================================== */
          <>
            {/* FULL-SCREEN HERO BANNER */}
            <div className="relative min-h-[85vh] sm:min-h-screen flex items-center justify-center border-b border-slate-800 overflow-hidden bg-[#05070a]">
              <div className="absolute inset-0 bg-cover bg-center transition-all duration-700 filter brightness-75 scale-105" style={{ backgroundImage: `url(${cinematicBg})` }} />
              <div className="absolute inset-0 bg-gradient-to-t from-[#05070a] via-[#05070a]/75 to-black/85" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#05070a_90%)] pointer-events-none" />

              <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center py-20">
                <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#ff5500]/15 border border-[#ff5500]/40 text-[#ff5500] text-[clamp(12px,0.4vw+10px,13px)] font-['Permanent_Marker'] rounded-full uppercase tracking-widest mb-6 backdrop-blur-md">
                  <Sparkles className="w-4 h-4 animate-spin" /> NAIROBI STREET CULTURE 2026
                </span>
                
                {/* Fluid H1 Hero Title */}
                <h1 className="text-[clamp(48px,5vw+24px,64px)] font-black text-white uppercase tracking-tighter italic font-['Montserrat'] leading-[1.05] drop-shadow-2xl">
                  RIDE LOUD <span className="font-['Permanent_Marker'] text-[#ff5500] not-italic font-normal">RIDE ELITE</span>
                </h1>
                
                <p className="text-[clamp(16px,1vw+12px,18px)] text-slate-300 max-w-2xl mx-auto mt-4 leading-relaxed font-normal font-['Inter']">
                  Book iconic nganya rides, purchase official streetwear merch, and experience street culture like never before.
                </p>

                <div className="mt-8 flex justify-center gap-4">
                  <button 
                    onClick={() => setClientTab('trips')} 
                    className="px-8 py-4 bg-[#ff5500] hover:bg-[#e04b00] text-black font-black text-[clamp(15px,0.5vw+13px,16px)] font-['Montserrat'] rounded-full shadow-xl uppercase tracking-widest scale-105 flex items-center gap-2 transition-all"
                  >
                    <span>Explore TRIPS ON WHEELS</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* MAIN PORTAL BODY */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
              
              {/* TAB 1: TRIPS ON WHEELS */}
              {clientTab === 'trips' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-[clamp(32px,3.5vw+16px,42px)] font-black text-white uppercase italic font-['Montserrat'] tracking-tight">
                      TRIPS ON WHEELS
                    </h2>
                    <p className="text-[clamp(12px,0.4vw+10px,13px)] font-['Permanent_Marker'] text-[#00e5ff] mt-1">Book iconic matatu roadtrips and weekend getaways.</p>
                  </div>

                  {trips.length === 0 ? (
                    <div className="bg-[#12181f] border border-slate-800 rounded-3xl p-12 text-center">
                      <Calendar className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                      <h3 className="text-[clamp(20px,1.2vw+14px,22px)] font-black text-white font-['Montserrat'] uppercase">No Trips Scheduled Yet</h3>
                      <p className="text-[clamp(16px,1vw+12px,18px)] text-slate-400 mt-1">Check back soon for published roadtrips!</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {trips.map(t => (
                        <div key={t.id} className="bg-[#12181f] border border-slate-800 rounded-3xl p-5 flex flex-col justify-between hover:border-[#ff5500]/50 transition-all">
                          <div>
                            <span className="px-3 py-1 bg-[#00e5ff]/10 text-[#00e5ff] text-[clamp(11px,0.3vw+9px,12px)] font-extrabold rounded-full font-['Montserrat'] uppercase">{t.nganyaName || 'NGANYA'}</span>
                            <h3 className="text-[clamp(20px,1.2vw+14px,22px)] font-black text-white mt-3 font-['Montserrat']">{t.title}</h3>
                            <p className="text-[clamp(12px,0.4vw+10px,13px)] text-slate-400 mt-1">Destination: {t.destination} • {t.date} @ {t.departureTime}</p>
                            <p className="text-[clamp(12px,0.4vw+10px,13px)] text-slate-400">Meeting Point: {t.meetingPoint}</p>
                          </div>
                          <div className="mt-4 pt-3 border-t border-slate-800 flex justify-between items-center">
                            <span className="text-[clamp(16px,1vw+12px,18px)] font-black text-[#00ff66]">KES {t.fare}</span>
                            <button onClick={() => setActiveBookingTrip(t)} className="px-4 py-2 bg-[#ff5500] text-black font-black text-[clamp(15px,0.5vw+13px,16px)] font-['Montserrat'] rounded-full">Select Seat</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: EVENTS AFTER DARK */}
              {clientTab === 'events' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-[clamp(32px,3.5vw+16px,42px)] font-black text-white uppercase italic font-['Montserrat'] tracking-tight">
                      Events after dark
                    </h2>
                    <p className="text-[clamp(12px,0.4vw+10px,13px)] font-['Permanent_Marker'] text-[#00e5ff] mt-1">Night showcases, sound clashes, and street takeovers.</p>
                  </div>
                  <div className="bg-[#12181f] border border-slate-800 rounded-3xl p-12 text-center">
                    <Music className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                    <h3 className="text-[clamp(20px,1.2vw+14px,22px)] font-black text-white font-['Montserrat'] uppercase">No Upcoming Events</h3>
                  </div>
                </div>
              )}

              {/* TAB 3: THE MERCH DROP */}
              {clientTab === 'merch' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-[clamp(32px,3.5vw+16px,42px)] font-black text-white uppercase italic font-['Montserrat'] tracking-tight">
                      The merch drop
                    </h2>
                    <p className="text-[clamp(12px,0.4vw+10px,13px)] font-['Permanent_Marker'] text-[#00e5ff] mt-1">Official street apparel and hoodies.</p>
                  </div>
                  {merchandise.length === 0 ? (
                    <div className="bg-[#12181f] border border-slate-800 rounded-3xl p-12 text-center">
                      <ShoppingBag className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                      <h3 className="text-[clamp(20px,1.2vw+14px,22px)] font-black text-white font-['Montserrat'] uppercase">Merch Drop Empty</h3>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                      {merchandise.map(m => (
                        <div key={m.id} className="bg-[#12181f] border border-slate-800 rounded-3xl p-5 flex flex-col justify-between">
                          <div>
                            <h3 className="text-[clamp(20px,1.2vw+14px,22px)] font-black text-white font-['Montserrat']">{m.title}</h3>
                            <p className="text-[clamp(12px,0.4vw+10px,13px)] text-slate-400 mt-1">Sizes: {m.sizes} • Pick-up: {m.pickUpPoint}</p>
                          </div>
                          <div className="mt-4 pt-3 border-t border-slate-800 flex justify-between items-center">
                            <span className="text-[clamp(16px,1vw+12px,18px)] font-black text-[#00ff66]">KES {m.price}</span>
                            <button onClick={() => addToCart(m)} className="px-4 py-2 bg-[#ff5500] text-black font-black text-[clamp(15px,0.5vw+13px,16px)] font-['Montserrat'] rounded-full">Add to Cart</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 4: POSTER WALL */}
              {clientTab === 'gallery' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-[clamp(32px,3.5vw+16px,42px)] font-black text-white uppercase italic font-['Montserrat'] tracking-tight">
                      Poster wall
                    </h2>
                    <p className="text-[clamp(12px,0.4vw+10px,13px)] font-['Permanent_Marker'] text-[#00e5ff] mt-1">High-octane photography showcase.</p>
                  </div>
                  {gallery.length === 0 ? (
                    <div className="bg-[#12181f] border border-slate-800 rounded-3xl p-12 text-center">
                      <ImageIcon className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                      <h3 className="text-[clamp(20px,1.2vw+14px,22px)] font-black text-white font-['Montserrat'] uppercase">Poster Wall Empty</h3>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                      {gallery.map(g => (
                        <div key={g.id} className="bg-[#12181f] border border-slate-800 rounded-3xl p-3">
                          <img src={g.imageUrl} alt={g.matatuName} className="w-full h-48 object-cover rounded-2xl" />
                          <h3 className="text-[clamp(14px,0.5vw+12px,15px)] font-extrabold text-white mt-2 font-['Montserrat']">{g.matatuName}</h3>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 5: STREET CULTURE, ELEVATED */}
              {clientTab === 'about' && (
                <div className="max-w-3xl mx-auto bg-[#12181f] border border-slate-800 rounded-3xl p-8 sm:p-12 shadow-2xl">
                  <h2 className="text-[clamp(32px,3.5vw+16px,42px)] font-black text-white uppercase italic font-['Montserrat'] tracking-tight">
                    Street culture, elevated
                  </h2>
                  <p className="text-[clamp(12px,0.4vw+10px,13px)] font-['Permanent_Marker'] text-[#ff5500] tracking-widest uppercase mt-1">
                    Who we are
                  </p>

                  <div className="mt-6 space-y-4 text-[clamp(16px,1vw+12px,18px)] text-slate-300 leading-relaxed font-normal font-['Inter']">
                    <p>
                      NGANYA ELITES brings together Nairobi's most iconic customised matatus for trips, events and experiences you won't forget.
                    </p>
                    <p>
                      From sunset cruises and lake getaways to beach roadtrips and nganya showcase nights, we turn every ride into part of the party, with booming sound systems, graffiti art and the energy only nganya culture delivers.
                    </p>
                    <p className="bg-[#05070a] p-4 rounded-2xl border border-slate-800 font-medium text-slate-200">
                      Booking is simple: pick your seat, pay a deposit or the full amount with mobile money, and show your digital ticket when you board.
                    </p>
                  </div>
                </div>
              )}

              {/* TAB 6: GET IN TOUCH */}
              {clientTab === 'contact' && (
                <div className="max-w-xl mx-auto bg-[#12181f] border border-slate-800 rounded-3xl p-8 space-y-6">
                  <div>
                    <h2 className="text-[clamp(32px,3.5vw+16px,42px)] font-black text-white uppercase italic font-['Montserrat'] tracking-tight">
                      Get in touch
                    </h2>
                    <p className="text-[clamp(12px,0.4vw+10px,13px)] font-['Permanent_Marker'] text-[#00e5ff] mt-1">Reach out to the management team directly.</p>
                  </div>

                  <div className="p-4 bg-[#05070a] rounded-2xl border border-slate-800 space-y-2 text-[clamp(14px,0.5vw+12px,15px)]">
                    <p className="flex items-center gap-2 text-slate-200">
                      <Phone className="w-4 h-4 text-[#00ff66]" /> <span className="font-bold">Mobile Lines:</span> 0706 406722 | 0745 032024
                    </p>
                    <p className="flex items-center gap-2 text-slate-200">
                      <Phone className="w-4 h-4 text-[#00e5ff]" /> <span className="font-bold">Pochi la Biashara:</span> 0712898398
                    </p>
                    <p className="flex items-center gap-2 text-slate-200">
                      <Mail className="w-4 h-4 text-[#ff5500]" /> <span className="font-bold">Admin Email:</span> elcartel4760@gmail.com
                    </p>
                  </div>

                  <form onSubmit={handleSendContactMessage} className="space-y-4">
                    <input type="text" placeholder="Your Name" value={contactMessage.name} onChange={e => setContactMessage({ ...contactMessage, name: e.target.value })} required className="w-full bg-[#05070a] border border-slate-700 rounded-full px-4 py-2.5 text-[clamp(12px,0.4vw+10px,13px)] text-white" />
                    <textarea rows={4} placeholder="Message" value={contactMessage.message} onChange={e => setContactMessage({ ...contactMessage, message: e.target.value })} required className="w-full bg-[#05070a] border border-slate-700 rounded-2xl p-4 text-[clamp(12px,0.4vw+10px,13px)] text-white" />
                    <button type="submit" className="w-full py-3.5 bg-[#ff5500] text-black font-black text-[clamp(15px,0.5vw+13px,16px)] font-['Montserrat'] rounded-full shadow-lg">Send Message</button>
                  </form>
                </div>
              )}

              {/* TAB 7: ACCOUNT */}
              {clientTab === 'account' && (
                <div className="max-w-xl mx-auto space-y-6">
                  <div>
                    <h2 className="text-[clamp(32px,3.5vw+16px,42px)] font-black text-white uppercase italic font-['Montserrat'] tracking-tight">
                      Customer Account Portal
                    </h2>
                    <p className="text-[clamp(12px,0.4vw+10px,13px)] font-['Permanent_Marker'] text-[#00e5ff] mt-1">Rider credentials & booking records.</p>
                  </div>

                  <div className="bg-[#12181f] border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
                    <div className="flex items-center gap-4 border-b border-slate-800 pb-4">
                      <div className="w-12 h-12 rounded-full bg-[#ff5500] font-black text-black text-lg flex items-center justify-center font-['Montserrat']">
                        {currentUser.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="text-[clamp(16px,1vw+12px,18px)] font-extrabold text-white font-['Montserrat']">{currentUser.name}</h3>
                        <p className="text-[clamp(12px,0.4vw+10px,13px)] text-slate-400">{currentUser.phone}</p>
                        <span className="text-[clamp(11px,0.3vw+9px,12px)] text-[#00ff66] font-bold">VERIFIED RIDER</span>
                      </div>
                    </div>
                    <button onClick={handleLogout} className="w-full py-3 bg-red-500/10 text-red-400 font-bold text-[clamp(14px,0.5vw+12px,15px)] rounded-full">Sign Out</button>
                  </div>
                </div>
              )}
            </main>
          </>
        )}
      </div>

      {/* 28-SEAT BOOKING MODAL */}
      {activeBookingTrip && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#12181f] border border-slate-800 w-full max-w-lg rounded-3xl p-6 shadow-2xl relative">
            <button onClick={() => setActiveBookingTrip(null)} className="absolute top-4 right-4 text-slate-400">
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-[clamp(24px,2vw+14px,28px)] font-black text-white font-['Montserrat']">{activeBookingTrip.title}</h3>
            <p className="text-[clamp(12px,0.4vw+10px,13px)] text-slate-400 mt-1">Fare: KES {activeBookingTrip.fare} • Select your seat</p>

            {/* 28 Seats Grid */}
            <div className="my-4 p-4 bg-[#05070a] rounded-2xl border border-slate-800 grid grid-cols-4 gap-2">
              {Array.from({ length: 28 }, (_, i) => i + 1).map(num => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setSelectedSeat(num)}
                  className={`py-2 rounded-xl text-[clamp(12px,0.4vw+10px,13px)] font-bold transition-all ${
                    selectedSeat === num ? 'bg-[#ff5500] text-black font-extrabold' : 'bg-[#12181f] text-slate-300 hover:border-[#ff5500]'
                  }`}
                >
                  #{num}
                </button>
              ))}
            </div>

            <form onSubmit={handleConfirmSeatBooking} className="space-y-3 border-t border-slate-800 pt-4">
              <p className="text-[clamp(12px,0.4vw+10px,13px)] text-slate-300">Pochi la Biashara Number: <span className="font-extrabold text-white">0712898398</span></p>
              <input
                type="text"
                placeholder="Enter M-Pesa Code"
                value={paymentTxCode}
                onChange={e => setPaymentTxCode(e.target.value)}
                required
                className="w-full bg-[#05070a] border border-slate-700 rounded-full px-4 py-2.5 text-[clamp(12px,0.4vw+10px,13px)] text-white uppercase font-mono"
              />
              <button type="submit" className="w-full py-3.5 bg-[#ff5500] text-black font-black text-[clamp(15px,0.5vw+13px,16px)] font-['Montserrat'] rounded-full">
                Confirm & Submit Booking
              </button>
            </form>
          </div>
        </div>
      )}

      {/* SHOPPING CART DRAWER */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex justify-end">
          <div className="bg-[#12181f] border-l border-slate-800 w-full max-w-md h-full p-6 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center pb-4 border-b border-slate-800">
                <h3 className="text-[clamp(20px,1.2vw+14px,22px)] font-black text-white font-['Montserrat']">Your Cart</h3>
                <button onClick={() => setIsCartOpen(false)}><X className="w-5 h-5 text-slate-400" /></button>
              </div>
              {cart.length === 0 ? <p className="text-[clamp(12px,0.4vw+10px,13px)] text-slate-500 text-center py-10">Cart is empty.</p> : (
                <div className="space-y-2 mt-4">
                  {cart.map(i => (
                    <div key={i.id} className="p-3 bg-[#05070a] rounded-xl text-[clamp(12px,0.4vw+10px,13px)] flex justify-between">
                      <span>{i.title} (x{i.qty})</span>
                      <span className="font-bold text-[#00ff66]">KES {i.price}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {cart.length > 0 && (
              <form onSubmit={handleCheckoutMerch} className="space-y-3 border-t border-slate-800 pt-4">
                <p className="text-[clamp(12px,0.4vw+10px,13px)] text-slate-300">Pochi la Biashara Number: <span className="font-extrabold text-white">0712898398</span></p>
                <input type="text" placeholder="Enter M-Pesa Code" value={paymentTxCode} onChange={e => setPaymentTxCode(e.target.value)} required className="w-full bg-[#05070a] border border-slate-700 rounded-full px-4 py-2.5 text-[clamp(12px,0.4vw+10px,13px)] text-white uppercase font-mono" />
                <button type="submit" className="w-full py-3.5 bg-[#ff5500] text-black font-black text-[clamp(15px,0.5vw+13px,16px)] font-['Montserrat'] rounded-full">Submit Merch Order</button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="bg-[#05070a] pt-12 pb-8 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-2">
            <h3 className="text-[clamp(20px,2vw,28px)] font-black tracking-tighter text-white uppercase font-['Montserrat']">
              NGANYA <span className="font-['Permanent_Marker'] text-[#ff5500] font-normal italic ml-1">ELITES</span>
            </h3>
            <p className="text-[clamp(12px,0.4vw+10px,13px)] text-slate-400 leading-relaxed font-normal">
              Nairobi's loudest nganyas, rolling to the best trips, events and experiences. Book your seat, pay with M-Pesa, and ride elite.
            </p>
          </div>
          <div>
            <h4 className="text-[clamp(12px,0.4vw+10px,13px)] font-black text-[#00e5ff] uppercase tracking-wider mb-3 font-['Montserrat']">EXPLORE</h4>
            <ul className="space-y-2 text-[clamp(14px,0.5vw+12px,15px)] text-slate-400 font-semibold">
              <li><button onClick={() => setClientTab('trips')} className="hover:text-white">TRIPS ON WHEELS</button></li>
              <li><button onClick={() => setClientTab('events')} className="hover:text-white">Events after dark</button></li>
              <li><button onClick={() => setClientTab('merch')} className="hover:text-white">The merch drop</button></li>
              <li><button onClick={() => setClientTab('gallery')} className="hover:text-white">Poster wall</button></li>
            </ul>
          </div>
          <div>
            <h4 className="text-[clamp(12px,0.4vw+10px,13px)] font-black text-[#00e5ff] uppercase tracking-wider mb-3 font-['Montserrat']">About us</h4>
            <div className="space-y-2 text-[clamp(12px,0.4vw+10px,13px)] text-slate-400 leading-relaxed">
              <p className="font-bold text-white">Who we are</p>
              <p className="font-['Permanent_Marker'] text-[#ff5500]">Street culture, elevated</p>
            </div>
          </div>
          <div>
            <h4 className="text-[clamp(12px,0.4vw+10px,13px)] font-black text-[#00e5ff] uppercase tracking-wider mb-3 font-['Montserrat']">PAY & REACH US</h4>
            <div className="space-y-2 text-[clamp(12px,0.4vw+10px,13px)] text-slate-300">
              <p className="font-black text-white text-base">0706 406722 | 0745 032024</p>
              <p className="font-black text-[#00ff66]">Pochi: 0712898398</p>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-12 pt-6 border-t border-slate-800 text-center">
          <p className="text-[clamp(11px,0.3vw+9px,12px)] text-slate-500 font-semibold">
            © 2026 NGANYA ELITES. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
