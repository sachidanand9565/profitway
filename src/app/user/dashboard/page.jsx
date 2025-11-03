/*
  Clean user dashboard component
  - client component
  - loads user from localStorage and redirects to /login if not present
  - shows a left menu with tabs and simple content for each tab
  - minimal profile form and packages list (frontend-only)
*/
'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../../component/include/header';
import Footer from '../../component/include/footer';
import { FaUser, FaBook, FaChartLine, FaMoneyBillWave, FaUsers, FaComments } from 'react-icons/fa';

export default function UserDashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');
  const [packages, setPackages] = useState([]);

  // profile form simple state
  const [profileForm, setProfileForm] = useState({ name: '', phone: '', state: '', gender: '', photoPreview: null, photoFile: null });
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileMessage, setProfileMessage] = useState('');

  useEffect(() => {
    try {
      const raw = localStorage.getItem('user');
      if (!raw) {
        router.push('/login');
        return;
      }
      const parsed = JSON.parse(raw);
      setUser(parsed);
      setProfileForm(f => ({ ...f, name: parsed.username || '', phone: parsed.phone || '', state: parsed.state || '', gender: parsed.gender || '', photoPreview: parsed.photo || null }));
      // fetch packages list (best-effort)
      fetch('/api/packages').then(r => r.json()).then(list => {
        const ups = list.filter(p => (parsed.approved_packages || []).includes(p.id));
        setPackages(ups);
      }).catch(() => {})
      .finally(() => setLoading(false));
    } catch (e) {
      router.push('/login');
    }
  }, [router]);

  const handleLogout = () => { localStorage.removeItem('user'); router.push('/'); };

  const fileToBase64 = (file) => new Promise((res, rej) => { const r = new FileReader(); r.onload = () => res(r.result); r.onerror = rej; r.readAsDataURL(file); });

  const handleSaveProfile = async () => {
    setSavingProfile(true); setProfileMessage('');
    try {
      let photo = null;
      if (profileForm.photoFile) photo = await fileToBase64(profileForm.photoFile);
      const payload = { name: profileForm.name, phone: profileForm.phone, state: profileForm.state, gender: profileForm.gender, photo };
      // POST to server endpoint (server must exist)
      const res = await fetch('/api/users/update-profile', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      if (res.ok) {
        const updated = await res.json();
        const newUser = { ...user, username: payload.name, phone: payload.phone, state: payload.state, gender: payload.gender, photo: updated.photo || profileForm.photoPreview };
        setUser(newUser);
        try { localStorage.setItem('user', JSON.stringify(newUser)); } catch (e) {}
        setProfileMessage('Profile saved');
      } else {
        setProfileMessage('Failed to save profile');
      }
    } catch (e) { setProfileMessage('Failed to save profile'); }
    finally { setSavingProfile(false); }
  };

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      <Header />
      <main className="py-24"><div className="max-w-4xl mx-auto px-4 text-center">Loading dashboard...</div></main>
      <Footer />
    </div>
  );

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      <Header />
      <main className="py-24">
        <div className="max-w-6xl mx-auto px-4">
          <div className="mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user.username}</h1>
              <p className="text-gray-600 mt-2">Your account dashboard</p>
            </div>
            <div>
              <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded">Logout</button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <aside className="lg:col-span-1 bg-white rounded p-4 border">
              <nav className="space-y-2">
                {[{k:'profile',l:'My Profile',i:<FaUser/>},{k:'mycourses',l:'My Courses',i:<FaBook/>},{k:'affiliate',l:'Affiliate Dashboard',i:<FaChartLine/>},{k:'withdraw',l:'Withdrawals',i:<FaMoneyBillWave/>},{k:'team',l:'My Team',i:<FaUsers/>},{k:'community',l:'Community',i:<FaComments/>}].map(item=> (
                  <button key={item.k} onClick={()=>setActiveTab(item.k)} className={`w-full text-left flex items-center gap-3 p-2 rounded hover:bg-blue-50 ${activeTab===item.k?'bg-blue-50 font-semibold':''}`}>
                    <span className="text-blue-600">{item.i}</span>
                    <span className="text-sm">{item.l}</span>
                  </button>
                ))}
              </nav>
            </aside>

            <section className="lg:col-span-3">
                {activeTab === 'profile' && (
                  <div className="bg-white rounded p-6">
                    <h2 className="text-xl font-bold mb-4">Profile</h2>
                    {/* Sponsor info (non-editable) */}
                    <div className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-4 bg-gray-50 rounded border">
                        <div className="text-sm text-gray-600">Sponsor</div>
                        <div className="font-semibold mt-1">{user.sponsor || user.upline || user.referred_by || '—'}</div>
                      </div>
                      <div className="p-4 bg-gray-50 rounded border">
                        <div className="text-sm text-gray-600">Referral Code</div>
                        <div className="font-semibold mt-1">{user.referral_code || '-'}</div>
                      </div>
                      <div className="p-4 bg-gray-50 rounded border">
                        <div className="text-sm text-gray-600">Account Type</div>
                        <div className="font-semibold mt-1">{user.type || 'Student'}</div>
                      </div>
                    </div>

                    {profileMessage && <div className="mb-3 text-sm text-green-700">{profileMessage}</div>}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-gray-700">Name</label>
                        <input value={profileForm.name} onChange={e=>setProfileForm(p=>({...p,name:e.target.value}))} className="mt-1 w-full border rounded px-3 py-2" />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-700">Phone</label>
                        <input value={profileForm.phone} onChange={e=>setProfileForm(p=>({...p,phone:e.target.value}))} className="mt-1 w-full border rounded px-3 py-2" />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-700">State</label>
                        <input value={profileForm.state} onChange={e=>setProfileForm(p=>({...p,state:e.target.value}))} className="mt-1 w-full border rounded px-3 py-2" />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-700">Gender</label>
                        <select value={profileForm.gender} onChange={e=>setProfileForm(p=>({...p,gender:e.target.value}))} className="mt-1 w-full border rounded px-3 py-2">
                          <option value="">Prefer not to say</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm text-gray-700">Profile photo</label>
                        <input type="file" accept="image/*" onChange={e=>{ const f = e.target.files?.[0] || null; setProfileForm(p=>({...p,photoFile:f,photoPreview: f ? URL.createObjectURL(f) : p.photoPreview })); }} className="mt-1 w-full" />
                        {profileForm.photoPreview && <img src={profileForm.photoPreview} alt="preview" className="mt-2 w-24 h-24 object-cover rounded-full" />}
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2 items-center">
                      <button disabled={savingProfile} onClick={handleSaveProfile} className="px-4 py-2 bg-blue-600 text-white rounded">{savingProfile? 'Saving...':'Save Profile'}</button>
                      <button onClick={()=>{ navigator.clipboard?.writeText(user.referral_code||'') }} className="px-3 py-2 bg-gray-100 rounded">Copy Referral</button>
                    </div>

                    {/* Change password panel */}
                    <div className="mt-8 bg-gray-50 p-4 rounded border">
                      <h3 className="font-semibold mb-3">Change Password</h3>
                      <ChangePasswordForm />
                    </div>
                  </div>
                )}

              {activeTab === 'mycourses' && (
                <div className="bg-white rounded p-6">
                  <h2 className="text-xl font-bold mb-4">My Courses</h2>
                  {packages.length>0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {packages.map(p=> (
                        <div key={p.id} className="border rounded overflow-hidden bg-white">
                          {p.image && <img src={p.image} alt={p.title} className="w-full h-40 object-cover" />}
                          <div className="p-4"><h3 className="font-semibold">{p.title}</h3><p className="text-sm text-gray-600">{p.subtitle}</p></div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">No courses available</div>
                  )}
                </div>
              )}

              {activeTab === 'affiliate' && (
                <div className="bg-white rounded p-6">
                  <h2 className="text-xl font-bold mb-4">Affiliate Dashboard</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="p-4 rounded border bg-gray-50">
                      <div className="text-sm text-gray-600">Total Earnings</div>
                      <div className="text-2xl font-bold">₹0</div>
                    </div>
                    <div className="p-4 rounded border bg-gray-50">
                      <div className="text-sm text-gray-600">Pending</div>
                      <div className="text-2xl font-bold">₹0</div>
                    </div>
                    <div className="p-4 rounded border bg-gray-50">
                      <div className="text-sm text-gray-600">Withdrawn</div>
                      <div className="text-2xl font-bold">₹0</div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="text-sm text-gray-600">Your referral link</div>
                    <div className="mt-2 flex gap-2 items-center">
                      <input readOnly value={`${typeof window !== 'undefined' ? window.location.origin : ''}/register?ref=${user.referral_code||''}`} className="flex-1 border rounded px-3 py-2" />
                      <button onClick={()=>navigator.clipboard?.writeText(`${typeof window !== 'undefined' ? window.location.origin : ''}/register?ref=${user.referral_code||''}`)} className="px-3 py-2 bg-blue-600 text-white rounded">Copy</button>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Recent referrals</h3>
                    <div className="text-sm text-gray-500">No referrals yet</div>
                  </div>
                </div>
              )}

              {activeTab === 'withdraw' && (
                <div className="bg-white rounded p-6">
                  <h2 className="text-xl font-bold mb-4">Withdrawals</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 border rounded bg-gray-50">
                      <div className="text-sm text-gray-600">Available Balance</div>
                      <div className="text-2xl font-bold">₹0</div>
                    </div>
                    <div className="p-4 border rounded">
                      <WithdrawForm balance={0} onNewRequest={()=>{}} />
                    </div>
                  </div>

                  <div className="mt-6">
                    <h3 className="font-semibold mb-3">Withdrawal history</h3>
                    <div className="text-sm text-gray-500">No withdrawal history</div>
                  </div>
                </div>
              )}

              {activeTab === 'team' && (
                <div className="bg-white rounded p-6">
                  <h2 className="text-xl font-bold mb-4">My Team</h2>
                  <div className="text-sm text-gray-500">No team members yet</div>
                </div>
              )}

              {activeTab === 'community' && (
                <div className="bg-white rounded p-6">
                  <h2 className="text-xl font-bold mb-4">Community</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 border rounded">
                      <h3 className="font-semibold">Join our channels</h3>
                      <ul className="mt-2 space-y-2 text-sm">
                        <li><a className="text-blue-600" href="#">WhatsApp Group</a></li>
                        <li><a className="text-blue-600" href="#">Telegram Channel</a></li>
                        <li><a className="text-blue-600" href="#">Facebook Group</a></li>
                        <li><a className="text-blue-600" href="#">Instagram</a></li>
                      </ul>
                    </div>
                    <div className="p-4 border rounded">
                      <h3 className="font-semibold">Share your referral</h3>
                      <div className="mt-2 flex gap-2">
                        <input readOnly value={`${typeof window !== 'undefined' ? window.location.origin : ''}/register?ref=${user.referral_code||''}`} className="flex-1 border rounded px-3 py-2" />
                        <button onClick={()=>navigator.clipboard?.writeText(`${typeof window !== 'undefined' ? window.location.origin : ''}/register?ref=${user.referral_code||''}`)} className="px-3 py-2 bg-blue-600 text-white rounded">Copy</button>
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
  );
}

// Small nested components used by dashboard
function ChangePasswordForm(){
  const [oldPass,setOld]=useState('');
  const [newPass,setNew]=useState('');
  const [confirm,setConfirm]=useState('');
  const [msg,setMsg]=useState('');
  const [saving,setSaving]=useState(false);
  const handle = async ()=>{
    setMsg('');
    if(!oldPass||!newPass) return setMsg('Please fill both fields');
    if(newPass!==confirm) return setMsg('Passwords do not match');
    setSaving(true);
    try{
      const res = await fetch('/api/users/change-password',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({oldPassword:oldPass,newPassword:newPass})});
      if(res.ok){ setMsg('Password changed'); setOld(''); setNew(''); setConfirm(''); }
      else setMsg('Failed to change password');
    }catch(e){ setMsg('Failed to change password'); }
    finally{ setSaving(false); }
  };
  return (
    <div className="space-y-2">
      {msg && <div className="text-sm text-gray-700">{msg}</div>}
      <input type="password" value={oldPass} onChange={e=>setOld(e.target.value)} placeholder="Current password" className="w-full border rounded px-3 py-2" />
      <input type="password" value={newPass} onChange={e=>setNew(e.target.value)} placeholder="New password" className="w-full border rounded px-3 py-2" />
      <input type="password" value={confirm} onChange={e=>setConfirm(e.target.value)} placeholder="Confirm new password" className="w-full border rounded px-3 py-2" />
      <div><button disabled={saving} onClick={handle} className="px-4 py-2 bg-blue-600 text-white rounded">{saving? 'Saving...':'Change password'}</button></div>
    </div>
  );
}

function WithdrawForm({balance=0,onNewRequest=()=>{}}){
  const [amount,setAmount]=useState('');
  const [method,setMethod]=useState('UPI');
  const [dest,setDest]=useState('');
  const [msg,setMsg]=useState('');
  const [sending,setSending]=useState(false);
  const submit = async ()=>{
    setMsg('');
    const a = Number(amount||0);
    if(!a || a<=0) return setMsg('Enter a valid amount');
    if(a>balance) return setMsg('Amount exceeds balance');
    setSending(true);
    try{
      const res = await fetch('/api/users/withdraw-request',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({amount:a,method,destination:dest})});
      if(res.ok){ const r = await res.json(); onNewRequest(r); setMsg('Request submitted'); setAmount(''); setDest(''); }
      else setMsg('Failed to submit');
    }catch(e){ setMsg('Failed to submit'); }
    finally{ setSending(false); }
  };
  return (
    <div className="space-y-2">
      {msg && <div className="text-sm text-gray-700">{msg}</div>}
      <div className="text-sm text-gray-600">Available: ₹{balance}</div>
      <input value={amount} onChange={e=>setAmount(e.target.value)} placeholder="Amount" className="w-full border rounded px-3 py-2" />
      <select value={method} onChange={e=>setMethod(e.target.value)} className="w-full border rounded px-3 py-2">
        <option value="UPI">UPI</option>
        <option value="Bank">Bank transfer</option>
      </select>
      <input value={dest} onChange={e=>setDest(e.target.value)} placeholder={method==='UPI'?'Enter UPI id':'Enter account details'} className="w-full border rounded px-3 py-2" />
      <div><button disabled={sending} onClick={submit} className="px-4 py-2 bg-green-600 text-white rounded">{sending? 'Submitting...':'Request Withdraw'}</button></div>
    </div>
  );
}
