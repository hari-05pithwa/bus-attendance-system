"use client";
import { User } from "lucide-react";
import Toggle from "./ui/Toggle";

export default function AttendanceRow({ person, onToggle, searchQuery, highlightComponent: Highlight }) {
  return (
    <div className="flex items-center justify-between bg-white p-5 rounded-[28px] border border-slate-100 shadow-sm active:scale-[0.98] transition-all">
      <div className="flex items-center gap-4">
        <div className={`h-11 w-11 rounded-2xl flex items-center justify-center transition-colors ${person.isPresent ? 'bg-slate-50 text-indigo-600' : 'bg-slate-50 text-slate-300'}`}>
          <User size={22} />
        </div>
        
        <div>
          <h3 className={`font-black text-base tracking-tight leading-tight ${!person.isPresent ? 'text-slate-300 line-through' : 'text-slate-900'}`}>
            <Highlight text={person.name} query={searchQuery} />
          </h3>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">{person.role}</p>
        </div>
      </div>

      <Toggle 
        enabled={person.isPresent} 
        onChange={() => onToggle([person.id], person.isPresent)} 
      />
    </div>
  );
}