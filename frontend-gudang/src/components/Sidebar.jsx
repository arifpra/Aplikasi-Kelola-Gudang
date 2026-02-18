import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  ShoppingCart, 
  Wallet, 
  Package, 
  Settings 
} from 'lucide-react';

const Sidebar = ({ isOpen, activePage, setActivePage }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { id: 'mitra', label: 'Mitra', icon: <Users size={20} /> },
    { id: 'penjualan', label: 'Penjualan', icon: <FileText size={20} /> },
    { id: 'pembelian', label: 'Pembelian', icon: <ShoppingCart size={20} /> },
    { id: 'keuangan', label: 'Keuangan', icon: <Wallet size={20} /> },
    { type: 'divider' },
    { id: 'inventory', label: 'Produk & Stok', icon: <Package size={20} /> },
    { id: 'settings', label: 'Pengaturan', icon: <Settings size={20} /> },
  ];

  if (!isOpen) return null;

  return (
    <aside className="w-64 bg-[#1e293b] text-white flex flex-col shadow-xl transition-all duration-300">
      <div className="h-16 flex items-center px-6 border-b border-slate-700 bg-[#0f172a]">
        <div className="bg-sky-500 p-1.5 rounded-lg mr-3">
          <Package className="text-white" size={20} />
        </div>
        <span className="text-xl font-bold tracking-tight">Gudang<span className="text-sky-400">ERP</span></span>
      </div>

      <div className="p-4 border-b border-slate-700 bg-[#1e293b]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-slate-500 flex items-center justify-center text-xs font-bold">AD</div>
          <div className="overflow-hidden">
            <p className="text-sm font-semibold truncate">Alfian Dimas</p>
            <p className="text-[10px] text-green-400">Verifikasi Sekarang</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1">
          {menuItems.map((item, idx) => {
            if (item.type === 'divider') return <hr key={idx} className="my-4 border-slate-700" />;
            
            const isActive = activePage === item.id;
            return (
              <li key={item.id} className="px-3">
                <button
                  onClick={() => setActivePage(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all text-sm font-medium ${
                    isActive 
                    ? 'bg-sky-600 text-white shadow-lg shadow-sky-900/50' 
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {item.icon}
                    <span>{item.label}</span>
                  </div>
                  {isActive && <div className="w-2 h-2 rounded-full bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.8)]"></div>}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 text-xs text-slate-500 text-center border-t border-slate-700">
        v1.2.0 &copy; 2026 GudangERP
      </div>
    </aside>
  );
};

export default Sidebar;