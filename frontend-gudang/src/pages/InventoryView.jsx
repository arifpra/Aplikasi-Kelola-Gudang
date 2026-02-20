import React, { useState } from 'react';
import { Download, Plus, Search, Filter, Edit, Trash2, Package, X } from 'lucide-react';
import { createProduct, deleteProductById } from '../features/products/products.api';

const InventoryView = ({ products, refreshData }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({ sku: '', name: '', category: '', stock: 0 });

  const filtered = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await createProduct(formData);
      setModalOpen(false);
      setFormData({ sku: '', name: '', category: '', stock: 0 });
      await refreshData();
    } catch (err) {
      console.error("Gagal simpan produk:", err);
      alert(err.message || "Gagal simpan");
    }
  };

  const handleDelete = async (id) => {
    if(confirm('Hapus produk ini?')) {
      try {
        await deleteProductById(id);
        await refreshData();
      } catch (err) {
        console.error("Gagal hapus produk:", err);
        alert(err.message || 'Gagal hapus');
      }
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Daftar Produk</h2>
          <p className="text-sm text-slate-500">Kelola semua data stok barang Anda di sini.</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 text-sm font-medium">
            <Download size={16} /> Export
          </button>
          <button 
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 shadow-lg shadow-sky-200 text-sm font-medium"
          >
            <Plus size={16} /> Produk Baru
          </button>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 mb-6 flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Cari nama barang atau SKU..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-200 outline-none text-sm transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <Filter size={16} />
          <span>Filter Kategori: </span>
          <select className="bg-slate-50 border border-slate-200 rounded-md px-2 py-1 outline-none focus:ring-2 focus:ring-sky-200">
            <option>Semua Kategori</option>
            <option>Furniture</option>
            <option>Elektronik</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
              <th className="px-6 py-4">Info Produk</th>
              <th className="px-6 py-4">Kategori</th>
              <th className="px-6 py-4">Stok Fisik</th>
              <th className="px-6 py-4 text-center">Status</th>
              <th className="px-6 py-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {filtered.map((product) => (
              <tr key={product.id} className="hover:bg-sky-50/30 transition-colors group">
                <td className="px-6 py-4">
                  <div className="font-semibold text-slate-700">{product.name}</div>
                  <div className="text-xs text-slate-400 font-mono mt-0.5">{product.sku}</div>
                </td>
                <td className="px-6 py-4">
                  <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-600 text-xs font-medium border border-slate-200">
                    {product.category}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`text-base font-bold ${product.stock < 10 ? 'text-rose-500' : 'text-slate-700'}`}>
                    {product.stock}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                    product.stock > 10 
                    ? 'bg-emerald-100 text-emerald-600' 
                    : 'bg-rose-100 text-rose-600 animate-pulse'
                  }`}>
                    {product.stock > 10 ? 'Aman' : 'Kritis'}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-1.5 text-sky-600 hover:bg-sky-100 rounded-md">
                      <Edit size={16} />
                    </button>
                    <button 
                      onClick={() => handleDelete(product.id)}
                      className="p-1.5 text-rose-500 hover:bg-rose-100 rounded-md"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="p-12 text-center text-slate-400">
            <Package size={48} className="mx-auto mb-3 opacity-20" />
            <p>Tidak ada data produk ditemukan.</p>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-[60]">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl relative">
            <button onClick={() => setModalOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"><X size={20}/></button>
            <h3 className="text-xl font-bold text-slate-800 mb-6">Tambah Produk Baru</h3>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase">SKU</label>
                <input required className="w-full border rounded-lg px-4 py-2 mt-1 focus:ring-2 focus:ring-sky-200 outline-none" 
                  value={formData.sku} onChange={e => setFormData({...formData, sku: e.target.value})} placeholder="BRG-001"/>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase">Nama Produk</label>
                <input required className="w-full border rounded-lg px-4 py-2 mt-1 focus:ring-2 focus:ring-sky-200 outline-none" 
                  value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Kursi Gaming"/>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase">Kategori</label>
                  <input required className="w-full border rounded-lg px-4 py-2 mt-1 focus:ring-2 focus:ring-sky-200 outline-none" 
                    value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} placeholder="Furniture"/>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase">Stok Awal</label>
                  <input required type="number" className="w-full border rounded-lg px-4 py-2 mt-1 focus:ring-2 focus:ring-sky-200 outline-none" 
                    value={formData.stock} onChange={e => setFormData({...formData, stock: Number(e.target.value)})}/>
                </div>
              </div>
              <button className="w-full bg-sky-600 text-white font-bold py-3 rounded-xl hover:bg-sky-700 transition-colors mt-4">Simpan Produk</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryView;
