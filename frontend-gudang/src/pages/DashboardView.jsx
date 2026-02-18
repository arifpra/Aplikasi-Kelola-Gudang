import React from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
// Kita panggil kartu yang sudah kita buat tadi
import StatCard from '../components/StatCard.jsx';

const DashboardView = ({ products, transactions, loading }) => {
  const chartData = [
    { name: 'Sen', masuk: 40, keluar: 24 },
    { name: 'Sel', masuk: 30, keluar: 13 },
    { name: 'Rab', masuk: 20, keluar: 58 },
    { name: 'Kam', masuk: 27, keluar: 39 },
    { name: 'Jum', masuk: 18, keluar: 48 },
    { name: 'Sab', masuk: 23, keluar: 38 },
    { name: 'Min', masuk: 34, keluar: 43 },
  ];

  const totalStok = products.reduce((acc, curr) => acc + curr.stock, 0);
  const totalItem = products.length;
  const stokKritis = products.filter(p => p.stock < 10).length;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Varian Produk" value={totalItem} subtitle="Item Aktif" gradient="from-sky-500 to-blue-600" />
        <StatCard title="Total Stok Fisik" value={totalStok} subtitle="Unit di Gudang" gradient="from-blue-500 to-indigo-600" />
        <StatCard title="Barang Masuk (Hari Ini)" value="120" subtitle="+12% dari kemarin" gradient="from-indigo-500 to-violet-600" />
        <StatCard title="Stok Perlu Re-stock" value={stokKritis} subtitle="Segera Pesan!" gradient="from-orange-400 to-rose-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-slate-800">Grafik Quantity Movement</h3>
            <select className="text-xs border border-slate-200 rounded-md px-2 py-1 bg-slate-50 text-slate-600">
              <option>Filter by Weekly</option>
              <option>Filter by Monthly</option>
            </select>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 12}} />
                <Tooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'}} />
                <Legend iconType="circle" />
                <Line type="monotone" dataKey="masuk" name="Barang Masuk" stroke="#0EA5E9" strokeWidth={3} dot={{r: 4, strokeWidth: 0}} activeDot={{r: 6}} />
                <Line type="monotone" dataKey="keluar" name="Barang Keluar" stroke="#6366F1" strokeWidth={3} dot={{r: 4, strokeWidth: 0}} activeDot={{r: 6}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
           <h3 className="font-bold text-slate-800 mb-6">Produk Terlaris</h3>
           <div className="space-y-4">
             {products.slice(0, 5).map((p, idx) => (
               <div key={p.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer group">
                 <div className="flex items-center gap-3">
                    <span className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${idx < 3 ? 'bg-yellow-100 text-yellow-700' : 'bg-slate-100 text-slate-500'}`}>
                      {idx + 1}
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-slate-700 group-hover:text-sky-600">{p.name}</p>
                      <p className="text-[10px] text-slate-400">{p.sku}</p>
                    </div>
                 </div>
                 <div className="text-xs font-bold text-slate-600">{p.stock + 50} Terjual</div>
               </div>
             ))}
             {products.length === 0 && <p className="text-sm text-slate-400 text-center py-10">Data kosong</p>}
           </div>
           <button className="w-full mt-6 py-2 text-sm font-semibold text-sky-600 border border-sky-100 rounded-lg hover:bg-sky-50 transition-colors">
             Lihat Semua Produk
           </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardView;