import React from 'react';
import { Menu, Search, Bell, ChevronDown } from 'lucide-react';

const Header = ({ toggleSidebar }) => {
  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shadow-sm z-10">
      <div className="flex items-center gap-4">
        <button onClick={toggleSidebar} className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg">
          <Menu size={20} />
        </button>
        <div className="hidden md:flex items-center bg-slate-100 rounded-lg px-3 py-2 w-64 border border-slate-200 focus-within:ring-2 focus-within:ring-sky-200 transition-all">
          <Search size={16} className="text-slate-400 mr-2" />
          <input 
            type="text" 
            placeholder="Cari fitur atau data..." 
            className="bg-transparent border-none text-sm w-full outline-none text-slate-700"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-full relative">
          <Bell size={20} />
          <span className="absolute top-1.5 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
        </button>
        <div className="h-8 w-[1px] bg-slate-200 mx-1"></div>
        <button className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-sky-600">
          <div className="w-8 h-8 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center font-bold">
            AD
          </div>
          <span className="hidden md:block">Alfian Dimas</span>
          <ChevronDown size={14} />
        </button>
      </div>
    </header>
  );
};

export default Header;