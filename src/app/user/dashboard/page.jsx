'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../../component/include/header';
import Footer from '../../component/include/footer';
import { FaPlay, FaLock, FaCheck } from 'react-icons/fa';

export default function UserDashboard() {
  const [user, setUser] = useState(null);
  const [profileForm, setProfileForm] = useState({
    name: '',
    email: '',
    phone: '',
    state: '',
    gender: '',
    photoFile: null,
    photoPreview: null,
  });
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileMessage, setProfileMessage] = useState('');
  const [passwordForm, setPasswordForm] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
  const [changingPassword, setChangingPassword] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState('');
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = () => {
    try {
      const userData = localStorage.getItem('user');
      if (!userData) {
        router.push('/login');
        return;
      }
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      fetchUserPackages(parsedUser.approved_packages);
      // populate profile form
      setProfileForm((f) => ({
        ...f,
        name: parsedUser.username || '',
        email: parsedUser.email || '',
        phone: parsedUser.phone || '',
        state: parsedUser.state || '',
        gender: parsedUser.gender || '',
        photoPreview: parsedUser.photo || null,
      }));
    } catch (err) {
      router.push('/login');
    }
  };

  const fetchUserPackages = async (approvedPackageIds) => {
    try {
      const response = await fetch('/api/packages');
      const allPackages = await response.json();

      // Filter packages that user has access to (approvedPackageIds are numeric IDs)
      const userPackages = allPackages.filter(pkg =>
        approvedPackageIds.includes(pkg.id)
      );

      setPackages(userPackages);
    } catch (error) {
      console.error('Failed to fetch packages:', error);
    } finally {
      setLoading(false);
    }
  };

  // helper: convert file to base64
  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (err) => reject(err);
    });
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
        <Header />
        <main className="py-24">
          <div className="max-w-6xl mx-auto px-4 text-center">
            <div>Loading your dashboard...</div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      <Header />

      <main className="py-24">
        <div className="max-w-6xl mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user.username}!</h1>
                <p className="text-gray-600 mt-2">Access your approved packages and courses</p>
              </div>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
              >
                Logout
              </button>
            </div>
          </div>

          {/* Packages Grid */}
          {packages.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {packages.map((pkg) => (
                <div key={pkg.id} className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
                  {/* Package Image */}
                  {pkg.image && (
                    <div className="relative">
                      <img
                        src={pkg.image}
                        alt={pkg.title}
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs flex items-center">
                        <FaCheck className="w-3 h-3 mr-1" />
                        Approved
                      </div>
                    </div>
                  )}

                  {/* Package Content */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{pkg.title}</h3>
                    <p className="text-gray-600 text-sm mb-4">{pkg.subtitle}</p>

                    {/* Features */}
                    {pkg.features && Array.isArray(pkg.features) && pkg.features.length > 0 && (
                      <div className="mb-4">
                        <h4 className="font-semibold text-gray-900 mb-2">What's included:</h4>
                        <ul className="space-y-1">
                          {pkg.features.slice(0, 3).map((feature, index) => (
                            <li key={index} className="text-sm text-gray-600 flex items-center">
                              <FaCheck className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                              {feature}
                            </li>
                          ))}
                          {pkg.features.length > 3 && (
                            <li className="text-sm text-gray-500">+{pkg.features.length - 3} more features</li>
                          )}
                        </ul>
                      </div>
                    )}

                    {/* Access Button */}
                    <button className="w-full bg-gradient-to-r from-blue-500 to-cyan-600 text-white py-3 px-4 rounded-lg hover:from-blue-600 hover:to-cyan-700 transition-all flex items-center justify-center">
                      <FaPlay className="w-4 h-4 mr-2" />
                      Access Course
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-500 text-lg mb-4">No approved packages yet</div>
              <p className="text-gray-400">Your approved packages will appear here once an admin approves your purchase.</p>
            </div>
          )}

          {/* User Info */}
          <div className="mt-12 bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Account Information</h2>
            <div className="grid grid-cols-1 gap-6">
              {/* Sponsor Information (non-editable) */}
              <div className="bg-gray-50 p-4 rounded">
                <h3 className="font-semibold text-gray-800 mb-2">Sponsor Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm text-gray-600">Sponsor Name</label>
                    <p className="mt-1 text-sm text-gray-900">{user.sponsor?.name || '-'}</p>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600">Sponsor Email</label>
                    <p className="mt-1 text-sm text-gray-900">{user.sponsor?.email || '-'}</p>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600">Sponsor Phone</label>
                    <p className="mt-1 text-sm text-gray-900">{user.sponsor?.phone || '-'}</p>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">Sponsor details cannot be changed.</p>
              </div>

              {/* Personal Information (editable) */}
              <div>
                <h3 className="font-semibold text-gray-800 mb-3">Personal Information</h3>
                {profileMessage && <div className="mb-3 text-sm text-green-700">{profileMessage}</div>}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-700">Name</label>
                    <input value={profileForm.name} onChange={(e)=>setProfileForm(p=>({...p,name:e.target.value}))} className="mt-1 block w-full border rounded px-3 py-2" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700">Email</label>
                    <input value={profileForm.email} onChange={(e)=>setProfileForm(p=>({...p,email:e.target.value}))} className="mt-1 block w-full border rounded px-3 py-2" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700">Phone</label>
                    <input value={profileForm.phone} onChange={(e)=>setProfileForm(p=>({...p,phone:e.target.value}))} className="mt-1 block w-full border rounded px-3 py-2" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700">State</label>
                    <input value={profileForm.state} onChange={(e)=>setProfileForm(p=>({...p,state:e.target.value}))} className="mt-1 block w-full border rounded px-3 py-2" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700">Gender</label>
                    <select value={profileForm.gender} onChange={(e)=>setProfileForm(p=>({...p,gender:e.target.value}))} className="mt-1 block w-full border rounded px-3 py-2">
                      <option value="">Prefer not to say</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700">Profile Photo</label>
                    <input type="file" accept="image/*" onChange={(e)=>{
                      const file = e.target.files?.[0] || null;
                      if (file) {
                        const url = URL.createObjectURL(file);
                        setProfileForm(p=>({...p,photoFile:file,photoPreview:url}));
                      } else {
                        setProfileForm(p=>({...p,photoFile:null}));
                      }
                    }} className="mt-1 block w-full" />
                    {profileForm.photoPreview && (
                      <img src={profileForm.photoPreview} alt="preview" className="mt-2 w-28 h-28 object-cover rounded-full border" />
                    )}
                  </div>
                </div>

                <div className="mt-4">
                  <button disabled={savingProfile} onClick={async()=>{
                    // save profile
                    setSavingProfile(true); setProfileMessage('');
                    try {
                      // convert photo to base64 if changed
                      let photoBase64 = null;
                      if (profileForm.photoFile) {
                        photoBase64 = await fileToBase64(profileForm.photoFile);
                      }
                      const payload = {
                        name: profileForm.name,
                        email: profileForm.email,
                        phone: profileForm.phone,
                        state: profileForm.state,
                        gender: profileForm.gender,
                        photo: photoBase64,
                      };
                      const res = await fetch('/api/users/update-profile', {
                        method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(payload)
                      });
                      if (res.ok) {
                        const updated = await res.json();
                        setProfileMessage('Profile updated successfully');
                        // update localStorage user
                        const newUser = {...user, username: payload.name, email: payload.email, phone: payload.phone, state: payload.state, gender: payload.gender, photo: updated.photo || profileForm.photoPreview};
                        setUser(newUser);
                        try { localStorage.setItem('user', JSON.stringify(newUser)); } catch(e){}
                      } else {
                        const err = await res.json().catch(()=>({error:'Failed'}));
                        setProfileMessage(err.error || 'Failed to update profile');
                      }
                    } catch (e) {
                      console.error(e); setProfileMessage('Failed to update profile');
                    } finally { setSavingProfile(false); }
                  }} className="px-4 py-2 bg-blue-600 text-white rounded">{savingProfile? 'Saving...' : 'Save Profile'}</button>
                </div>
              </div>

              {/* Change Password */}
              <div>
                <h3 className="font-semibold text-gray-800 mb-3">Change Password</h3>
                {passwordMessage && <div className="mb-3 text-sm text-green-700">{passwordMessage}</div>}
                <div className="grid grid-cols-1 gap-3">
                  <div>
                    <label className="block text-sm text-gray-700">Enter old password</label>
                    <input type="password" value={passwordForm.oldPassword} onChange={(e)=>setPasswordForm(p=>({...p,oldPassword:e.target.value}))} className="mt-1 block w-full border rounded px-3 py-2" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700">New password</label>
                    <input type="password" value={passwordForm.newPassword} onChange={(e)=>setPasswordForm(p=>({...p,newPassword:e.target.value}))} className="mt-1 block w-full border rounded px-3 py-2" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700">Enter new password</label>
                    <input type="password" value={passwordForm.confirmPassword} onChange={(e)=>setPasswordForm(p=>({...p,confirmPassword:e.target.value}))} className="mt-1 block w-full border rounded px-3 py-2" />
                  </div>
                  <div>
                    <button disabled={changingPassword} onClick={async()=>{
                      setChangingPassword(true); setPasswordMessage('');
                      try {
                        if (!passwordForm.oldPassword || !passwordForm.newPassword) { setPasswordMessage('Please fill passwords'); setChangingPassword(false); return; }
                        if (passwordForm.newPassword !== passwordForm.confirmPassword) { setPasswordMessage('New passwords do not match'); setChangingPassword(false); return; }
                        const res = await fetch('/api/users/change-password', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ oldPassword: passwordForm.oldPassword, newPassword: passwordForm.newPassword }) });
                        if (res.ok) { setPasswordMessage('Password changed successfully'); setPasswordForm({oldPassword:'',newPassword:'',confirmPassword:''}); }
                        else { const err = await res.json().catch(()=>({error:'Failed'})); setPasswordMessage(err.error || 'Failed to change password'); }
                      } catch (e) { console.error(e); setPasswordMessage('Failed to change password'); }
                      finally { setChangingPassword(false); }
                    }} className="px-4 py-2 bg-green-600 text-white rounded">{changingPassword? 'Saving...' : 'Change Password'}</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
