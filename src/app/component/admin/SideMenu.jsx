'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaTachometerAlt, FaBox, FaUsers, FaCog, FaSignOutAlt, FaTimes, FaShoppingCart, FaPlay, FaMoneyBillWave } from 'react-icons/fa';

export default function SideMenu({ onClose }) {
  const pathname = usePathname();

  const menuItems = [
    {
      name: 'Dashboard',
      href: '/admin',
      icon: FaTachometerAlt,
    },
    {
      name: 'Packages',
      href: '/admin/packages',
      icon: FaBox,
    },
    {
      name: 'Videos',
      href: '/admin/videos',
      icon: FaPlay,
    },
    {
      name: 'Purchases',
      href: '/admin/purchases',
      icon: FaShoppingCart,
    },
    {
      name: 'Withdrawals',
      href: '/admin/withdrawals',
      icon: FaMoneyBillWave,
    },
    {
      name: 'Users',
      href: '/admin/users',
      icon: FaUsers,
    },
    {
      name: 'Settings',
      href: '/admin/settings',
      icon: FaCog,
    },
  ];

  return (
    <div className="bg-gray-900 text-white w-64 min-h-screen p-4">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-cyan-400">Admin Panel</h2>
      </div>

      <nav className="space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="absolute bottom-4 left-4 right-4">
        <button className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-colors w-full">
          <FaSignOutAlt className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}
