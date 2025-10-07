import SideMenu from '../component/admin/SideMenu';

export default function AdminLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <SideMenu />
      <div className="flex-1">
        {children}
      </div>
    </div>
  );
}
