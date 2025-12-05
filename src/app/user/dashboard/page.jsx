/*
  Redesigned User Dashboard - Profitway Theme
  - Modern blue gradient design matching Profitway brand
  - Enhanced visual hierarchy with professional cards
  - Improved mobile responsiveness
  - Client component with localStorage authentication
*/
'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../../component/include/header';
import Footer from '../../component/include/footer';
import VideoPlayerModal from '../../component/VideoPlayerModal';
import { FaUser, FaBook, FaChartLine, FaMoneyBillWave, FaUsers, FaComments, FaCopy, FaEdit, FaCheck, FaTrophy, FaGraduationCap, FaRocket } from 'react-icons/fa';

export default function UserDashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [packages, setPackages] = useState([]);

  // Add state for course viewing and video player
  const [selectedPackageId, setSelectedPackageId] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(false);
  const [playerVideoUrl, setPlayerVideoUrl] = useState(null);

  // Add wallet state
  const [walletData, setWalletData] = useState({
    wallet: { balance: 0, totalEarned: 0, totalWithdrawn: 0 },
    commissions: { activeIncome: 0, passiveIncome: 0, totalIncome: 0 },
    recentCommissions: []
  });
  const [loadingWallet, setLoadingWallet] = useState(false);

  // Add withdrawal history state
  const [withdrawalHistory, setWithdrawalHistory] = useState([]);
  const [loadingWithdrawals, setLoadingWithdrawals] = useState(false);

  const closeVideoPlayer = () => {
    setPlayerVideoUrl(null);
  };

  // comprehensive list of Indian states and union territories
  const states = [
    "Andhra Pradesh",
    "Arunachal Pradesh",
    "Assam",
    "Bihar",
    "Chhattisgarh",
    "Goa",
    "Gujarat",
    "Haryana",
    "Himachal Pradesh",
    "Jharkhand",
    "Karnataka",
    "Kerala",
    "Madhya Pradesh",
    "Maharashtra",
    "Manipur",
    "Meghalaya",
    "Mizoram",
    "Nagaland",
    "Odisha",
    "Punjab",
    "Rajasthan",
    "Sikkim",
    "Tamil Nadu",
    "Telangana",
    "Tripura",
    "Uttar Pradesh",
    "Uttarakhand",
    "West Bengal",
    "Andaman and Nicobar Islands",
    "Chandigarh",
    "Dadra and Nagar Haveli and Daman and Diu",
    "Delhi",
    "Jammu and Kashmir",
    "Ladakh",
    "Lakshadweep",
    "Puducherry",
  ];

  // profile form state
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

  // Function to toggle course listing for a package
  const toggleCourses = (packageId) => {
    if (selectedPackageId === packageId) {
      setSelectedPackageId(null);
      setCourses([]);
    } else {
      setSelectedPackageId(packageId);
      loadCourses(packageId);
    }
  };

  // Function to load courses for a package
  const loadCourses = (packageId) => {
    setLoadingCourses(true);
    fetch(`/api/packages/${packageId}/videos`)
      .then(res => res.json())
      .then(data => {
        setCourses(data);
      })
      .catch(() => {
        setCourses([]);
      })
      .finally(() => {
        setLoadingCourses(false);
      });
  };

  // Function to load wallet data
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

  // Function to load withdrawal history
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

      // fetch packages
      fetch('/api/packages')
        .then(r => r.json())
        .then(list => {
          const ups = list.filter(p => (parsed.approved_packages || []).includes(p.id));
          setPackages(ups);
        })
        .catch(() => {})
        .finally(() => setLoading(false));

      if (parsed.approved_packages_details) {
        setPackages(parsed.approved_packages_details);
      }

      // Load wallet data
      loadWalletData(parsed.id);
    } catch (e) {
      router.push('/login');
    }
  }, [router]);

  // Load withdrawal history when withdraw tab is active
  useEffect(() => {
    if (activeTab === 'withdraw' && user?.id) {
      loadWithdrawalHistory(user.id);
    }
  }, [activeTab, user?.id]);

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      <Header />
      <main className="py-24">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </main>
      <Footer />
    </div>
  );

  if (!user) return null;

  const menuItems = [
    { k: 'dashboard', l: 'Dashboard', i: <FaUser /> },
    { k: 'myprofile', l: 'My Profile', i: <FaEdit /> },
    { k: 'mycourses', l: 'My Courses', i: <FaBook /> },
    { k: 'affiliate', l: 'Affiliate', i: <FaChartLine /> },
    { k: 'withdraw', l: 'Withdrawals', i: <FaMoneyBillWave /> },
    { k: 'team', l: 'My Team', i: <FaUsers /> },
    { k: 'community', l: 'Community', i: <FaComments /> }
  ];

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50">
        <Header />
        
        <main className="py-8 lg:py-12">
          <div className="max-w-7xl mx-auto px-4 lg:px-6" style={{ marginTop: "50px" }}>
            
            {/* Welcome Banner */}
            <div className="mb-6 lg:mb-8">
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-700 p-6 lg:p-8 shadow-xl">
                <div className="absolute inset-0 bg-black opacity-5"></div>
                <div className="relative z-10">
                  <div className="mb-4">
                    <h2 className="text-2xl lg:text-3xl font-bold text-white mb-2">
                      Welcome back, {user?.username || 'User'}! 👋
                    </h2>
                    <p className="text-blue-100">Track your progress and manage your learning journey</p>
                  </div>
                  <div className="flex items-center gap-3">
                    {user?.package_name && (
                      <div className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-lg border border-white/30">
                        <div className="text-xs text-blue-100">Current Package</div>
                        <div className="text-sm font-semibold text-white mt-1">{user.package_name}</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              
              {/* Sidebar Navigation */}
              <aside className="lg:col-span-1">
                {/* Desktop Sidebar */}
                <div className="hidden lg:block sticky top-24">
                  <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                    <div className="p-6 bg-gradient-to-br from-blue-600 to-cyan-600">
                      <div className="flex flex-col items-center text-center">
                        <div className="w-20 h-20 rounded-full border-4 border-white overflow-hidden bg-white shadow-lg">
                          {user?.photo ? (
                            <img src={user.photo} alt="avatar" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-blue-600 bg-blue-50">
                              {(user?.username || 'U').charAt(0).toUpperCase()}
                            </div>
                          )}
                        </div>
                        <h3 className="mt-3 text-lg font-bold text-white">{user?.username || 'User'}</h3>
                        {user?.referral_code && (
                          <div className="mt-2 px-3 py-1 bg-white/20 rounded-full text-xs text-white font-medium">
                            ID: {user.referral_code}
                          </div>
                        )}
                      </div>
                    </div>

                    <nav className="p-3">
                      {menuItems.map(item => (
                        <button
                          key={item.k}
                          onClick={() => setActiveTab(item.k)}
                          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl mb-2 transition-all ${
                            activeTab === item.k
                              ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-md transform scale-[1.02]'
                              : 'text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          <span className={activeTab === item.k ? 'text-white' : 'text-blue-600'}>
                            {item.i}
                          </span>
                          <span className="text-sm font-medium">{item.l}</span>
                        </button>
                      ))}
                    </nav>

                    <div className="p-4 border-t border-gray-100">
                      <button
                        onClick={handleLogout}
                        className="w-full px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                </div>

                {/* Mobile Navigation */}
                <div className="lg:hidden bg-white rounded-xl shadow-md p-2 mb-4 overflow-x-auto">
                  <div className="flex gap-2">
                    {menuItems.map(item => (
                      <button
                        key={item.k}
                        onClick={() => setActiveTab(item.k)}
                        className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                          activeTab === item.k
                            ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-md'
                            : 'bg-gray-50 text-gray-700'
                        }`}
                      >
                        <span>{item.i}</span>
                        <span className="whitespace-nowrap">{item.l}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </aside>

              {/* Main Content */}
              <section className="lg:col-span-3">
                
                {/* Dashboard Tab */}
                {activeTab === 'dashboard' && (
                  <>
                    {/* Profile Information & Stats - Move to top for mobile */}
                    <div className="block lg:hidden mb-4">
                      <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
                        <div className="relative h-32 bg-gradient-to-br from-blue-600 to-cyan-600">
                          <div className="absolute inset-0 bg-black opacity-10"></div>
                        </div>
                        <div className="px-6 pb-6">
                          <div className="flex flex-col items-center -mt-16">
                            <div className="w-28 h-28 rounded-full border-4 border-white overflow-hidden bg-white shadow-xl" style={{ zIndex: 9 }}>
                              {user?.photo ? (
                                <img src={user.photo} alt="avatar" className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-blue-600 bg-blue-50">
                                  {(user?.username || 'U').charAt(0).toUpperCase()}
                                </div>
                              )}
                            </div>
                            <h3 className="mt-4 text-xl font-bold text-gray-800">{user?.username || 'User'}</h3>
                            {user?.package_name && (
                              <div className="mt-2 px-4 py-1 bg-gradient-to-r from-blue-600 to-cyan-600 text-white text-xs font-semibold rounded-full">
                                {user.package_name}
                              </div>
                            )}
                          </div>

                          <div className="mt-6 space-y-3">
                            <div className="p-3 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-100">
                              <div className="text-xs text-gray-600 font-medium">Referral Code</div>
                              <div className="flex items-center justify-between mt-1">
                                <span className="font-bold text-blue-600">{user.referral_code || '—'}</span>
                                <button
                                  onClick={() => copyToClipboard(user.referral_code || '')}
                                  className="text-blue-600 hover:text-blue-700"
                                >
                                  {copied ? <FaCheck className="text-green-600" /> : <FaCopy />}
                                </button>
                              </div>
                            </div>

                            <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                              <div className="text-xs text-gray-600 font-medium">Sponsor Code</div>
                              <div className="font-bold text-gray-800 mt-1">{user.sponsor_code || '—'}</div>
                            </div>

                            <div className="p-3 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-100">
                              <div className="text-xs text-gray-600 font-medium">Courses Completed</div>
                              <div className="font-bold text-emerald-600 mt-1">{user.completed_courses || 0}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Earnings Overview Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      <EarningCard
                        title="Total Earned"
                        amount={walletData.wallet.totalEarned}
                        gradient="from-pink-500 to-rose-600"
                        icon={<FaRocket />}
                        loading={loadingWallet}
                      />
                      <EarningCard
                        title="Active Income"
                        amount={walletData.commissions.activeIncome}
                        gradient="from-amber-500 to-orange-600"
                        icon={<FaTrophy />}
                        loading={loadingWallet}
                      />
                      <EarningCard
                        title="Passive Income"
                        amount={walletData.commissions.passiveIncome}
                        gradient="from-violet-500 to-purple-600"
                        icon={<FaChartLine />}
                        loading={loadingWallet}
                      />
                      <EarningCard
                        title="Available Balance"
                        amount={walletData.wallet.balance}
                        gradient="from-emerald-500 to-teal-600"
                        icon={<FaGraduationCap />}
                        loading={loadingWallet}
                      />
                    </div>
                  </>
                )}

                {/* My Profile Tab */}
                {activeTab === 'myprofile' && (
                  <div className="lg:col-span-2 space-y-6">

                    {/* Edit Profile */}
                    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                      <div className="flex items-center gap-2 mb-4">
                        <FaEdit className="text-blue-600" />
                        <h3 className="text-lg font-bold text-gray-800">Edit Profile</h3>
                      </div>

                      {profileMessage && (
                        <div className={`mb-4 p-3 rounded-lg ${
                          profileMessage.includes('success')
                            ? 'bg-green-50 text-green-700 border border-green-200'
                            : 'bg-red-50 text-red-700 border border-red-200'
                        }`}>
                          {profileMessage}
                        </div>
                      )}

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                          <input
                            type="text"
                            value={profileForm.name}
                            onChange={e => setProfileForm(p => ({ ...p, name: e.target.value }))}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            placeholder="Enter your name"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                          <input
                            type="tel"
                            value={profileForm.phone}
                            onChange={e => setProfileForm(p => ({ ...p, phone: e.target.value }))}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            placeholder="Enter phone number"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                          <select
                            value={profileForm.state}
                            onChange={e => setProfileForm(p => ({ ...p, state: e.target.value }))}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          >
                            <option value="">Select your state</option>
                            {states.map(state => (
                              <option key={state} value={state}>{state}</option>
                            ))}
                          </select>
                        </div>

                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-2">Profile Photo</label>
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
                            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          />
                          {profileForm.photoPreview && (
                            <div className="mt-3">
                              <img
                                src={profileForm.photoPreview}
                                alt="preview"
                                className="w-24 h-24 object-cover rounded-full border-4 border-gray-100 shadow-md"
                              />
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="mt-6 flex gap-3">
                        <button
                          disabled={savingProfile}
                          onClick={handleSaveProfile}
                          className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg font-medium hover:shadow-lg transform hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {savingProfile ? 'Saving...' : 'Save Profile'}
                        </button>
                        <button
                          onClick={() => copyToClipboard(`${typeof window !== 'undefined' ? window.location.origin : ''}/register?ref=${user.referral_code || ''}`)}
                          className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                        >
                          Copy Referral Link
                        </button>
                      </div>
                    </div>

                    {/* Change Password */}
                    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                      <h3 className="text-lg font-bold text-gray-800 mb-4">Change Password</h3>
                      <ChangePasswordForm />
                    </div>
                  </div>
                )}

                {/* My Courses Tab */}
                {activeTab === 'mycourses' && (
                  <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                    <div className="flex items-center gap-2 mb-6">
                      <FaBook className="text-blue-600 text-xl" />
                      <h2 className="text-2xl font-bold text-gray-800">My Courses</h2>
                    </div>
                    
                    {packages.length > 0 ? (
                      <>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {packages.map(p => (
                          <div key={p.id} className="group bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-xl transition-all transform hover:-translate-y-1">
                            {p.image && (
                              <div className="relative h-48 overflow-hidden">
                                <img
                                  src={p.image}
                                  alt={p.title}
                                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                              </div>
                            )}
                            <div className="p-4">
                              <h3 className="font-bold text-gray-800 text-lg mb-2">{p.title}</h3>
                              <p className="text-sm text-gray-600 mb-3">{p.subtitle}</p>
                              <button 
                                className="w-full px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg font-medium hover:shadow-md transition-all"
                                onClick={() => toggleCourses(p.id)}
                              >
                                Continue Learning
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="mt-6">
                        {selectedPackageId !== null && (
                          <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
                            <h3 className="text-xl font-semibold mb-4">
                              Courses for {packages.find(pkg => pkg.id === selectedPackageId)?.title}
                            </h3>
                            {loadingCourses ? (
                              <p>Loading courses...</p>
                            ) : courses.length === 0 ? (
                              <p>No courses available for this package.</p>
                            ) : (
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {courses.map(course => (
                                  <div key={course.id} className="border rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition duration-300">
                                    {course.image ? (
                                      <img src={course.image} alt={course.title} className="w-full h-40 object-cover" />
                                    ) : (
                                      <div className="w-full h-40 bg-gray-200 flex items-center justify-center text-gray-500">
                                        No Image
                                      </div>
                                    )}
                                    <div className="p-3">
                                      <h4 className="font-semibold mb-2 truncate">{course.title || 'Course'}</h4>
                                      <button
                                        className="w-full px-3 py-2 bg-gradient-to-r from-cyan-500 to-purple-600 text-white rounded hover:shadow-md transition"
                                        onClick={() => setPlayerVideoUrl(course.video)}
                                      >
                                        Play Now
                                      </button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                      </>
                    ) : (
                      <div className="text-center py-16">
                        <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                          <FaBook className="text-4xl text-gray-400" />
                        </div>
                        <p className="text-gray-500 text-lg">No courses available yet</p>
                        <p className="text-gray-400 text-sm mt-2">Start your learning journey by purchasing a package</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Affiliate Dashboard Tab */}
                {activeTab === 'affiliate' && (
                  <div className="space-y-6">
                    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                      <div className="flex items-center gap-2 mb-6">
                        <FaChartLine className="text-blue-600 text-xl" />
                        <h2 className="text-2xl font-bold text-gray-800">Affiliate Dashboard</h2>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div className="p-6 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 text-white">
                          <div className="text-sm opacity-90 mb-2">Total Earnings</div>
                          <div className="text-3xl font-bold">₹0</div>
                        </div>
                        <div className="p-6 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 text-white">
                          <div className="text-sm opacity-90 mb-2">Pending</div>
                          <div className="text-3xl font-bold">₹0</div>
                        </div>
                        <div className="p-6 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white">
                          <div className="text-sm opacity-90 mb-2">Withdrawn</div>
                          <div className="text-3xl font-bold">₹0</div>
                        </div>
                      </div>

                      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-6 border border-blue-100">
                        <div className="text-sm font-medium text-gray-700 mb-3">Your Referral Link</div>
                        <div className="flex gap-2">
                          <input
                            readOnly
                            value={`${typeof window !== 'undefined' ? window.location.origin : ''}/register?ref=${user.referral_code || ''}`}
                            className="flex-1 border border-gray-300 rounded-lg px-4 py-2.5 bg-white"
                          />
                          <button
                            onClick={() => copyToClipboard(`${typeof window !== 'undefined' ? window.location.origin : ''}/register?ref=${user.referral_code || ''}`)}
                            className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg font-medium hover:shadow-md transition-all flex items-center gap-2"
                          >
                            {copied ? <FaCheck /> : <FaCopy />}
                            {copied ? 'Copied!' : 'Copy'}
                          </button>
                        </div>
                      </div>

                      <div className="mt-6">
                        <h3 className="font-bold text-gray-800 mb-4">Recent Referrals</h3>
                        <div className="text-center py-12 bg-gray-50 rounded-xl">
                          <FaUsers className="text-4xl text-gray-300 mx-auto mb-3" />
                          <p className="text-gray-500">No referrals yet</p>
                          <p className="text-sm text-gray-400 mt-1">Share your link to start earning</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Withdrawals Tab */}
                {activeTab === 'withdraw' && (
                  <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                    <div className="flex items-center gap-2 mb-6">
                      <FaMoneyBillWave className="text-blue-600 text-xl" />
                      <h2 className="text-2xl font-bold text-gray-800">Withdrawals</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div className="p-6 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white">
                        <div className="text-sm opacity-90 mb-2">Available Balance</div>
                        <div className="text-3xl font-bold">
                          {loadingWallet ? '...' : `₹${Number(walletData.wallet.balance || 0).toLocaleString('en-IN')}`}
                        </div>
                      </div>
                      <div className="p-6 rounded-xl border-2 border-dashed border-gray-300 bg-gray-50">
                        <WithdrawForm balance={walletData.wallet.balance || 0} onNewRequest={() => {}} />
                      </div>
                    </div>

                    <div>
                      <h3 className="font-bold text-gray-800 mb-4">Withdrawal History</h3>
                      {loadingWithdrawals ? (
                        <div className="text-center py-12 bg-gray-50 rounded-xl">
                          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                          <p className="mt-4 text-gray-600">Loading withdrawal history...</p>
                        </div>
                      ) : withdrawalHistory.length > 0 ? (
                        <div className="space-y-4">
                          {withdrawalHistory.map((withdrawal) => (
                            <div key={withdrawal.id} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                                    <FaMoneyBillWave className="text-white text-sm" />
                                  </div>
                                  <div>
                                    <div className="font-semibold text-gray-800">₹{Number(withdrawal.amount || 0).toLocaleString('en-IN')}</div>
                                    <div className="text-sm text-gray-500">
                                      {new Date(withdrawal.created_at).toLocaleDateString('en-IN', {
                                        day: 'numeric',
                                        month: 'short',
                                        year: 'numeric'
                                      })} • {withdrawal.method}
                                    </div>
                                  </div>
                                </div>
                                <div className={`px-3 py-1 rounded-full text-xs font-medium ${
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
                        <div className="text-center py-12 bg-gray-50 rounded-xl">
                          <FaMoneyBillWave className="text-4xl text-gray-300 mx-auto mb-3" />
                          <p className="text-gray-500">No withdrawal history</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* My Team Tab */}
                {activeTab === 'team' && (
                  <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                    <div className="flex items-center gap-2 mb-6">
                      <FaUsers className="text-blue-600 text-xl" />
                      <h2 className="text-2xl font-bold text-gray-800">My Team</h2>
                    </div>
                    <div className="text-center py-16">
                      <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                        <FaUsers className="text-4xl text-gray-400" />
                      </div>
                      <p className="text-gray-500 text-lg">No team members yet</p>
                      <p className="text-gray-400 text-sm mt-2">Build your team by sharing your referral link</p>
                    </div>
                  </div>
                )}

                {/* Community Tab */}
                {activeTab === 'community' && (
                  <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                    <div className="flex items-center gap-2 mb-6">
                      <FaComments className="text-blue-600 text-xl" />
                      <h2 className="text-2xl font-bold text-gray-800">Community</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="p-6 border-2 border-gray-200 rounded-xl hover:border-blue-500 transition-colors">
                        <h3 className="font-bold text-gray-800 mb-4">Join Our Channels</h3>
                        <ul className="space-y-3">
                          {[
                            { name: 'WhatsApp Group', color: 'from-green-500 to-emerald-600' },
                            { name: 'Telegram Channel', color: 'from-blue-500 to-cyan-600' },
                            { name: 'Facebook Group', color: 'from-blue-600 to-indigo-600' },
                            { name: 'Instagram', color: 'from-pink-500 to-rose-600' }
                          ].map((channel, idx) => (
                            <li key={idx}>
                              <a
                                href="#"
                                className={`block px-4 py-3 rounded-lg bg-gradient-to-r ${channel.color} text-white font-medium hover:shadow-lg transition-all transform hover:scale-[1.02]`}
                              >
                                {channel.name} →
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border border-blue-100">
                        <h3 className="font-bold text-gray-800 mb-4">Share Your Referral</h3>
                        <div className="space-y-3">
                          <input
                            readOnly
                            value={`${typeof window !== 'undefined' ? window.location.origin : ''}/register?ref=${user.referral_code || ''}`}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 bg-white"
                          />
                          <button
                            onClick={() => copyToClipboard(`${typeof window !== 'undefined' ? window.location.origin : ''}/register?ref=${user.referral_code || ''}`)}
                            className="w-full px-4 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg font-medium hover:shadow-md transition-all flex items-center justify-center gap-2"
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

// Earning Card Component
function EarningCard({ title, amount, gradient, icon }) {
  return (
    <div className={`p-6 rounded-xl bg-gradient-to-br ${gradient} text-white shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all`}>
      <div className="flex items-start justify-between mb-3">
        <div className="text-sm opacity-90 font-medium">{title}</div>
        <div className="text-2xl opacity-80">{icon}</div>
      </div>
      <div className="text-2xl lg:text-3xl font-bold">
        ₹{Number(amount || 0).toLocaleString('en-IN')}
      </div>
      <div className="mt-3 text-xs opacity-90">View details →</div>
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
      // Get user from localStorage to get userId
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
    <div className="space-y-4">
      {msg && (
        <div className={`p-3 rounded-lg text-sm ${
          msg.includes('success') 
            ? 'bg-green-50 text-green-700 border border-green-200' 
            : 'bg-red-50 text-red-700 border border-red-200'
        }`}>
          {msg}
        </div>
      )}
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
        <input
          type="password"
          value={oldPass}
          onChange={e => setOld(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          placeholder="Enter current password"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
        <input
          type="password"
          value={newPass}
          onChange={e => setNew(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          placeholder="Enter new password"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
        <input
          type="password"
          value={confirm}
          onChange={e => setConfirm(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          placeholder="Confirm new password"
        />
      </div>

      <button
        disabled={saving}
        onClick={handle}
        className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg font-medium hover:shadow-lg transform hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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
      // Get user from localStorage to get userId
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
      <h4 className="font-semibold text-gray-800">Request Withdrawal</h4>

      {msg && (
        <div className={`p-3 rounded-lg text-sm ${
          msg.includes('success')
            ? 'bg-green-50 text-green-700 border border-green-200'
            : 'bg-red-50 text-red-700 border border-red-200'
        }`}>
          {msg}
        </div>
      )}

      <div className="text-sm text-gray-600">
        Available: <span className="font-bold text-gray-800">₹{balance}</span>
      </div>

      <input
        type="number"
        value={amount}
        onChange={e => setAmount(e.target.value)}
        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
        placeholder="Enter amount"
      />

      <select
        value={method}
        onChange={e => setMethod(e.target.value)}
        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
      >
        <option value="UPI">UPI</option>
        <option value="Bank">Bank Transfer</option>
      </select>

      {method === 'UPI' && (
        <input
          type="text"
          value={upiId}
          onChange={e => setUpiId(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          placeholder="Enter UPI ID"
        />
      )}

      {method === 'Bank' && (
        <>
          <input
            type="text"
            value={accountNumber}
            onChange={e => setAccountNumber(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            placeholder="Enter bank account number"
          />

          <input
            type="text"
            value={confirmAccountNumber}
            onChange={e => setConfirmAccountNumber(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            placeholder="Confirm bank account number"
          />

          <input
            type="text"
            value={bankName}
            onChange={e => setBankName(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            placeholder="Enter bank name"
          />

          <input
            type="text"
            value={ifscCode}
            onChange={e => setIfscCode(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            placeholder="Enter IFSC code"
          />
        </>
      )}

      <button
        disabled={sending}
        onClick={submit}
        className="w-full px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg font-medium hover:shadow-lg transform hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {sending ? 'Submitting...' : 'Request Withdrawal'}
      </button>
    </div>
  );
}
