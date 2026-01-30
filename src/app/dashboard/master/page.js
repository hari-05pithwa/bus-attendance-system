// "use client";

// import { useEffect, useState, useCallback } from "react";
// import { ArrowLeft, Loader2, UserCircle, Filter, Activity, RefreshCcw } from "lucide-react";
// import Link from "next/link";
// import { useRouter } from "next/navigation";

// export default function MasterPage() {
//   const [busSummaries, setBusSummaries] = useState([]);
//   const [allMembers, setAllMembers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [isRefreshing, setIsRefreshing] = useState(false);
//   const [selectedBus, setSelectedBus] = useState("all");
//   const [filterTab, setFilterTab] = useState("present");
//   const router = useRouter();

//   const fetchData = useCallback(async (showIndicator = false) => {
//     if (showIndicator) setIsRefreshing(true);
//     try {
//       const [resStats, resMembers] = await Promise.all([
//         fetch("/api/superadmin/stats", { cache: 'no-store' }),
//         fetch("/api/attendance", { cache: 'no-store' })
//       ]);

//       const statsData = await resStats.json();
//       const membersData = await resMembers.json();

//       setBusSummaries(Array.isArray(statsData) ? statsData : []);
//       setAllMembers(Array.isArray(membersData) ? membersData : []);
//     } catch (e) {
//       console.error("Live Update Error:", e);
//     } finally {
//       setLoading(false);
//       setIsRefreshing(false);
//     }
//   }, []);

//   useEffect(() => {
//     fetchData();
//     const interval = setInterval(() => {
//       fetchData();
//     }, 500);
//     return () => clearInterval(interval);
//   }, [fetchData]);

//   // NEW: Back button logic
//   const handleBackNavigation = (e) => {
//     if (selectedBus !== "all") {
//       e.preventDefault(); // Prevent Link from navigating to Dashboard
//       setSelectedBus("all"); // Go back to bus filter overview
//     }
//   };

//   if (loading) return (
//     <div className="h-[100dvh] flex items-center justify-center bg-white">
//       <Loader2 className="animate-spin text-indigo-600" size={32} />
//     </div>
//   );

//   const busMembers = allMembers.filter(m => String(m.busId) === String(selectedBus));
//   const presentCount = busMembers.filter(m => m.isPresent).length;
//   const absentCount = busMembers.length - presentCount;
//   const filteredList = busMembers.filter(m => filterTab === "present" ? m.isPresent : !m.isPresent);

//   const getKaryakarName = (id) => allMembers.find(m => m.id === id)?.name || "Unassigned";

//   return (
//     <div className="min-h-screen bg-[#F8FAFC] pb-10 font-sans">
//       <nav className="p-6 bg-white/80 backdrop-blur-md border-b sticky top-0 z-20 flex items-center justify-between">
//         <div className="flex items-center gap-4">
//           {/* UPDATED: Back button with conditional logic */}
//           <Link
//             href="/dashboard"
//             onClick={handleBackNavigation}
//             className="p-2 bg-slate-50 rounded-xl active:scale-90 transition-all"
//           >
//             <ArrowLeft size={20} className="text-slate-900" />
//           </Link>
//           <div className="flex flex-col">
//              <h1 className="font-black text-xl tracking-tight leading-none text-slate-900">Fleet Master</h1>
//              <div className="flex items-center gap-1 mt-1">
//                 <div className="h-1.5 w-1.5 bg-emerald-500 rounded-full animate-pulse" />
//                 <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Live Updates On</span>
//              </div>
//           </div>
//         </div>

//         <div className="flex items-center gap-3">
//           <div className={`transition-opacity duration-300 ${isRefreshing ? 'opacity-100' : 'opacity-0'}`}>
//             <RefreshCcw size={14} className="animate-spin text-indigo-500" />
//           </div>

//           <div className="relative">
//             <select
//               value={selectedBus}
//               onChange={(e) => setSelectedBus(e.target.value)}
//               className="appearance-none bg-indigo-50 px-4 py-2 pr-8 rounded-xl text-[11px] font-black uppercase tracking-widest text-indigo-600 outline-none border-none ring-0 cursor-pointer"
//             >
//               <option value="all">All Buses</option>
//               {busSummaries.map(bus => (
//                 <option key={bus._id} value={bus._id}>Bus {bus._id}</option>
//               ))}
//             </select>
//             <Filter size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-indigo-400 pointer-events-none" />
//           </div>
//         </div>
//       </nav>

//       <div className="p-6 max-w-xl mx-auto space-y-6">
//         {selectedBus === "all" ? (
//           <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
//             <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Live Fleet Status</h3>
//             {busSummaries.map(bus => (
//               <div key={bus._id} onClick={() => setSelectedBus(String(bus._id))} className="bg-white p-6 rounded-[30px] border border-slate-100 shadow-sm flex items-center justify-between active:scale-95 transition-all cursor-pointer">
//                 <div className="flex items-center gap-4">
//                   <div className="h-12 w-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white font-black">{bus._id}</div>
//                   <div>
//                     <h4 className="font-black text-slate-900 leading-none text-lg uppercase tracking-tight">Bus {bus._id}</h4>
//                     <p className="text-[10px] font-bold text-slate-400 uppercase mt-1">{bus.present} / {bus.total} Present</p>
//                   </div>
//                 </div>
//                 <div className="text-right">
//                     <p className="text-lg font-black text-indigo-600">{bus.total > 0 ? Math.round((bus.present / bus.total) * 100) : 0}%</p>
//                     <p className="text-[8px] font-black text-slate-300 uppercase tracking-tighter">Capacity</p>
//                 </div>
//               </div>
//             ))}
//           </div>
//         ) : (
//           <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
//             {/* Tally Card */}
//             <div className="bg-[#0f172a] rounded-[32px] p-8 text-white shadow-2xl relative overflow-hidden">
//                 <div className="absolute top-0 right-0 p-8 opacity-5">

//                 </div>
//                 <div className="flex justify-between items-start mb-6 relative z-10">
//                   <div>
//                     <p className="text-emerald-400 text-[10px] font-black uppercase tracking-[0.2em] mb-1">Live Attendance</p>
//                     <h2 className="text-3xl font-black uppercase tracking-tight">Bus {selectedBus}</h2>
//                   </div>

//                 </div>

//                 <div className="grid grid-cols-3 gap-4 relative z-10">
//                   <div className="bg-white/5 p-4 rounded-2xl text-center border border-white/5">
//                     <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Total</p>
//                     <p className="text-xl font-black">{busMembers.length}</p>
//                   </div>
//                   <div className="bg-emerald-500/10 p-4 rounded-2xl border border-emerald-500/20 text-center">
//                     <p className="text-[9px] font-black text-emerald-400 uppercase mb-1">Present</p>
//                     <p className="text-xl font-black text-emerald-400">{presentCount}</p>
//                   </div>
//                   <div className="bg-rose-500/10 p-4 rounded-2xl border border-rose-500/20 text-center">
//                     <p className="text-[9px] font-black text-rose-400 uppercase mb-1">Absent</p>
//                     <p className="text-xl font-black text-rose-400">{absentCount}</p>
//                   </div>
//                 </div>
//             </div>

//             <div className="relative flex p-1 bg-slate-100 rounded-2xl overflow-hidden border border-slate-200">
//               <div
//                 className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-white rounded-xl shadow-sm transition-all duration-300 ease-in-out transform ${filterTab === "absent" ? "translate-x-full" : "translate-x-0"}`}
//               />
//               <button onClick={() => setFilterTab("present")} className={`relative z-10 flex-1 py-3 text-[11px] font-black uppercase tracking-widest transition-colors duration-300 ${filterTab === "present" ? "text-indigo-600" : "text-slate-400"}`}>Present</button>
//               <button onClick={() => setFilterTab("absent")} className={`relative z-10 flex-1 py-3 text-[11px] font-black uppercase tracking-widest transition-colors duration-300 ${filterTab === "absent" ? "text-rose-600" : "text-slate-400"}`}>Absent</button>
//             </div>

//             <div className="flex items-center justify-between ml-1">
//               <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">
//                 {filterTab === "present" ? "On-Board List" : "Missing List"}
//               </h3>
//               <div className={`text-[10px] font-black px-3 py-1 rounded-full ${filterTab === "present" ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"}`}>
//                 {filteredList.length} Entries
//               </div>
//             </div>

//             <div className="space-y-3">
//               {filteredList.length > 0 ? (
//                 filteredList.map((person) => (
//                   <div key={person.id} className="p-5 bg-white rounded-[26px] border border-slate-100 shadow-sm flex flex-col gap-3 transition-all hover:border-indigo-100">
//                     <div className="flex items-center justify-between">
//                       <p className="font-black text-slate-900 text-lg leading-none tracking-tight">{person.name}</p>
//                       <div className={`text-[8px] font-black px-2 py-1 rounded-md uppercase tracking-widest ${person.isPresent ? 'bg-emerald-50 text-emerald-500 border border-emerald-100' : 'bg-rose-50 text-rose-400 border border-rose-100'}`}>
//                         {person.isPresent ? "IN" : "OUT"}
//                       </div>
//                     </div>
//                     <div className="flex flex-wrap items-center gap-2">
//                       <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md ${person.gender === 'female' ? 'bg-pink-50 text-pink-500' : 'bg-blue-50 text-blue-500'}`}>
//                         {person.role}
//                       </span>
//                       {(person.role === "Balak" || person.role === "Balika") && (
//                         <div className="flex items-center gap-1.5 px-2 py-0.5 bg-slate-50 rounded-md border border-slate-100">
//                           <UserCircle size={10} className="text-indigo-400" />
//                           <p className="text-[9px] font-bold text-slate-500 italic">Under: {getKaryakarName(person.assignedKaryakar)}</p>
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 ))
//               ) : (
//                 <div className="text-center py-20 bg-white rounded-[32px] border border-dashed border-slate-200">
//                    <p className="text-slate-400 text-[11px] font-black uppercase tracking-widest text-center">No entries found in this category</p>
//                 </div>
//               )}
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import {
  ArrowLeft,
  Loader2,
  Activity,
  RefreshCcw,
  Users,
  MapPin,
  Navigation,
  Bus,
  Home,
  Phone,
  ChevronDown,
  CheckCircle2,
  UserX,
} from "lucide-react";
import Link from "next/link";

const SLOT_CONFIG = {
  At_1: {
    label: "Source Pickup",
    icon: MapPin,
    color: "text-indigo-600",
    bg: "bg-indigo-50",
    border: "border-indigo-200",
  },
  At_2: {
    label: "Destination Drop",
    icon: Navigation,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
  },
  At_3: {
    label: "Return Boarding",
    icon: Bus,
    color: "text-amber-600",
    bg: "bg-amber-50",
    border: "border-amber-200",
  },
  At_4: {
    label: "Final Drop-off",
    icon: Home,
    color: "text-rose-600",
    bg: "bg-rose-50",
    border: "border-rose-200",
  },
};

export default function MasterPage() {
  const [allMembers, setAllMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedBus, setSelectedBus] = useState("all");
  const [filterTab, setFilterTab] = useState("present");
  const [activeAtPoint, setActiveAtPoint] = useState("At_1");
  const [expandedId, setExpandedId] = useState(null);

  const fetchData = useCallback(async (showIndicator = false) => {
    if (showIndicator) setIsRefreshing(true);
    try {
      const res = await fetch("/api/attendance", { cache: "no-store" });
      const data = await res.json();
      setAllMembers(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error("Live Update Error:", e);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(() => fetchData(), 500);
    return () => clearInterval(interval);
  }, [fetchData]);

  const currentSlot = SLOT_CONFIG[activeAtPoint];

  const busSummaries = useMemo(() => {
    const groups = allMembers.reduce((acc, member) => {
      const bId = String(member.busId);
      if (!acc[bId]) acc[bId] = { id: bId, total: 0, present: 0 };
      acc[bId].total++;
      if (member.attendence?.[activeAtPoint]) acc[bId].present++;
      return acc;
    }, {});
    return Object.values(groups).sort((a, b) =>
      a.id.localeCompare(b.id, undefined, { numeric: true }),
    );
  }, [allMembers, activeAtPoint]);

  const fleetTotals = useMemo(() => {
    const total = allMembers.length;
    const present = allMembers.filter(
      (m) => m.attendence?.[activeAtPoint],
    ).length;
    return { total, present, absent: total - present };
  }, [allMembers, activeAtPoint]);

  const busStats = useMemo(() => {
    const list = allMembers.filter(
      (m) => String(m.busId) === String(selectedBus),
    );
    const total = list.length;
    const present = list.filter((m) => m.attendence?.[activeAtPoint]).length;
    return {
      total,
      present,
      absent: total - present,
      percent: total > 0 ? Math.round((present / total) * 100) : 0,
    };
  }, [selectedBus, allMembers, activeAtPoint]);

  const filteredList = useMemo(() => {
    const busList = allMembers.filter(
      (m) => String(m.busId) === String(selectedBus),
    );
    return busList.filter((m) =>
      filterTab === "present"
        ? m.attendence?.[activeAtPoint]
        : !m.attendence?.[activeAtPoint],
    );
  }, [allMembers, selectedBus, filterTab, activeAtPoint]);

  const handleBack = (e) => {
    if (selectedBus !== "all") {
      e.preventDefault();
      setSelectedBus("all");
    }
  };

  if (loading)
    return (
      <div className="h-[100dvh] flex items-center justify-center bg-white">
        <Loader2 className="animate-spin text-indigo-600" size={32} />
      </div>
    );

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-48 font-sans">
      <nav className="p-6 bg-white/90 backdrop-blur-md border-b sticky top-0 z-30">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              onClick={handleBack}
              className="p-2 bg-slate-50 rounded-xl active:scale-90 transition-all"
            >
              <ArrowLeft size={20} className="text-slate-900" />
            </Link>
            <div>
              <h1 className="font-black text-xl text-slate-900 tracking-tight leading-none">
                Fleet Master
              </h1>
              <span
                className={`text-[8px] font-black uppercase tracking-[0.2em] ${currentSlot.color}`}
              >
                {currentSlot.label}
              </span>
            </div>
          </div>
          <div
            className={`transition-opacity ${isRefreshing ? "opacity-100" : "opacity-0"}`}
          >
            <RefreshCcw size={16} className="animate-spin text-indigo-500" />
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {Object.entries(SLOT_CONFIG).map(([key, config]) => (
            <button
              key={key}
              onClick={() => {
                setActiveAtPoint(key);
                setExpandedId(null);
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border-2 whitespace-nowrap ${
                activeAtPoint === key
                  ? `${config.bg} ${config.color} ${config.border} shadow-sm scale-105`
                  : "bg-white border-transparent text-slate-300"
              }`}
            >
              <config.icon size={12} /> A{key.split("_")[1]}
            </button>
          ))}
        </div>
      </nav>

      <div className="p-6 max-w-xl mx-auto space-y-6">
        {selectedBus === "all" ? (
          <div className="space-y-4">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
              Live Overview: {currentSlot.label}
            </h3>
            {busSummaries.map((bus) => (
              <div
                key={bus.id}
                onClick={() => setSelectedBus(bus.id)}
                className="bg-white p-5 rounded-[30px] border border-slate-100 shadow-sm flex items-center justify-between active:scale-95 transition-all cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`h-12 w-12 rounded-2xl flex items-center justify-center font-black ${currentSlot.bg} ${currentSlot.color}`}
                  >
                    {bus.id}
                  </div>
                  <div>
                    <h4 className="font-black text-slate-900 text-lg uppercase tracking-tight leading-none">
                      Bus {bus.id}
                    </h4>
                    <p className="text-[11px] font-black text-slate-400 uppercase mt-1">
                      {bus.present}{" "}
                      <span className="opacity-40 text-[9px]">/</span>{" "}
                      {bus.total} Present
                    </p>
                  </div>
                </div>
                <div className={`text-lg font-black ${currentSlot.color}`}>
                  {bus.total > 0
                    ? Math.round((bus.present / bus.total) * 100)
                    : 0}
                  %
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-slate-900 rounded-[35px] p-8 text-white shadow-2xl relative overflow-hidden">
              <Activity
                className="absolute -right-4 -top-4 opacity-5 text-white"
                size={160}
              />

              <div className="flex justify-between items-start mb-8 relative z-10">
                <div>
                  <p
                    className={`${currentSlot.color} text-[10px] font-black uppercase tracking-[0.2em] mb-1`}
                  >
                    {currentSlot.label}
                  </p>
                  <h2 className="text-3xl font-black uppercase tracking-tight">
                    Bus {selectedBus}
                  </h2>
                </div>

                {/* Percentage moved to the top right */}
                <div className="text-right group">
                  <div className="relative">
                    {/* Subtle Outer Glow */}
                    <div className="absolute inset-0 bg-emerald-500/20 blur-xl rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />

                    <div className="relative px-5 py-2.5 rounded-2xl border-2 border-emerald-500/30 bg-emerald-500/5 backdrop-blur-md flex flex-col items-center shadow-[0_8px_32px_-12px_rgba(16,185,129,0.3)]">
                      {/* Percentage with smaller % sign */}
                      <p className="text-2xl font-black leading-none text-emerald-400 tracking-tight">
                        {busStats.percent}
                        <span className="text-xs ml-0.5 opacity-80">%</span>
                      </p>

                      {/* Label with better spacing */}
                      <div className="flex items-center gap-1 mt-1.5">
                        <div className="h-1 w-1 rounded-full bg-emerald-500 animate-pulse" />
                        <p className="text-[7px] font-black uppercase tracking-[0.15em] text-emerald-500/70">
                          Attendance
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 relative z-10 text-center">
                <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                  <p className="text-[9px] font-black text-slate-500 uppercase mb-1">
                    Total
                  </p>
                  <p className="text-xl font-black">{busStats.total}</p>
                </div>
                <div className="bg-emerald-500/10 p-4 rounded-2xl border border-emerald-500/20">
                  <p className="text-[9px] font-black text-emerald-400 uppercase mb-1">
                    Present
                  </p>
                  <p className="text-xl font-black text-emerald-400">
                    {busStats.present}
                  </p>
                </div>
                <div className="bg-rose-500/10 p-4 rounded-2xl border border-rose-500/20">
                  <p className="text-[9px] font-black text-rose-400 uppercase mb-1">
                    Missing
                  </p>
                  <p className="text-xl font-black text-rose-400">
                    {busStats.absent}
                  </p>
                </div>
              </div>
            </div>

            <div className="relative flex p-1 bg-slate-100 rounded-2xl border border-slate-200">
              <div
                className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-white rounded-xl shadow-sm transition-all duration-300 transform ${filterTab === "absent" ? "translate-x-full" : "translate-x-0"}`}
              />
              <button
                onClick={() => setFilterTab("present")}
                className={`relative z-10 flex-1 py-3 text-[11px] font-black uppercase tracking-widest transition-colors ${filterTab === "present" ? "text-indigo-600" : "text-slate-400"}`}
              >
                Present
              </button>
              <button
                onClick={() => setFilterTab("absent")}
                className={`relative z-10 flex-1 py-3 text-[11px] font-black uppercase tracking-widest transition-colors ${filterTab === "absent" ? "text-rose-600" : "text-slate-400"}`}
              >
                Absent
              </button>
            </div>

            <div className="space-y-3">
              {filteredList.map((person) => {
                const hasPhone = !!person.phone && person.phone.trim() !== "";
                const isExpanded = expandedId === (person.id || person.phone);
                const isPresent = person.attendence?.[activeAtPoint];

                return (
                  <div
                    key={person.id || person.phone}
                    className="overflow-hidden bg-white rounded-[26px] border border-slate-100 shadow-sm transition-all"
                  >
                    <button
                      disabled={!hasPhone}
                      onClick={() =>
                        setExpandedId(
                          isExpanded ? null : person.id || person.phone,
                        )
                      }
                      className={`w-full p-4 flex items-center justify-between text-left transition-colors ${hasPhone ? "active:bg-slate-50" : "cursor-default"}`}
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`h-10 w-10 rounded-xl flex items-center justify-center ${isPresent ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-400"}`}
                        >
                          {isPresent ? (
                            <CheckCircle2 size={20} strokeWidth={2.5} />
                          ) : (
                            <UserX size={20} strokeWidth={2.5} />
                          )}
                        </div>
                        <div className="flex flex-col">
                          <p className="font-black text-slate-900 text-base leading-none mb-1">
                            {person.name}
                          </p>
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                            {person.role} • {person.mandal}
                          </p>
                        </div>
                      </div>
                      {hasPhone && (
                        <ChevronDown
                          size={18}
                          className={`text-slate-300 transition-transform duration-300 ${isExpanded ? "rotate-180 text-indigo-500" : ""}`}
                        />
                      )}
                    </button>
                    {isExpanded && hasPhone && (
                      <div className="px-4 pb-4 pt-2 border-t border-slate-50 bg-slate-50/50 flex items-center justify-between animate-in slide-in-from-top-2 duration-300">
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600">
                            <Phone size={14} />
                          </div>
                          <span className="text-sm font-black text-slate-700 tracking-tight">
                            {person.phone}
                          </span>
                        </div>
                        <a
                          href={`tel:${person.phone}`}
                          className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-[10px] font-black text-indigo-600 uppercase shadow-sm active:scale-95 transition-all"
                        >
                          Call Now
                        </a>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* MOBILE-OPTIMIZED GLOBAL FOOTER */}
<div className="fixed bottom-0 left-0 right-0 p-4 sm:p-6 z-40 pointer-events-none">
  <div className="max-w-md mx-auto bg-slate-900/95 backdrop-blur-2xl rounded-[28px] sm:rounded-[32px] p-5 sm:p-6 flex items-center justify-between pointer-events-auto shadow-[0_20px_50px_rgba(0,0,0,0.4)] border border-white/10">
    
    {/* Left Side: Title Section */}
    <div className="flex flex-col pl-1 sm:pl-2 min-w-[100px]">
      <p className="text-[8px] sm:text-[10px] font-black uppercase tracking-[0.15em] text-slate-500 mb-0.5">
        Final Data
      </p>
      <h2 className="text-white font-black text-sm sm:text-lg uppercase tracking-tight truncate">
        {currentSlot.label}
      </h2>
    </div>
    
    {/* Right Side: Stats Container */}
    <div className="flex items-center gap-5 sm:gap-8 pr-1 sm:pr-4">
      
      {/* Present Count */}
      <div className="flex flex-col items-center">
        <p className="text-[8px] sm:text-[9px] text-emerald-500 font-black uppercase tracking-widest mb-1">
          Present
        </p>
        <p className="text-xl sm:text-2xl font-black text-white leading-none">
          {fleetTotals.present}
        </p>
      </div>

      {/* Vertical Divider */}
      <div className="h-8 w-px bg-white/10" />

      {/* Absent Count */}
      <div className="flex flex-col items-center">
        <p className="text-[8px] sm:text-[9px] text-rose-500 font-black uppercase tracking-widest mb-1">
          Absent
        </p>
        <p className="text-xl sm:text-2xl font-black text-white leading-none">
          {fleetTotals.absent}
        </p>
      </div>
      
    </div>

  </div>
</div>
    </div>
  );
}
