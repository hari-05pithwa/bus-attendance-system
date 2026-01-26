"use client";

import { useEffect, useState, useCallback } from "react";
import { ArrowLeft, Loader2, UserCircle, Filter, Activity, RefreshCcw } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function MasterPage() {
  const [busSummaries, setBusSummaries] = useState([]);
  const [allMembers, setAllMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedBus, setSelectedBus] = useState("all");
  const [filterTab, setFilterTab] = useState("present");
  const router = useRouter();

  const fetchData = useCallback(async (showIndicator = false) => {
    if (showIndicator) setIsRefreshing(true);
    try {
      const [resStats, resMembers] = await Promise.all([
        fetch("/api/superadmin/stats", { cache: 'no-store' }),
        fetch("/api/attendance", { cache: 'no-store' })
      ]);

      const statsData = await resStats.json();
      const membersData = await resMembers.json();

      setBusSummaries(Array.isArray(statsData) ? statsData : []);
      setAllMembers(Array.isArray(membersData) ? membersData : []);
    } catch (e) {
      console.error("Live Update Error:", e);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(() => {
      fetchData();
    }, 500);
    return () => clearInterval(interval);
  }, [fetchData]);

  // NEW: Back button logic
  const handleBackNavigation = (e) => {
    if (selectedBus !== "all") {
      e.preventDefault(); // Prevent Link from navigating to Dashboard
      setSelectedBus("all"); // Go back to bus filter overview
    }
  };

  if (loading) return (
    <div className="h-[100dvh] flex items-center justify-center bg-white">
      <Loader2 className="animate-spin text-indigo-600" size={32} />
    </div>
  );

  const busMembers = allMembers.filter(m => String(m.busId) === String(selectedBus));
  const presentCount = busMembers.filter(m => m.isPresent).length;
  const absentCount = busMembers.length - presentCount;
  const filteredList = busMembers.filter(m => filterTab === "present" ? m.isPresent : !m.isPresent);

  const getKaryakarName = (id) => allMembers.find(m => m.id === id)?.name || "Unassigned";

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-10 font-sans">
      <nav className="p-6 bg-white/80 backdrop-blur-md border-b sticky top-0 z-20 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* UPDATED: Back button with conditional logic */}
          <Link 
            href="/dashboard" 
            onClick={handleBackNavigation}
            className="p-2 bg-slate-50 rounded-xl active:scale-90 transition-all"
          >
            <ArrowLeft size={20} className="text-slate-900" />
          </Link>
          <div className="flex flex-col">
             <h1 className="font-black text-xl tracking-tight leading-none text-slate-900">Fleet Master</h1>
             <div className="flex items-center gap-1 mt-1">
                <div className="h-1.5 w-1.5 bg-emerald-500 rounded-full animate-pulse" />
                <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Live Updates On</span>
             </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className={`transition-opacity duration-300 ${isRefreshing ? 'opacity-100' : 'opacity-0'}`}>
            <RefreshCcw size={14} className="animate-spin text-indigo-500" />
          </div>
          
          <div className="relative">
            <select 
              value={selectedBus}
              onChange={(e) => setSelectedBus(e.target.value)}
              className="appearance-none bg-indigo-50 px-4 py-2 pr-8 rounded-xl text-[11px] font-black uppercase tracking-widest text-indigo-600 outline-none border-none ring-0 cursor-pointer"
            >
              <option value="all">All Buses</option>
              {busSummaries.map(bus => (
                <option key={bus._id} value={bus._id}>Bus {bus._id}</option>
              ))}
            </select>
            <Filter size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-indigo-400 pointer-events-none" />
          </div>
        </div>
      </nav>

      <div className="p-6 max-w-xl mx-auto space-y-6">
        {selectedBus === "all" ? (
          <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Live Fleet Status</h3>
            {busSummaries.map(bus => (
              <div key={bus._id} onClick={() => setSelectedBus(String(bus._id))} className="bg-white p-6 rounded-[30px] border border-slate-100 shadow-sm flex items-center justify-between active:scale-95 transition-all cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white font-black">{bus._id}</div>
                  <div>
                    <h4 className="font-black text-slate-900 leading-none text-lg uppercase tracking-tight">Bus {bus._id}</h4>
                    <p className="text-[10px] font-bold text-slate-400 uppercase mt-1">{bus.present} / {bus.total} Present</p>
                  </div>
                </div>
                <div className="text-right">
                    <p className="text-lg font-black text-indigo-600">{bus.total > 0 ? Math.round((bus.present / bus.total) * 100) : 0}%</p>
                    <p className="text-[8px] font-black text-slate-300 uppercase tracking-tighter">Capacity</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Tally Card */}
            <div className="bg-[#0f172a] rounded-[32px] p-8 text-white shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5">
                  
                </div>
                <div className="flex justify-between items-start mb-6 relative z-10">
                  <div>
                    <p className="text-emerald-400 text-[10px] font-black uppercase tracking-[0.2em] mb-1">Live Attendance</p>
                    <h2 className="text-3xl font-black uppercase tracking-tight">Bus {selectedBus}</h2>
                  </div>
                  
                </div>

                <div className="grid grid-cols-3 gap-4 relative z-10">
                  <div className="bg-white/5 p-4 rounded-2xl text-center border border-white/5">
                    <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Total</p>
                    <p className="text-xl font-black">{busMembers.length}</p>
                  </div>
                  <div className="bg-emerald-500/10 p-4 rounded-2xl border border-emerald-500/20 text-center">
                    <p className="text-[9px] font-black text-emerald-400 uppercase mb-1">Present</p>
                    <p className="text-xl font-black text-emerald-400">{presentCount}</p>
                  </div>
                  <div className="bg-rose-500/10 p-4 rounded-2xl border border-rose-500/20 text-center">
                    <p className="text-[9px] font-black text-rose-400 uppercase mb-1">Absent</p>
                    <p className="text-xl font-black text-rose-400">{absentCount}</p>
                  </div>
                </div>
            </div>

            <div className="relative flex p-1 bg-slate-100 rounded-2xl overflow-hidden border border-slate-200">
              <div 
                className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-white rounded-xl shadow-sm transition-all duration-300 ease-in-out transform ${filterTab === "absent" ? "translate-x-full" : "translate-x-0"}`}
              />
              <button onClick={() => setFilterTab("present")} className={`relative z-10 flex-1 py-3 text-[11px] font-black uppercase tracking-widest transition-colors duration-300 ${filterTab === "present" ? "text-indigo-600" : "text-slate-400"}`}>Present</button>
              <button onClick={() => setFilterTab("absent")} className={`relative z-10 flex-1 py-3 text-[11px] font-black uppercase tracking-widest transition-colors duration-300 ${filterTab === "absent" ? "text-rose-600" : "text-slate-400"}`}>Absent</button>
            </div>

            <div className="flex items-center justify-between ml-1">
              <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">
                {filterTab === "present" ? "On-Board List" : "Missing List"}
              </h3>
              <div className={`text-[10px] font-black px-3 py-1 rounded-full ${filterTab === "present" ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"}`}>
                {filteredList.length} Entries
              </div>
            </div>

            <div className="space-y-3">
              {filteredList.length > 0 ? (
                filteredList.map((person) => (
                  <div key={person.id} className="p-5 bg-white rounded-[26px] border border-slate-100 shadow-sm flex flex-col gap-3 transition-all hover:border-indigo-100">
                    <div className="flex items-center justify-between">
                      <p className="font-black text-slate-900 text-lg leading-none tracking-tight">{person.name}</p>
                      <div className={`text-[8px] font-black px-2 py-1 rounded-md uppercase tracking-widest ${person.isPresent ? 'bg-emerald-50 text-emerald-500 border border-emerald-100' : 'bg-rose-50 text-rose-400 border border-rose-100'}`}>
                        {person.isPresent ? "IN" : "OUT"}
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md ${person.gender === 'female' ? 'bg-pink-50 text-pink-500' : 'bg-blue-50 text-blue-500'}`}>
                        {person.role}
                      </span>
                      {(person.role === "Balak" || person.role === "Balika") && (
                        <div className="flex items-center gap-1.5 px-2 py-0.5 bg-slate-50 rounded-md border border-slate-100">
                          <UserCircle size={10} className="text-indigo-400" />
                          <p className="text-[9px] font-bold text-slate-500 italic">Under: {getKaryakarName(person.assignedKaryakar)}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-20 bg-white rounded-[32px] border border-dashed border-slate-200">
                   <p className="text-slate-400 text-[11px] font-black uppercase tracking-widest text-center">No entries found in this category</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}