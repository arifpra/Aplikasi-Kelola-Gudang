import React from 'react';
import { ArrowUpRight } from 'lucide-react';

const StatCard = ({ title, value, subtitle, gradient }) => (
  <div className={`bg-gradient-to-r ${gradient} rounded-xl p-6 text-white shadow-lg relative overflow-hidden group hover:shadow-xl transition-all hover:-translate-y-1`}>
    <div className="relative z-10">
      <p className="text-blue-100 text-xs font-bold uppercase tracking-wider mb-1 opacity-80">{title}</p>
      <h3 className="text-3xl font-bold tracking-tight mb-2">{value}</h3>
      <div className="flex items-center gap-1 text-xs bg-white/20 w-fit px-2 py-1 rounded-full backdrop-blur-sm">
        <ArrowUpRight size={12} />
        {subtitle}
      </div>
    </div>
    <div className="absolute right-0 top-0 h-32 w-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-2xl group-hover:bg-white/20 transition-all"></div>
  </div>
);

export default StatCard;