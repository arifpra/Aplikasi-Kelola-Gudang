import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { HelpCircle } from 'lucide-react';

// Import komponen yang sudah kamu pisah
// Pastikan file-file ini ada di folder components dan pages
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import DashboardView from './pages/DashboardView';
import InventoryView from './pages/InventoryView';

const API_URL = 'http://localhost:3000';

export default function App() {
  // State untuk navigasi dan data
  const [activePage, setActivePage] = useState('dashboard');
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [products, setProducts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fungsi untuk mengambil data dari Backend saat aplikasi dibuka
  const fetchData = async () => {
    try {
      setLoading(true);
      const [resProd, resTrans] = await Promise.all([
        axios.get(`${API_URL}/products`),
        axios.get(`${API_URL}/transactions`)
      ]);
      setProducts(resProd.data);
      setTransactions(resTrans.data);
    } catch (error) {
      console.error("Gagal ambil data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

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
          {activePage === 'dashboard' && (
            <DashboardView 
              products={products} 
              transactions={transactions} 
              loading={loading}
            />
          )}
          
          {activePage === 'inventory' && (
            <InventoryView 
              products={products} 
              refreshData={fetchData} 
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