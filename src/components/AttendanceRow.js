"use client";
import { User } from "lucide-react";
import Toggle from "./ui/Toggle";

export default function AttendanceRow({ person, onToggle, searchQuery, highlightComponent: Highlight }) {
  return (
    <div className="flex items-center justify-between bg-white p-4 rounded-[24px] border border-slate-100 shadow-sm active:scale-[0.98] transition-all mb-4">
      <div className="flex items-center gap-4">
        <div className={`h-10 w-10 rounded-xl flex items-center justify-center transition-colors ${person.isPresent ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-50 text-slate-300'}`}>
          <User size={20} />
        </div>
        
        <div className="flex flex-col">
          <h3 className={`font-bold text-sm tracking-tight leading-tight transition-all ${!person.isPresent ? 'text-slate-300 line-through' : 'text-slate-900'}`}>
            <Highlight text={person.name} query={searchQuery} />
          </h3>
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">
            {person.role}
          </p>
        </div>
      </div>

      <Toggle 
        enabled={person.isPresent} 
        onChange={() => onToggle([person.id], person.isPresent)} 
      />
    </div>
  );
}