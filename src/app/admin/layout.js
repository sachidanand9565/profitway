'use client';
import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import SideMenu from '../component/admin/SideMenu';

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Check if admin is authenticated
    const checkAuth = () => {
      const token = localStorage.getItem('adminToken');

      if (!token && pathname !== '/admin/login') {
        router.push('/admin/login');
        return;
      }

      if (token && pathname === '/admin/login') {
        router.push('/admin');
        return;
      }

      setIsAuthenticated(!!token);
      setLoading(false);
    };

    checkAuth();
  }, [pathname, router]);

  // Don't render anything while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // If not authenticated and not on login page, don't render
  if (!isAuthenticated && pathname !== '/admin/login') {
    return null;
  }

  // If authenticated and on login page, redirect to dashboard
  if (isAuthenticated && pathname === '/admin/login') {
    return null;
  }

  // Don't show sidebar on login page
  const showSidebar = pathname !== '/admin/login';

  return (
    <div className={`min-h-screen bg-gray-100 ${showSidebar ? 'flex' : ''}`}>
      {/* Mobile sidebar overlay */}
      {sidebarOpen && showSidebar && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar - only show if not on login page */}
      {showSidebar && (
        <div className={`
          fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 transform transition-transform duration-300 ease-in-out
          lg:translate-x-0 lg:static lg:inset-0
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
          <SideMenu onClose={() => setSidebarOpen(false)} />
        </div>
      )}

      {/* Main content */}
      <div className={`flex-1 ${showSidebar ? 'lg:ml-0' : ''}`}>
        {/* Mobile header - only show if sidebar is shown */}
        {showSidebar && (
          <div className="lg:hidden bg-white shadow-sm border-b px-4 py-3 flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(true)}
              className="text-gray-600 hover:text-gray-900"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h1 className="text-lg font-semibold text-gray-900">Admin Panel</h1>
            <button
              onClick={() => {
                localStorage.removeItem('adminToken');
                router.push('/admin/login');
              }}
              className="text-gray-600 hover:text-gray-900 text-sm"
            >
              Logout
            </button>
          </div>
        )}

        {children}
      </div>
    </div>
  );
}
