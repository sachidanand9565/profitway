/*
  Redesigned User Dashboard - Profitway Theme
  - Modern blue gradient design matching Profitway brand
  - Enhanced visual hierarchy with professional cards
  - Improved mobile responsiveness
  - Client component with localStorage authentication
  - Wallet and Commission Display Integration
*/
'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../../component/include/header';
import Footer from '../../component/include/footer';
import VideoPlayerModal from '../../component/VideoPlayerModal';
import { FaUser, FaBook, FaChartLine, FaMoneyBillWave, FaUsers, FaComments, FaCopy, FaEdit, FaCheck, FaTrophy, FaGraduationCap, FaRocket, FaWallet, FaCoins, FaHandHoldingUsd } from 'react-icons/fa';

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

  // profile form state
  const [profileForm, setProfileForm] = useState({
    name: '',
    phone: '',
    state: '',
    gender: '',
    photoPreview: null,
    photoFile: null
  });
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileMessage, setProfileMessage] = useState('');
  const [copied, setCopied] = useState(false);

  const closeVideoPlayer = () => {
    setPlayerVideoUrl(null);
  };

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
        gender: parsed.gender || '',
        photoPreview: parsed.photo || null
      }));

      // Load wallet data
      loadWalletData(parsed.id);

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
    } catch (e) {
      router.push('/login');
    }
  }, [router]);

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
        name: profileForm.name,
        phone: profileForm.phone,
        state: profileForm.state,
        gender: profileForm.gender,
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
          gender: payload.gender,
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
