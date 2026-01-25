"use client";
import { ChevronDown, Users2, Baby } from "lucide-react";
import Toggle from "./ui/Toggle";

export default function KaryakarGroup({ karyakar, assignedBalaks, onToggle, isOpen, setIsOpen, searchQuery, highlightComponent: Highlight }) {
  return (
    <div className={`rounded-[32px] border transition-all duration-500 overflow-hidden ${isOpen ? "border-indigo-100 bg-white shadow-2xl" : "border-slate-100 bg-white shadow-sm"}`}>
      
      {/* Karyakar Header (The Lead) */}
      <div onClick={() => assignedBalaks.length > 0 && setIsOpen()} className="p-5 flex items-center justify-between cursor-pointer active:bg-slate-50 transition-colors">
        <div className="flex items-center gap-4">
          <div className={`h-12 w-12 rounded-2xl flex items-center justify-center transition-all ${karyakar.isPresent ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-100 text-slate-400'}`}>
            <Users2 size={22} />
          </div>
          <div>
            <h3 className={`font-black text-lg tracking-tight ${!karyakar.isPresent ? 'text-slate-300' : 'text-slate-900'}`}>
              <Highlight text={karyakar.name} query={searchQuery} />
            </h3>
            <div className="flex items-center gap-2">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">{karyakar.role}</p>
              <span className="h-1 w-1 rounded-full bg-slate-200" />
              <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-tight leading-none">{assignedBalaks.length} Kids Assigned</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Toggle enabled={karyakar.isPresent} onChange={() => onToggle([karyakar.id], karyakar.isPresent)} />
          {assignedBalaks.length > 0 && (
            <div className={`transition-transform duration-500 text-slate-300 ${isOpen ? 'rotate-180 text-indigo-500' : ''}`}>
              <ChevronDown size={24} strokeWidth={2.5} />
            </div>
          )}
        </div>
      </div>

      {/* Nested Balaks (The Kids) */}
      {isOpen && assignedBalaks.length > 0 && (
        <div className="bg-slate-50/50 border-t border-slate-50 p-3 space-y-2 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="px-3 py-1 flex justify-between items-center">
             <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Mark Kids Attendance</p>
          </div>
          
          {assignedBalaks.map(balak => (
            <div key={balak.id} className="flex items-center justify-between bg-white p-4 rounded-[22px] border border-slate-100 shadow-sm transition-all">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                  <Baby size={16} />
                </div>
                <div>
                  <span className={`font-bold block text-sm transition-all ${!balak.isPresent ? 'text-slate-300 line-through' : 'text-slate-700'}`}>
                    <Highlight text={balak.name} query={searchQuery} />
                  </span>
                  <p className="text-[9px] font-medium text-slate-400 italic">Report to: {karyakar.name.split(' ')[0]}</p>
                </div>
              </div>
              <Toggle enabled={balak.isPresent} onChange={() => onToggle([balak.id], balak.isPresent)} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}