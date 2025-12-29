/*
  Modern User Dashboard - Profitway Theme
  - Sleek mobile-first responsive design
  - Enhanced visual hierarchy with glassmorphism effects
  - Smooth animations and transitions
  - Professional cards with modern gradients
  - Optimized for both mobile and desktop experiences
*/
'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../../component/include/header';
import Footer from '../../component/include/footer';
import VideoPlayerModal from '../../component/VideoPlayerModal';
import { FaUser, FaBook, FaChartLine, FaMoneyBillWave, FaUsers, FaComments, FaCopy, FaEdit, FaCheck, FaTrophy, FaGraduationCap, FaRocket, FaSignOutAlt, FaBars, FaTimes, FaPlay, FaLock, FaClock } from 'react-icons/fa';

export default function UserDashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [packages, setPackages] = useState([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Course and video states
  const [selectedPackageId, setSelectedPackageId] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(false);
  const [playerVideoUrl, setPlayerVideoUrl] = useState(null);

  // Module-based course view
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [currentModuleIndex, setCurrentModuleIndex] = useState(0);
  const [moduleProgress, setModuleProgress] = useState({});

  // Wallet state
  const [walletData, setWalletData] = useState({
    wallet: { balance: 0, totalEarned: 0, totalWithdrawn: 0 },
    commissions: { activeIncome: 0, passiveIncome: 0, totalIncome: 0 },
    recentCommissions: []
  });
  const [loadingWallet, setLoadingWallet] = useState(false);

  // Withdrawal history state
  const [withdrawalHistory, setWithdrawalHistory] = useState([]);
  const [loadingWithdrawals, setLoadingWithdrawals] = useState(false);

  const closeVideoPlayer = () => {
    setPlayerVideoUrl(null);
  };

  // Indian states list
  const states = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat",
    "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh",
    "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
    "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh",
    "Uttarakhand", "West Bengal", "Andaman and Nicobar Islands", "Chandigarh",
    "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Jammu and Kashmir",
    "Ladakh", "Lakshadweep", "Puducherry"
  ];

  // Profile form state
  const [profileForm, setProfileForm] = useState({
    name: '',
    phone: '',
    state: '',
    photoPreview: null,
    photoFile: null
  });
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileMessage, setProfileMessage] = useState('');
  const [copied, setCopied] = useState(false);

  // Navigation menu items
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <FaChartLine /> },
    { id: 'myprofile', label: 'My Profile', icon: <FaUser /> },
    { id: 'mycourses', label: 'My Courses', icon: <FaBook /> },
    { id: 'affiliate', label: 'Affiliate', icon: <FaTrophy /> },
    { id: 'withdraw', label: 'Withdrawals', icon: <FaMoneyBillWave /> },
    { id: 'team', label: 'My Team', icon: <FaUsers /> },
    { id: 'community', label: 'Community', icon: <FaComments /> },
  ];

  // Load courses for a package
  const loadCourses = (packageId) => {
    setLoadingCourses(true);
    fetch(`/api/packages/${packageId}/videos`)
      .then(res => res.json())
      .then(data => setCourses(data))
      .catch(() => setCourses([]))
      .finally(() => setLoadingCourses(false));
  };

  // Load wallet data
  const loadWalletData = async (userId) => {
    setLoadingWallet(true);
    try {
      const response = await fetch(`/api/users/wallet?userId=${userId}`);
      if (response.ok) {
        const data = await response.json();
        setWalletData(data);
      }
    } catch (error) {
      console.error('Failed to load wallet data:', error);
    } finally {
      setLoadingWallet(false);
    }
  };

  // Load withdrawal history
  const loadWithdrawalHistory = async (userId) => {
    setLoadingWithdrawals(true);
    try {
      const response = await fetch(`/api/users/withdraw-history?userId=${userId}`);
      if (response.ok) {
        const data = await response.json();
        setWithdrawalHistory(data.history || []);
      }
    } catch (error) {
      console.error('Failed to load withdrawal history:', error);
      setWithdrawalHistory([]);
    } finally {
      setLoadingWithdrawals(false);
    }
  };

  useEffect(() => {
    try {
      const raw = localStorage.getItem('user');
      if (!raw) {
        router.push('/login');
        return;
      }
      const parsed = JSON.parse(raw);
      setUser(parsed);
      setProfileForm(f => ({
        ...f,
        name: parsed.username || '',
        phone: parsed.phone || '',
        state: parsed.state || '',
        photoPreview: parsed.photo || null
      }));

      // Fetch packages
      fetch('/api/packages')
        .then(r => r.json())
        .then(list => {
          const ups = list.filter(p => (parsed.approved_packages || []).includes(p.id));
          setPackages(ups);

          if (ups.length > 0) {
            parsed.package_name = ups[0].name || ups[0].title;
            setUser(parsed);
            try { localStorage.setItem('user', JSON.stringify(parsed)); } catch (e) {}
          }
        })
        .catch(() => {})
        .finally(() => setLoading(false));

      if (parsed.approved_packages_details) {
        setPackages(parsed.approved_packages_details);
        if (parsed.approved_packages_details.length > 0) {
          parsed.package_name = parsed.approved_packages_details[0].name || parsed.approved_packages_details[0].title;
          setUser(parsed);
          try { localStorage.setItem('user', JSON.stringify(parsed)); } catch (e) {}
        }
      }

      loadWalletData(parsed.id);
    } catch (e) {
      router.push('/login');
    }
  }, [router]);

  // Listen for dashboard menu clicks from header
  useEffect(() => {
    const handleDashboardMenuClick = (event) => {
      setActiveTab(event.detail);
      setIsMobileMenuOpen(false);
    };
    window.addEventListener('dashboardMenuClick', handleDashboardMenuClick);
    return () => window.removeEventListener('dashboardMenuClick', handleDashboardMenuClick);
  }, []);

  // Load withdrawal history when withdraw tab is active
  useEffect(() => {
    if (activeTab === 'withdraw' && user?.id) {
      loadWithdrawalHistory(user.id);
    }
  }, [activeTab, user?.id]);

  // Load all courses when mycourses tab is active
  useEffect(() => {
    if (activeTab === 'mycourses' && packages.length > 0) {
      setLoadingCourses(true);
      Promise.all(
        packages.map(pkg => 
          fetch(`/api/packages/${pkg.id}/videos`)
            .then(res => res.json())
            .then(data => data.map(course => ({ ...course, packageName: pkg.title || pkg.name })))
            .catch(() => [])
        )
      ).then(allCoursesArrays => {
        const allCourses = allCoursesArrays.flat();
        setCourses(allCourses);
      }).finally(() => setLoadingCourses(false));
    }
  }, [activeTab, packages]);

  const handleLogout = () => { 
    localStorage.removeItem('user'); 
    router.push('/'); 
  };

  const fileToBase64 = (file) => new Promise((res, rej) => { 
    const r = new FileReader(); 
    r.onload = () => res(r.result); 
    r.onerror = rej; 
    r.readAsDataURL(file); 
  });

  const handleSaveProfile = async () => {
    setSavingProfile(true); 
    setProfileMessage('');
    try {
      let photo = null;
      if (profileForm.photoFile) photo = await fileToBase64(profileForm.photoFile);
      const payload = {
        userId: user.id,
        name: profileForm.name,
        phone: profileForm.phone,
        state: profileForm.state,
        photo
      };
      
      const res = await fetch('/api/users/update-profile', { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify(payload) 
      });
      
      if (res.ok) {
        const updated = await res.json();
        const newUser = {
          ...user,
          username: payload.name,
          phone: payload.phone,
          state: payload.state,
          photo: updated.photo || profileForm.photoPreview
        };
        setUser(newUser);
        try { localStorage.setItem('user', JSON.stringify(newUser)); } catch (e) {}
        setProfileMessage('Profile updated successfully!');
        setTimeout(() => setProfileMessage(''), 3000);
      } else {
        setProfileMessage('Failed to save profile');
      }
    } catch (e) { 
      setProfileMessage('Failed to save profile'); 
    } finally { 
      setSavingProfile(false); 
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <Header />
      <main className="py-24">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-indigo-600 border-t-transparent"></div>
          <p className="mt-6 text-lg text-gray-600 font-medium">Loading your dashboard...</p>
        </div>
      </main>
      <Footer />
    </div>
  );

  if (!user) return null;

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <Header />
        
        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="lg:hidden fixed bottom-6 right-6 z-50 w-14 h-14 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform"
        >
          {isMobileMenuOpen ? <FaTimes className="text-xl" /> : <FaBars className="text-xl" />}
        </button>

        {/* Mobile Navigation Menu */}
        <div className={`lg:hidden fixed inset-0 z-40 transition-all duration-300 ${isMobileMenuOpen ? 'visible' : 'invisible'}`}>
          <div 
            className={`absolute inset-0 bg-black transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-50' : 'opacity-0'}`}
            onClick={() => setIsMobileMenuOpen(false)}
          ></div>
          <div className={`absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl transition-transform duration-300 ${isMobileMenuOpen ? 'translate-y-0' : 'translate-y-full'}`}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-800">Menu</h3>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"
                >
                  <FaTimes className="text-gray-600" />
                </button>
              </div>
              <nav className="space-y-2 max-h-[60vh] overflow-y-auto">
                {menuItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-4 px-4 py-4 rounded-xl transition-all ${
                      activeTab === item.id
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <span className="text-xl">{item.icon}</span>
                    <span className="font-medium">{item.label}</span>
                  </button>
                ))}
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-4 px-4 py-4 rounded-xl text-red-600 hover:bg-red-50 transition-all"
                >
                  <FaSignOutAlt className="text-xl" />
                  <span className="font-medium">Logout</span>
                </button>
              </nav>
            </div>
          </div>
        </div>

        <main className="py-8 lg:py-12 pb-24 lg:pb-12">
          <div className="max-w-7xl mx-auto px-4 lg:px-6" style={{ marginTop: "50px" }}>
            
            {/* Welcome Hero Section */}
            <div className="mb-6 lg:mb-8">
              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 p-6 lg:p-8 shadow-2xl">
                {/* Animated Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute inset-0" style={{
                    backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 80%, white 1px, transparent 1px)',
                    backgroundSize: '50px 50px'
                  }}></div>
                </div>
                
                <div className="relative z-10">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                    <div className="flex-1">
                      <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full border border-white/30 mb-4">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                        <span className="text-sm text-white font-medium">Active Now</span>
                      </div>
                      <h1 className="text-3xl lg:text-4xl font-bold text-white mb-3">
                        Welcome back, {user?.name || 'User'}! 👋
                      </h1>
                      <p className="text-blue-100 text-lg">Ready to continue your learning journey?</p>
                    </div>
                    
                    {user?.package_name && (
                      <div className="lg:flex-shrink-0">
                        <div className="inline-flex items-center gap-3 px-6 py-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-xl">
                          <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center">
                            <FaTrophy className="text-white text-xl" />
                          </div>
                          <div>
                            <div className="text-xs text-blue-100 font-medium">Current Package</div>
                            <div className="text-lg font-bold text-white">{user.package_name}</div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              
              {/* Desktop Sidebar Navigation */}
              <aside className="hidden lg:block lg:col-span-1">
                <div className="sticky top-24">
                  {/* Profile Card */}
                  <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden mb-6">
                    <div className="relative h-32 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600">
                      <div className="absolute inset-0 bg-black/10"></div>
                    </div>
                    <div className="px-6 pb-6 -mt-16 relative z-10">
                      <div className="flex flex-col items-center text-center">
                        <div className="w-24 h-24 rounded-2xl border-4 border-white overflow-hidden bg-white shadow-2xl">
                          {user?.photo ? (
                            <img src={user.photo} alt="avatar" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-white bg-gradient-to-br from-blue-500 to-indigo-600">
                              {(user?.name || 'U').charAt(0).toUpperCase()}
                            </div>
                          )}
                        </div>
                        <h3 className="mt-4 text-xl font-bold text-gray-800">{user?.name || 'User'}</h3>
                        {user?.referral_code && (
                          <div className="mt-2 px-4 py-1.5 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-full">
                            <span className="text-xs font-medium text-gray-600">ID: </span>
                            <span className="text-sm font-bold text-indigo-600">{user.referral_code}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Navigation Menu */}
                  <nav className="bg-white rounded-3xl shadow-xl border border-gray-100 p-3">
                    {menuItems.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all mb-1 ${
                          activeTab === item.id
                            ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <span className="text-lg">{item.icon}</span>
                        <span className="font-medium text-sm">{item.label}</span>
                      </button>
                    ))}
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-red-600 hover:bg-red-50 transition-all mt-2"
                    >
                      <FaSignOutAlt className="text-lg" />
                      <span className="font-medium text-sm">Logout</span>
                    </button>
                  </nav>
                </div>
              </aside>

              {/* Main Content */}
              <section className="lg:col-span-3">
                
                {/* Dashboard Tab */}
                {activeTab === 'dashboard' && (
                  <>
                    {/* Profile Summary Card - Mobile Only */}
                    <div className="lg:hidden mb-6">
                      <div className="relative bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 rounded-2xl shadow-xl p-5 overflow-hidden">
                        {/* Decorative elements */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full -ml-12 -mb-12"></div>
                        
                        {/* Package Badge - Top Right Corner */}
                        {user?.package_name && (
                          <div className="absolute top-3 right-3 z-10">
                            <div className="px-3 py-1.5 bg-white/20 backdrop-blur-md text-white rounded-lg text-xs font-bold border border-white/30">
                              {user.package_name}
                            </div>
                          </div>
                        )}
                        
                        <div className="relative z-10 flex items-center gap-4">
                          {/* Profile Photo - Left */}
                          <div className="w-20 h-20 rounded-xl overflow-hidden bg-white shadow-lg flex-shrink-0 border-2 border-white/50">
                            {user?.photo ? (
                              <img src={user.photo} alt="avatar" className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-indigo-600 bg-white">
                                {(user?.name || 'U').charAt(0).toUpperCase()}
                              </div>
                            )}
                          </div>
                          
                          {/* Name and ID - Right */}
                          <div className="flex-1 min-w-0 pr-16">
                            <h2 className="text-xl font-bold text-white mb-2 leading-tight drop-shadow-sm">{user?.name || 'User'}</h2>
                            
                            {user?.referral_code && (
                              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-lg shadow-md">
                                <span className="text-xs text-gray-600 font-medium">ID:</span>
                                <span className="text-sm font-bold text-indigo-600">{user.referral_code}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Earnings Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <EarningCard
                        title="Today Earning"
                        amount={walletData.commissions?.todayEarning || 0}
                        gradient="from-emerald-500 via-teal-500 to-cyan-600"
                        icon={<FaChartLine />}
                        loading={loadingWallet}
                      />
                      
                      <EarningCard
                        title="Last 7 Days"
                        amount={walletData.commissions?.last7DaysEarning || 0}
                        gradient="from-blue-500 via-indigo-500 to-purple-600"
                        icon={<FaClock />}
                        loading={loadingWallet}
                      />
                      
                      <EarningCard
                        title="Last 30 Days"
                        amount={walletData.commissions?.last30DaysEarning || 0}
                        gradient="from-violet-500 via-purple-500 to-pink-600"
                        icon={<FaChartLine />}
                        loading={loadingWallet}
                      />
                      
                      <EarningCard
                        title="All Time Earning"
                        amount={walletData.wallet?.totalEarned || 0}
                        gradient="from-amber-500 via-orange-500 to-red-600"
                        icon={<FaTrophy />}
                        loading={loadingWallet}
                      />
                      
                      <EarningCard
                        title="Passive Income"
                        amount={walletData.commissions?.passiveIncome || 0}
                        gradient="from-pink-500 via-rose-500 to-red-600"
                        icon={<FaRocket />}
                        loading={loadingWallet}
                      />
                      
                      <EarningCard
                        title="Available Balance"
                        amount={walletData.wallet?.balance || 0}
                        gradient="from-teal-500 via-cyan-500 to-blue-600"
                        icon={<FaMoneyBillWave />}
                        loading={loadingWallet}
                        highlight={true}
                      />
                    </div>
                  </>
                )}

                {/* My Profile Tab */}
                {activeTab === 'myprofile' && (
                  <div className="space-y-6">
                    {/* Edit Profile Card */}
                    <div className="bg-white rounded-3xl shadow-xl p-6 lg:p-8 border border-gray-100">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center">
                          <FaEdit className="text-white text-xl" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-800">Edit Profile</h3>
                      </div>

                      {profileMessage && (
                        <div className={`mb-6 p-4 rounded-2xl border-2 ${
                          profileMessage.includes('success')
                            ? 'bg-green-50 text-green-700 border-green-200'
                            : 'bg-red-50 text-red-700 border-red-200'
                        }`}>
                          <div className="flex items-center gap-2">
                            {profileMessage.includes('success') ? <FaCheck /> : '⚠️'}
                            <span className="font-medium">{profileMessage}</span>
                          </div>
                        </div>
                      )}

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                          <input
                            type="text"
                            value={profileForm.name}
                            onChange={e => setProfileForm(p => ({ ...p, name: e.target.value }))}
                            className="w-full border-2 border-gray-200 rounded-2xl px-4 py-3.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                            placeholder="Enter your name"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
                          <input
                            type="tel"
                            value={profileForm.phone}
                            onChange={e => setProfileForm(p => ({ ...p, phone: e.target.value }))}
                            className="w-full border-2 border-gray-200 rounded-2xl px-4 py-3.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                            placeholder="Enter phone number"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">State</label>
                          <select
                            value={profileForm.state}
                            onChange={e => setProfileForm(p => ({ ...p, state: e.target.value }))}
                            className="w-full border-2 border-gray-200 rounded-2xl px-4 py-3.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                          >
                            <option value="">Select your state</option>
                            {states.map(state => (
                              <option key={state} value={state}>{state}</option>
                            ))}
                          </select>
                        </div>

                        <div className="md:col-span-2">
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Profile Photo</label>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={e => {
                              const f = e.target.files?.[0] || null;
                              setProfileForm(p => ({
                                ...p,
                                photoFile: f,
                                photoPreview: f ? URL.createObjectURL(f) : p.photoPreview
                              }));
                            }}
                            className="w-full border-2 border-gray-200 rounded-2xl px-4 py-3.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                          />
                          {profileForm.photoPreview && (
                            <div className="mt-4">
                              <img
                                src={profileForm.photoPreview}
                                alt="preview"
                                className="w-28 h-28 object-cover rounded-2xl border-4 border-gray-100 shadow-lg"
                              />
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="mt-8 flex flex-col sm:flex-row gap-3">
                        <button
                          disabled={savingProfile}
                          onClick={handleSaveProfile}
                          className="flex-1 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-semibold hover:shadow-xl transform hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {savingProfile ? 'Saving...' : 'Save Profile'}
                        </button>
                        <button
                          onClick={() => copyToClipboard(`${typeof window !== 'undefined' ? window.location.origin : ''}/register?ref=${user.referral_code || ''}`)}
                          className="flex-1 px-8 py-4 bg-gray-100 text-gray-700 rounded-2xl font-semibold hover:bg-gray-200 transition-all"
                        >
                          {copied ? 'Copied!' : 'Copy Referral Link'}
                        </button>
                      </div>
                    </div>

                    {/* Change Password Card */}
                    <div className="bg-white rounded-3xl shadow-xl p-6 lg:p-8 border border-gray-100">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center">
                          <FaLock className="text-white text-xl" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-800">Change Password</h3>
                      </div>
                      <ChangePasswordForm />
                    </div>
                  </div>
                )}

                {/* My Courses Tab */}
                {activeTab === 'mycourses' && (
                  <>
                    {selectedCourse ? (
                      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
                        {/* Back Button */}
                        <div className="p-4 lg:p-6 border-b border-gray-100">
                          <button
                            onClick={() => {
                              setSelectedCourse(null);
                              setCurrentModuleIndex(0);
                            }}
                            className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors font-medium"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            Back to Courses
                          </button>
                        </div>

                        <div className="flex flex-col lg:flex-row">
                          {/* Sidebar - Module Steps (Desktop) */}
                          <div className="hidden lg:block lg:w-80 bg-gradient-to-b from-gray-50 to-white border-r border-gray-100 p-6">
                            <div className="space-y-4">
                              {(selectedCourse.modules || [selectedCourse]).map((module, index) => {
                                const progress = moduleProgress[module.id] || 0;
                                const isCompleted = progress === 100;
                                const isActive = index === currentModuleIndex;
                                const isLocked = index > 0 && (moduleProgress[(selectedCourse.modules || [selectedCourse])[index - 1]?.id] || 0) < 100;

                                return (
                                  <div key={module.id || index} className="relative">
                                    {index < (selectedCourse.modules || [selectedCourse]).length - 1 && (
                                      <div className="absolute left-6 top-16 w-0.5 h-10 bg-gray-200"></div>
                                    )}
                                    
                                    <div 
                                      className={`flex items-start gap-3 p-4 rounded-2xl cursor-pointer transition-all ${
                                        isActive ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-300 shadow-md' :
                                        'bg-white border-2 border-gray-200 hover:border-blue-300'
                                      } ${isLocked ? 'opacity-50 cursor-not-allowed' : ''}`}
                                      onClick={() => !isLocked && setCurrentModuleIndex(index)}
                                    >
                                      <div className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center ${
                                        isCompleted ? 'bg-gradient-to-br from-green-500 to-emerald-600 text-white' :
                                        isActive ? 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white' :
                                        'bg-gray-200 text-gray-500'
                                      }`}>
                                        {isCompleted ? <FaCheck className="text-lg" /> :
                                         isLocked ? <FaLock className="text-sm" /> :
                                         <span className="text-sm font-bold">{index + 1}</span>}
                                      </div>

                                      <div className="flex-1 min-w-0">
                                        <div className={`text-xs font-bold mb-1 ${isActive ? 'text-blue-600' : 'text-indigo-600'}`}>
                                          Step {index + 1}
                                        </div>
                                        <div className="text-sm font-semibold text-gray-800 mb-2 line-clamp-2">
                                          {module.title || `Module ${index + 1}`}
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                          <div 
                                            className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full transition-all"
                                            style={{ width: `${progress}%` }}
                                          ></div>
                                        </div>
                                        <div className="text-xs text-gray-500 mt-1 text-right">{progress}%</div>
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>

                          {/* Video Content Area */}
                          <div className="flex-1 p-4 lg:p-8">
                            {/* Module Navigation Tabs - Mobile */}
                            <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2 -mx-4 px-4 lg:mx-0 lg:px-0">
                              {(selectedCourse.modules || [selectedCourse]).map((module, index) => {
                                const progress = moduleProgress[module.id] || 0;
                                const isCompleted = progress === 100;
                                const isActive = index === currentModuleIndex;
                                const isLocked = index > 0 && (moduleProgress[(selectedCourse.modules || [selectedCourse])[index - 1]?.id] || 0) < 100;
                                
                                return (
                                  <button
                                    key={module.id || index}
                                    onClick={() => !isLocked && setCurrentModuleIndex(index)}
                                    disabled={isLocked}
                                    className={`flex-shrink-0 px-4 py-3 rounded-2xl text-sm font-semibold whitespace-nowrap flex items-center gap-2 transition-all ${
                                      isActive 
                                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg' 
                                        : isCompleted
                                          ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-700'
                                          : isLocked
                                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                                  >
                                    Module {index + 1}
                                    {isCompleted && <FaCheck className="text-xs" />}
                                    {isLocked && <FaLock className="text-xs" />}
                                  </button>
                                );
                              })}
                            </div>

                            {/* Current Module Title */}
                            <div className="mb-6">
                              <h2 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-2">
                                Module {currentModuleIndex + 1}
                              </h2>
                              <p className="text-gray-600">
                                {(selectedCourse.modules || [selectedCourse])[currentModuleIndex]?.title || 'Course Module'}
                              </p>
                            </div>

                            {/* Video Player */}
                            <div className="relative bg-black rounded-3xl overflow-hidden shadow-2xl mb-8">
                              {(() => {
                                const currentModule = (selectedCourse.modules || [selectedCourse])[currentModuleIndex];
                                const videoUrl = currentModule?.video || selectedCourse.video;
                                
                                const youtubeMatch = videoUrl?.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
                                
                                if (youtubeMatch) {
                                  return (
                                    <iframe
                                      className="w-full aspect-video"
                                      src={`https://www.youtube.com/embed/${youtubeMatch[1]}`}
                                      title={currentModule?.title || 'Course Video'}
                                      frameBorder="0"
                                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                      allowFullScreen
                                    ></iframe>
                                  );
                                } else if (videoUrl) {
                                  return (
                                    <video className="w-full aspect-video" controls src={videoUrl}>
                                      Your browser does not support the video tag.
                                    </video>
                                  );
                                } else {
                                  return (
                                    <div className="w-full aspect-video flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900 text-white">
                                      <div className="text-center">
                                        <FaBook className="text-5xl mx-auto mb-4 opacity-50" />
                                        <p className="text-lg">No video available</p>
                                      </div>
                                    </div>
                                  );
                                }
                              })()}
                            </div>

                            {/* Next Module Button */}
                            <div className="flex justify-center">
                              <button
                                onClick={() => {
                                  const currentModule = (selectedCourse.modules || [selectedCourse])[currentModuleIndex];
                                  setModuleProgress(prev => ({
                                    ...prev,
                                    [currentModule?.id || currentModuleIndex]: 100
                                  }));
                                  
                                  if (currentModuleIndex < (selectedCourse.modules || [selectedCourse]).length - 1) {
                                    setCurrentModuleIndex(currentModuleIndex + 1);
                                  }
                                }}
                                className="px-10 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full font-bold text-lg hover:shadow-2xl transition-all flex items-center gap-3 transform hover:scale-105"
                              >
                                {currentModuleIndex < (selectedCourse.modules || [selectedCourse]).length - 1 ? 'Next Module' : 'Complete Course'}
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* Course List View */
                      <div className="bg-white rounded-3xl shadow-xl p-6 lg:p-8 border border-gray-100">
                        <div className="flex items-center gap-3 mb-8">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center">
                            <FaBook className="text-white text-xl" />
                          </div>
                          <h2 className="text-2xl lg:text-3xl font-bold text-gray-800">My Courses</h2>
                        </div>
                        
                        {loadingCourses ? (
                          <div className="text-center py-20">
                            <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent"></div>
                            <p className="mt-6 text-lg text-gray-600 font-medium">Loading courses...</p>
                          </div>
                        ) : courses.length > 0 ? (
                          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {courses.map(course => (
                              <div key={course.id} className="group bg-white border-2 border-gray-200 rounded-3xl overflow-hidden hover:shadow-2xl hover:border-blue-300 transition-all transform hover:-translate-y-2">
                                {course.image ? (
                                  <div className="relative h-56 overflow-hidden">
                                    <img src={course.image} alt={course.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                                    {course.packageName && (
                                      <div className="absolute top-4 left-4 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-bold rounded-full shadow-lg">
                                        {course.packageName}
                                      </div>
                                    )}
                                  </div>
                                ) : (
                                  <div className="relative h-56 bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100 flex items-center justify-center">
                                    <FaBook className="text-6xl text-blue-400" />
                                    {course.packageName && (
                                      <div className="absolute top-4 left-4 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-bold rounded-full shadow-lg">
                                        {course.packageName}
                                      </div>
                                    )}
                                  </div>
                                )}
                                <div className="p-6">
                                  <h4 className="font-bold text-gray-800 text-lg mb-4 line-clamp-2 h-14">{course.title || 'Course'}</h4>
                                  <button
                                    className="w-full px-6 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-semibold hover:shadow-xl transition-all flex items-center justify-center gap-3 transform hover:scale-105"
                                    onClick={() => {
                                      setSelectedCourse(course);
                                      setCurrentModuleIndex(0);
                                    }}
                                  >
                                    <FaPlay className="text-sm" />
                                    Start Learning
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-20">
                            <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-3xl flex items-center justify-center">
                              <FaBook className="text-6xl text-blue-400" />
                            </div>
                            <p className="text-gray-500 text-xl font-medium mb-2">No courses available yet</p>
                            <p className="text-gray-400">Start your learning journey by purchasing a package</p>
                          </div>
                        )}
                      </div>
                    )}
                  </>
                )}

                {/* Affiliate Tab */}
                {activeTab === 'affiliate' && (
                  <div className="space-y-6">
                    <div className="bg-white rounded-3xl shadow-xl p-6 lg:p-8 border border-gray-100">
                      <div className="flex items-center gap-3 mb-8">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center">
                          <FaTrophy className="text-white text-xl" />
                        </div>
                        <h2 className="text-2xl lg:text-3xl font-bold text-gray-800">Affiliate Dashboard</h2>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                        <div className="p-6 rounded-3xl bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 text-white shadow-xl">
                          <div className="text-sm opacity-90 mb-2 font-medium">Total Earnings</div>
                          <div className="text-4xl font-bold">₹0</div>
                        </div>
                        <div className="p-6 rounded-3xl bg-gradient-to-br from-amber-500 via-orange-500 to-red-600 text-white shadow-xl">
                          <div className="text-sm opacity-90 mb-2 font-medium">Pending</div>
                          <div className="text-4xl font-bold">₹0</div>
                        </div>
                        <div className="p-6 rounded-3xl bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600 text-white shadow-xl">
                          <div className="text-sm opacity-90 mb-2 font-medium">Withdrawn</div>
                          <div className="text-4xl font-bold">₹0</div>
                        </div>
                      </div>

                      <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 rounded-3xl p-6 border-2 border-blue-200">
                        <div className="text-sm font-bold text-gray-700 mb-4">Your Referral Link</div>
                        <div className="flex flex-col sm:flex-row gap-3">
                          <input
                            readOnly
                            value={`${typeof window !== 'undefined' ? window.location.origin : ''}/register?ref=${user.referral_code || ''}`}
                            className="flex-1 border-2 border-gray-300 rounded-2xl px-4 py-3.5 bg-white font-mono text-sm"
                          />
                          <button
                            onClick={() => copyToClipboard(`${typeof window !== 'undefined' ? window.location.origin : ''}/register?ref=${user.referral_code || ''}`)}
                            className="px-8 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-semibold hover:shadow-xl transition-all flex items-center justify-center gap-2"
                          >
                            {copied ? <FaCheck /> : <FaCopy />}
                            {copied ? 'Copied!' : 'Copy'}
                          </button>
                        </div>
                      </div>

                      <div className="mt-8">
                        <h3 className="font-bold text-gray-800 text-xl mb-4">Recent Referrals</h3>
                        <div className="text-center py-16 bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl">
                          <FaUsers className="text-6xl text-gray-300 mx-auto mb-4" />
                          <p className="text-gray-500 text-lg font-medium">No referrals yet</p>
                          <p className="text-sm text-gray-400 mt-2">Share your link to start earning</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Withdrawals Tab */}
                {activeTab === 'withdraw' && (
                  <div className="bg-white rounded-3xl shadow-xl p-6 lg:p-8 border border-gray-100">
                    <div className="flex items-center gap-3 mb-8">
                      <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-600 rounded-2xl flex items-center justify-center">
                        <FaMoneyBillWave className="text-white text-xl" />
                      </div>
                      <h2 className="text-2xl lg:text-3xl font-bold text-gray-800">Withdrawals</h2>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                      <div className="p-8 rounded-3xl bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600 text-white shadow-xl">
                        <div className="text-sm opacity-90 mb-3 font-medium">Available Balance</div>
                        <div className="text-4xl lg:text-5xl font-bold">
                          {loadingWallet ? '...' : `₹${Number(walletData.wallet.balance || 0).toLocaleString('en-IN')}`}
                        </div>
                      </div>
                      <div className="p-6 rounded-3xl border-2 border-dashed border-gray-300 bg-gradient-to-br from-gray-50 to-white">
                        <WithdrawForm balance={walletData.wallet.balance || 0} onNewRequest={() => {}} />
                      </div>
                    </div>

                    <div>
                      <h3 className="font-bold text-gray-800 text-xl mb-6">Withdrawal History</h3>
                      {loadingWithdrawals ? (
                        <div className="text-center py-16 bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl">
                          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
                          <p className="mt-6 text-gray-600 font-medium">Loading withdrawal history...</p>
                        </div>
                      ) : withdrawalHistory.length > 0 ? (
                        <div className="space-y-4">
                          {withdrawalHistory.map((withdrawal) => (
                            <div key={withdrawal.id} className="bg-gradient-to-r from-white to-gray-50 border-2 border-gray-200 rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg">
                                    <FaMoneyBillWave className="text-white text-xl" />
                                  </div>
                                  <div>
                                    <div className="font-bold text-gray-800 text-xl">₹{Number(withdrawal.amount || 0).toLocaleString('en-IN')}</div>
                                    <div className="text-sm text-gray-500 mt-1">
                                      {new Date(withdrawal.created_at).toLocaleDateString('en-IN', {
                                        day: 'numeric',
                                        month: 'short',
                                        year: 'numeric'
                                      })} • {withdrawal.method}
                                    </div>
                                  </div>
                                </div>
                                <div className={`px-4 py-2 rounded-full text-sm font-bold ${
                                  withdrawal.status === 'approved' ? 'bg-green-100 text-green-700' :
                                  withdrawal.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                  withdrawal.status === 'rejected' ? 'bg-red-100 text-red-700' :
                                  'bg-gray-100 text-gray-700'
                                }`}>
                                  {withdrawal.status || 'pending'}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-16 bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl">
                          <FaMoneyBillWave className="text-6xl text-gray-300 mx-auto mb-4" />
                          <p className="text-gray-500 text-lg font-medium">No withdrawal history</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* My Team Tab */}
                {activeTab === 'team' && (
                  <div className="bg-white rounded-3xl shadow-xl p-6 lg:p-8 border border-gray-100">
                    <div className="flex items-center gap-3 mb-8">
                      <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center">
                        <FaUsers className="text-white text-xl" />
                      </div>
                      <h2 className="text-2xl lg:text-3xl font-bold text-gray-800">My Team</h2>
                    </div>
                    <div className="text-center py-20">
                      <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-3xl flex items-center justify-center">
                        <FaUsers className="text-6xl text-indigo-400" />
                      </div>
                      <p className="text-gray-500 text-xl font-medium mb-2">No team members yet</p>
                      <p className="text-gray-400">Build your team by sharing your referral link</p>
                    </div>
                  </div>
                )}

                {/* Community Tab */}
                {activeTab === 'community' && (
                  <div className="bg-white rounded-3xl shadow-xl p-6 lg:p-8 border border-gray-100">
                    <div className="flex items-center gap-3 mb-8">
                      <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-rose-600 rounded-2xl flex items-center justify-center">
                        <FaComments className="text-white text-xl" />
                      </div>
                      <h2 className="text-2xl lg:text-3xl font-bold text-gray-800">Community</h2>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      <div className="p-6 border-2 border-gray-200 rounded-3xl hover:border-blue-400 transition-all">
                        <h3 className="font-bold text-gray-800 text-xl mb-6">Join Our Channels</h3>
                        <ul className="space-y-4">
                          {[
                            { name: 'WhatsApp Group', color: 'from-green-500 to-emerald-600', icon: '💬' },
                            { name: 'Telegram Channel', color: 'from-blue-500 to-cyan-600', icon: '✈️' },
                            { name: 'Facebook Group', color: 'from-blue-600 to-indigo-600', icon: '👥' },
                            { name: 'Instagram', color: 'from-pink-500 to-rose-600', icon: '📸' }
                          ].map((channel, idx) => (
                            <li key={idx}>
                              <a
                                href="#"
                                className={`flex items-center justify-between px-6 py-4 rounded-2xl bg-gradient-to-r ${channel.color} text-white font-semibold hover:shadow-2xl transition-all transform hover:scale-105`}
                              >
                                <span className="flex items-center gap-3">
                                  <span className="text-2xl">{channel.icon}</span>
                                  {channel.name}
                                </span>
                                <span>→</span>
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="p-8 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-3xl border-2 border-blue-200">
                        <h3 className="font-bold text-gray-800 text-xl mb-6">Share Your Referral</h3>
                        <div className="space-y-4">
                          <input
                            readOnly
                            value={`${typeof window !== 'undefined' ? window.location.origin : ''}/register?ref=${user.referral_code || ''}`}
                            className="w-full border-2 border-gray-300 rounded-2xl px-4 py-3.5 bg-white font-mono text-sm"
                          />
                          <button
                            onClick={() => copyToClipboard(`${typeof window !== 'undefined' ? window.location.origin : ''}/register?ref=${user.referral_code || ''}`)}
                            className="w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-bold hover:shadow-2xl transition-all flex items-center justify-center gap-3 transform hover:scale-105"
                          >
                            {copied ? <FaCheck /> : <FaCopy />}
                            {copied ? 'Copied to Clipboard!' : 'Copy Referral Link'}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </section>
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
      
      {playerVideoUrl && (
        <VideoPlayerModal 
          videoUrl={playerVideoUrl} 
          onClose={closeVideoPlayer} 
        />
      )}
    </>
  );
}

// Enhanced Earning Card Component
function EarningCard({ title, amount, gradient, icon, loading, highlight = false }) {
  return (
    <div className={`group p-6 rounded-3xl bg-gradient-to-br ${gradient} text-white shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition-all ${highlight ? 'ring-4 ring-white ring-opacity-50' : ''}`}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="text-sm opacity-90 font-medium mb-1">{title}</div>
          {loading ? (
            <div className="h-10 w-24 bg-white/20 rounded-lg animate-pulse"></div>
          ) : (
            <div className="text-3xl lg:text-4xl font-bold">
              ₹{Number(amount || 0).toLocaleString('en-IN')}
            </div>
          )}
        </div>
        <div className="text-3xl lg:text-4xl opacity-80 group-hover:scale-110 transition-transform">
          {icon}
        </div>
      </div>
      <div className="flex items-center gap-2 text-xs opacity-90 font-medium">
        <span>View details</span>
        <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
        </svg>
      </div>
    </div>
  );
}

// Change Password Form Component
function ChangePasswordForm() {
  const [oldPass, setOld] = useState('');
  const [newPass, setNew] = useState('');
  const [confirm, setConfirm] = useState('');
  const [msg, setMsg] = useState('');
  const [saving, setSaving] = useState(false);

  const handle = async () => {
    setMsg('');
    if (!oldPass || !newPass) return setMsg('Please fill all fields');
    if (newPass !== confirm) return setMsg('Passwords do not match');
    if (newPass.length < 6) return setMsg('Password must be at least 6 characters');

    setSaving(true);
    try {
      const userData = localStorage.getItem('user');
      if (!userData) {
        setMsg('User not authenticated');
        return;
      }
      const user = JSON.parse(userData);

      const res = await fetch('/api/users/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          currentPassword: oldPass,
          newPassword: newPass
        })
      });

      if (res.ok) {
        setMsg('Password changed successfully!');
        setOld('');
        setNew('');
        setConfirm('');
      } else {
        const errorData = await res.json();
        setMsg(errorData.error || 'Failed to change password');
      }
    } catch (e) {
      setMsg('Failed to change password');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {msg && (
        <div className={`p-4 rounded-2xl border-2 text-sm font-medium ${
          msg.includes('success') 
            ? 'bg-green-50 text-green-700 border-green-200' 
            : 'bg-red-50 text-red-700 border-red-200'
        }`}>
          <div className="flex items-center gap-2">
            {msg.includes('success') ? <FaCheck /> : '⚠️'}
            {msg}
          </div>
        </div>
      )}
      
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Current Password</label>
        <input
          type="password"
          value={oldPass}
          onChange={e => setOld(e.target.value)}
          className="w-full border-2 border-gray-200 rounded-2xl px-4 py-3.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
          placeholder="Enter current password"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">New Password</label>
        <input
          type="password"
          value={newPass}
          onChange={e => setNew(e.target.value)}
          className="w-full border-2 border-gray-200 rounded-2xl px-4 py-3.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
          placeholder="Enter new password"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Confirm New Password</label>
        <input
          type="password"
          value={confirm}
          onChange={e => setConfirm(e.target.value)}
          className="w-full border-2 border-gray-200 rounded-2xl px-4 py-3.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
          placeholder="Confirm new password"
        />
      </div>

      <button
        disabled={saving}
        onClick={handle}
        className="w-full px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl font-bold hover:shadow-2xl transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {saving ? 'Changing Password...' : 'Change Password'}
      </button>
    </div>
  );
}

// Withdraw Form Component
function WithdrawForm({ balance = 0, onNewRequest = () => {} }) {
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('UPI');
  const [upiId, setUpiId] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [confirmAccountNumber, setConfirmAccountNumber] = useState('');
  const [bankName, setBankName] = useState('');
  const [ifscCode, setIfscCode] = useState('');
  const [msg, setMsg] = useState('');
  const [sending, setSending] = useState(false);

  const submit = async () => {
    setMsg('');
    const a = Number(amount || 0);
    if (!a || a <= 0) return setMsg('Enter a valid amount');
    if (a > balance) return setMsg('Amount exceeds balance');

    let paymentData = {};

    if (method === 'UPI') {
      if (!upiId) return setMsg('Enter UPI ID');
      paymentData = { upiId };
    } else if (method === 'Bank') {
      if (!accountNumber) return setMsg('Enter bank account number');
      if (!confirmAccountNumber) return setMsg('Confirm bank account number');
      if (accountNumber !== confirmAccountNumber) return setMsg('Account numbers do not match');
      if (!bankName) return setMsg('Enter bank name');
      if (!ifscCode) return setMsg('Enter IFSC code');
      paymentData = { accountNumber, bankName, ifscCode };
    }

    setSending(true);
    try {
      const userData = localStorage.getItem('user');
      if (!userData) {
        setMsg('User not authenticated');
        return;
      }
      const user = JSON.parse(userData);

      const res = await fetch(`/api/users/withdraw-request?userId=${user.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: a, method, ...paymentData })
      });

      if (res.ok) {
        const r = await res.json();
        onNewRequest(r);
        setMsg('Request submitted successfully!');
        setAmount('');
        setUpiId('');
        setAccountNumber('');
        setConfirmAccountNumber('');
        setBankName('');
        setIfscCode('');
      } else {
        setMsg('Failed to submit request');
      }
    } catch (e) {
      setMsg('Failed to submit request');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-4">
      <h4 className="font-bold text-gray-800 text-lg">Request Withdrawal</h4>

      {msg && (
        <div className={`p-3 rounded-2xl border-2 text-sm font-medium ${
          msg.includes('success')
            ? 'bg-green-50 text-green-700 border-green-200'
            : 'bg-red-50 text-red-700 border-red-200'
        }`}>
          {msg}
        </div>
      )}

      <div className="text-sm text-gray-600">
        Available: <span className="font-bold text-gray-800 text-lg">₹{balance}</span>
      </div>

      <input
        type="number"
        value={amount}
        onChange={e => setAmount(e.target.value)}
        className="w-full border-2 border-gray-200 rounded-2xl px-4 py-3.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
        placeholder="Enter amount"
      />

      <select
        value={method}
        onChange={e => setMethod(e.target.value)}
        className="w-full border-2 border-gray-200 rounded-2xl px-4 py-3.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
      >
        <option value="UPI">UPI</option>
        <option value="Bank">Bank Transfer</option>
      </select>

      {method === 'UPI' && (
        <input
          type="text"
          value={upiId}
          onChange={e => setUpiId(e.target.value)}
          className="w-full border-2 border-gray-200 rounded-2xl px-4 py-3.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
          placeholder="Enter UPI ID"
        />
      )}

      {method === 'Bank' && (
        <>
          <input
            type="text"
            value={accountNumber}
            onChange={e => setAccountNumber(e.target.value)}
            className="w-full border-2 border-gray-200 rounded-2xl px-4 py-3.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            placeholder="Enter bank account number"
          />

          <input
            type="text"
            value={confirmAccountNumber}
            onChange={e => setConfirmAccountNumber(e.target.value)}
            className="w-full border-2 border-gray-200 rounded-2xl px-4 py-3.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            placeholder="Confirm bank account number"
          />

          <input
            type="text"
            value={bankName}
            onChange={e => setBankName(e.target.value)}
            className="w-full border-2 border-gray-200 rounded-2xl px-4 py-3.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            placeholder="Enter bank name"
          />

          <input
            type="text"
            value={ifscCode}
            onChange={e => setIfscCode(e.target.value)}
            className="w-full border-2 border-gray-200 rounded-2xl px-4 py-3.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            placeholder="Enter IFSC code"
          />
        </>
      )}

      <button
        disabled={sending}
        onClick={submit}
        className="w-full px-6 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-2xl font-bold hover:shadow-2xl transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {sending ? 'Submitting...' : 'Request Withdrawal'}
      </button>
    </div>
  );
}