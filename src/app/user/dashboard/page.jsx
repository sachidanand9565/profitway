'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../../component/include/header';
import Footer from '../../component/include/footer';
import { FaPlay, FaLock, FaCheck } from 'react-icons/fa';

export default function UserDashboard() {
  const [user, setUser] = useState(null);
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
    } catch (err) {
      router.push('/login');
    }
  };

  const fetchUserPackages = async (approvedPackageIds) => {
    try {
      const response = await fetch('/api/packages');
      const allPackages = await response.json();

      // Filter packages that user has access to
      const userPackages = allPackages.filter(pkg =>
        approvedPackageIds.includes(pkg.slug) || approvedPackageIds.includes(pkg.id.toString())
      );

      setPackages(userPackages);
    } catch (error) {
      console.error('Failed to fetch packages:', error);
    } finally {
      setLoading(false);
    }
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Username</label>
                <p className="mt-1 text-sm text-gray-900">{user.username}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <p className="mt-1 text-sm text-gray-900">{user.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Approved Packages</label>
                <p className="mt-1 text-sm text-gray-900">{user.approved_packages.length}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Member Since</label>
                <p className="mt-1 text-sm text-gray-900">{new Date(user.created_at).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
