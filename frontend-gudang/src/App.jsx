import React, { useState } from 'react';
import { HelpCircle } from 'lucide-react';

// Import komponen yang sudah kamu pisah
// Pastikan file-file ini ada di folder components dan pages
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import DashboardView from './pages/DashboardView';
import InventoryView from './pages/InventoryView';
import useProducts from './features/products/useProducts';

export default function App() {
  // State untuk navigasi dan data
  const [activePage, setActivePage] = useState('dashboard');
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const { products, loading, error, refreshProducts } = useProducts();

  return (
    <div className="flex h-screen bg-[#F8FAFC] font-sans text-slate-800 overflow-hidden">
      {/* 1. SIDEBAR (Kiri) */}
      <Sidebar 
        isOpen={isSidebarOpen} 
        activePage={activePage} 
        setActivePage={setActivePage} 
      />
      
      {/* 2. WRAPPER KONTEN (Kanan) */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header di bagian atas */}
        <Header toggleSidebar={() => setSidebarOpen(!isSidebarOpen)} />
        
        {/* Area Isi Halaman yang berubah-ubah */}
        <main className="flex-1 overflow-y-auto p-6 md:p-10">
          {loading && (
            <div className="mb-4 rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-500">
              Memuat data produk...
            </div>
          )}
          {error && (
            <div className="mb-4 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600">
              {error}
            </div>
          )}

          {activePage === 'dashboard' && (
            <DashboardView 
              products={products}
            />
          )}
          
          {activePage === 'inventory' && (
            <InventoryView 
              products={products} 
              refreshData={refreshProducts} 
            />
          )}
          
          {/* Tampilan jika menu belum dibuat */}
          {activePage !== 'dashboard' && activePage !== 'inventory' && (
            <div className="py-40 text-center text-slate-300 font-black uppercase tracking-widest text-xs italic">
               Halaman Sedang Dikembangkan
            </div>
          )}
        </main>
      </div>

      {/* Tombol Bantuan Mengambang */}
      <button className="fixed bottom-10 right-10 bg-blue-900 text-white px-8 py-4 rounded-[2rem] shadow-2xl flex items-center gap-3 hover:bg-blue-800 transition-all font-black text-xs uppercase tracking-widest">
        <HelpCircle size={20} className="text-blue-400" /> Bantuan
      </button>
    </div>
  );
}
