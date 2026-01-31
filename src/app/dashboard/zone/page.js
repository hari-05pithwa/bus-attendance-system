// "use client";
// import { useEffect, useState, useCallback, useMemo } from "react";
// import { useSession, signOut } from "next-auth/react";
// import {
//   Loader2,
//   LogOut,
//   MapPin,
//   Navigation,
//   Bus,
//   Home,
//   CheckCircle2,
//   UserX,
//   ShieldCheck,
//   ArrowLeft,
//   Phone,
//   ChevronDown,
//   ChevronUp
// } from "lucide-react";
// import { toast } from "sonner";

// const SLOT_CONFIG = {
//   At_1: { label: "Source Pickup", icon: MapPin, color: "text-indigo-600", bg: "bg-indigo-50", border: "border-indigo-200" },
//   At_2: { label: "Destination Drop", icon: Navigation, color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-200" },
//   At_3: { label: "Return Boarding", icon: Bus, color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-200" },
//   At_4: { label: "Final Drop-off", icon: Home, color: "text-rose-600", bg: "bg-rose-50", border: "border-rose-200" },
// };

// export default function ZoneDashboard() {
//   const { data: session } = useSession();
//   const [allMembers, setAllMembers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [isLoggingOut, setIsLoggingOut] = useState(false);
//   const [selectedBus, setSelectedBus] = useState("overview");
//   const [filterTab, setFilterTab] = useState("present");
//   const [activeAtPoint, setActiveAtPoint] = useState("At_1");
//   const [expandedId, setExpandedId] = useState(null);

//   const handleLogout = async () => {
//     setIsLoggingOut(true);
//     toast.loading("Logging out...", {
//       id: "logout-toast",
//       position: "top-center",
//     });
//     await signOut({ callbackUrl: "/" });
//   };

//   const fetchData = useCallback(async () => {
//     try {
//       const res = await fetch("/api/attendance", { cache: "no-store" });
//       const data = await res.json();
//       setAllMembers(Array.isArray(data) ? data : []);
//     } catch (e) {
//       console.error("Zone Update Error:", e);
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     fetchData();
//     const interval = setInterval(() => fetchData(), 500); 
//     return () => clearInterval(interval);
//   }, [fetchData]);

//   const currentSlot = SLOT_CONFIG[activeAtPoint];
//   const zoneNum = useMemo(() => session?.user?.zone?.split("-")[1]?.trim(), [session]);

//   const zoneMembers = useMemo(() => {
//     if (!zoneNum) return [];
//     return allMembers.filter(m => String(m.busId || "").startsWith(`${zoneNum}.`));
//   }, [allMembers, zoneNum]);

//   const busSummaries = useMemo(() => {
//     const groups = zoneMembers.reduce((acc, member) => {
//       const bId = String(member.busId);
//       if (!acc[bId]) acc[bId] = { id: bId, total: 0, present: 0 };
//       acc[bId].total++;
//       if (member.attendence?.[activeAtPoint]) acc[bId].present++;
//       return acc;
//     }, {});
//     return Object.values(groups).sort((a, b) => a.id.localeCompare(b.id, undefined, { numeric: true }));
//   }, [zoneMembers, activeAtPoint]);

//   const zoneTotals = useMemo(() => {
//     const total = zoneMembers.length;
//     const present = zoneMembers.filter((m) => m.attendence?.[activeAtPoint]).length;
//     return { total, present, absent: total - present };
//   }, [zoneMembers, activeAtPoint]);

//   const busStats = useMemo(() => {
//     const list = zoneMembers.filter((m) => String(m.busId) === String(selectedBus));
//     const total = list.length;
//     const present = list.filter((m) => m.attendence?.[activeAtPoint]).length;
//     return { total, present, absent: total - present, percent: total > 0 ? Math.round((present / total) * 100) : 0 };
//   }, [selectedBus, zoneMembers, activeAtPoint]);

//   const filteredList = useMemo(() => {
//     const busList = zoneMembers.filter((m) => String(m.busId) === String(selectedBus));
//     return busList.filter((m) => filterTab === "present" ? m.attendence?.[activeAtPoint] : !m.attendence?.[activeAtPoint]);
//   }, [zoneMembers, selectedBus, filterTab, activeAtPoint]);

//   const toggleExpand = (id) => setExpandedId(expandedId === id ? null : id);

//   if (loading) return (
//     <div className="h-screen flex items-center justify-center bg-white">
//       <Loader2 className="animate-spin text-emerald-600" size={32} />
//     </div>
//   );

//   return (
//     <div className="min-h-screen bg-[#F8FAFC] pb-48">
//       <nav className="p-6 bg-white/90 backdrop-blur-md border-b sticky top-0 z-30">
//         <div className="flex items-center justify-between mb-5">
//           <div className="flex items-center gap-4">
//             {selectedBus !== "overview" ? (
//                 <button onClick={() => { setSelectedBus("overview"); setExpandedId(null); }} className="p-2 bg-slate-50 rounded-xl active:scale-90 transition-all">
//                     <ArrowLeft size={20} className="text-slate-900" />
//                 </button>
//             ) : (
//                 <div className="p-2 bg-emerald-600 rounded-xl shadow-lg shadow-emerald-100">
//                     <ShieldCheck size={20} className="text-white" />
//                 </div>
//             )}
//             <div>
//               <h1 className="font-black text-xl text-slate-900 tracking-tight leading-none">{session?.user?.zone} Portal</h1>
//               <span className={`text-[8px] font-black uppercase tracking-[0.2em] ${currentSlot.color}`}>
//                 {currentSlot.label}
//               </span>
//             </div>
//           </div>
          
//           <button
//             onClick={handleLogout}
//             disabled={isLoggingOut}
//             className="h-10 w-10 flex items-center justify-center bg-white border border-slate-100 text-slate-400 rounded-xl active:bg-rose-50 active:text-rose-500 transition-all disabled:opacity-50 shadow-sm"
//           >
//             {isLoggingOut ? (
//               <Loader2 size={18} className="animate-spin" />
//             ) : (
//               <LogOut size={18} />
//             )}
//           </button>
//         </div>

//         <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
//           {Object.entries(SLOT_CONFIG).map(([key, config]) => (
//             <button
//               key={key}
//               onClick={() => { setActiveAtPoint(key); setExpandedId(null); }}
//               className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border-2 whitespace-nowrap ${
//                 activeAtPoint === key ? `${config.bg} ${config.color} ${config.border} shadow-sm` : "bg-white border-transparent text-slate-300"
//               }`}
//             >
//               <config.icon size={12} /> A{key.split("_")[1]}
//             </button>
//           ))}
//         </div>
//       </nav>

//       <div className="p-6 max-w-xl mx-auto space-y-6">
//         {selectedBus === "overview" ? (
//           <div className="space-y-4">
//             <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Zone Overview: {currentSlot.label}</h3>
//             {busSummaries.length > 0 ? busSummaries.map((bus) => (
//               <div key={bus.id} onClick={() => setSelectedBus(bus.id)} className="bg-white p-5 rounded-[30px] border border-slate-100 shadow-sm flex items-center justify-between active:scale-95 transition-all cursor-pointer">
//                 <div className="flex items-center gap-4">
//                   <div className={`h-12 w-12 rounded-2xl flex items-center justify-center font-black ${currentSlot.bg} ${currentSlot.color}`}>{bus.id}</div>
//                   <div>
//                     <h4 className="font-black text-slate-900 text-lg uppercase leading-none">Bus {bus.id}</h4>
//                     <p className="text-[11px] font-black text-slate-400 uppercase mt-1">{bus.present} / {bus.total} Present</p>
//                   </div>
//                 </div>
//                 <div className={`text-lg font-black ${currentSlot.color}`}>{bus.total > 0 ? Math.round((bus.present / bus.total) * 100) : 0}%</div>
//               </div>
//             )) : (
//               <p className="text-center text-slate-400 font-bold uppercase text-xs mt-20">No active buses in this zone</p>
//             )}
//           </div>
//         ) : (
//           <div className="space-y-6 animate-in fade-in duration-300">
//             <div className="bg-slate-900 rounded-[35px] p-6 text-white shadow-xl">
//                <h2 className="text-2xl font-black uppercase mb-4">Bus {selectedBus} Detail</h2>
//                <div className="grid grid-cols-2 gap-3">
//                   <div className="bg-white/5 p-4 rounded-2xl text-center">
//                     <p className="text-[8px] text-slate-500 font-black uppercase">Present</p>
//                     <p className="text-xl font-black text-emerald-400">{busStats.present}</p>
//                   </div>
//                   <div className="bg-white/5 p-4 rounded-2xl text-center">
//                     <p className="text-[8px] text-slate-500 font-black uppercase">Absent</p>
//                     <p className="text-xl font-black text-rose-400">{busStats.absent}</p>
//                   </div>
//                </div>
//             </div>

//             <div className="flex p-1 bg-slate-100 rounded-2xl">
//               <button onClick={() => setFilterTab("present")} className={`flex-1 py-3 text-[10px] font-black uppercase rounded-xl transition-all ${filterTab === "present" ? "bg-white text-emerald-600 shadow-sm" : "text-slate-400"}`}>Present</button>
//               <button onClick={() => setFilterTab("absent")} className={`flex-1 py-3 text-[10px] font-black uppercase rounded-xl transition-all ${filterTab === "absent" ? "bg-white text-rose-600 shadow-sm" : "text-slate-400"}`}>Absent</button>
//             </div>

//             <div className="space-y-2">
//               {filteredList.map(person => {
//                 const personId = person._id || person.id || person.phone;
//                 const hasPhone = person.phone || person.number;
//                 const isExpanded = expandedId === personId;

//                 return (
//                   <div key={personId} className="flex flex-col bg-white rounded-2xl border border-slate-100 overflow-hidden transition-all">
//                     <div 
//                       onClick={() => hasPhone && toggleExpand(personId)}
//                       className={`p-4 flex items-center justify-between ${hasPhone ? 'cursor-pointer active:bg-slate-50' : ''}`}
//                     >
//                       <div>
//                         <p className="font-black text-slate-900 text-sm">{person.name}</p>
//                         <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">{person.role} • {person.mandal}</p>
//                       </div>
//                       <div className="flex items-center gap-3">
//                         {hasPhone && (isExpanded ? <ChevronUp size={14} className="text-slate-300" /> : <ChevronDown size={14} className="text-slate-300" />)}
//                         {person.attendence?.[activeAtPoint] ? <CheckCircle2 className="text-emerald-500" size={18}/> : <UserX className="text-rose-400" size={18}/>}
//                       </div>
//                     </div>
                    
//                     {hasPhone && isExpanded && (
//                       <div className="px-4 pb-4 pt-0 animate-in slide-in-from-top-2 duration-200">
//                         <a href={`tel:${person.phone || person.number}`} className="flex items-center justify-center gap-2 w-full py-2 bg-emerald-50 text-emerald-600 rounded-xl font-black text-[10px] uppercase tracking-widest border border-emerald-100 transition-all active:scale-95">
//                           <Phone size={12} /> Call {person.phone || person.number}
//                         </a>
//                       </div>
//                     )}
//                   </div>
//                 );
//               })}
//             </div>
//           </div>
//         )}
//       </div>

//       <div className="fixed bottom-0 left-0 right-0 p-6 z-40 pointer-events-none">
//         <div className="max-w-md mx-auto bg-slate-900/95 backdrop-blur-2xl rounded-[35px] p-6 flex items-center justify-between pointer-events-auto shadow-2xl text-white border border-white/10">
//           <div className="flex flex-col pl-2">
//             <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Total {session?.user?.zone}</p>
//             <h2 className="text-white font-black text-sm uppercase tracking-tight">{currentSlot.label}</h2>
//           </div>
//           <div className="flex items-center gap-8 pr-2">
//             <div className="flex flex-col items-center">
//               <p className="text-[9px] text-emerald-500 font-black uppercase tracking-widest mb-1">Present</p>
//               <p className="text-2xl font-black text-white leading-none">{zoneTotals.present}</p>
//             </div>
//             <div className="h-8 w-px bg-white/10" />
//             <div className="flex flex-col items-center">
//               <p className="text-[9px] text-rose-500 font-black uppercase tracking-widest mb-1">Absent</p>
//               <p className="text-2xl font-black text-white leading-none">{zoneTotals.absent}</p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";
import { useEffect, useState, useCallback, useMemo } from "react";
import { useSession, signOut } from "next-auth/react";
import {
  Loader2, LogOut, MapPin, Navigation, Bus, Home, CheckCircle2, UserX, ShieldCheck, ArrowLeft, Phone, ChevronDown, ChevronUp
} from "lucide-react";
import { toast } from "sonner";

const SLOT_CONFIG = {
  At_1: { label: "Source Pickup", icon: MapPin, color: "text-indigo-600", bg: "bg-indigo-50", border: "border-indigo-200" },
  At_2: { label: "Destination Drop", icon: Navigation, color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-200" },
  At_3: { label: "Return Boarding", icon: Bus, color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-200" },
  At_4: { label: "Final Drop-off", icon: Home, color: "text-rose-600", bg: "bg-rose-50", border: "border-rose-200" },
};

export default function ZoneDashboard() {
  const { data: session } = useSession();
  const [allMembers, setAllMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [selectedBus, setSelectedBus] = useState("overview");
  const [filterTab, setFilterTab] = useState("present");
  const [activeAtPoint, setActiveAtPoint] = useState("At_1");
  const [expandedId, setExpandedId] = useState(null);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    toast.loading("Logging out...", { id: "logout-toast", position: "top-center" });
    await signOut({ callbackUrl: "/" });
  };

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch("/api/attendance", { cache: "no-store" });
      const data = await res.json();
      setAllMembers(Array.isArray(data) ? data : []);
    } catch (e) { console.error("Zone Update Error:", e); } finally { setLoading(false); }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(() => fetchData(), 500); 
    return () => clearInterval(interval);
  }, [fetchData]);

  const currentSlot = SLOT_CONFIG[activeAtPoint];
  const zoneNum = useMemo(() => session?.user?.zone?.split("-")[1]?.trim(), [session]);

  const zoneMembers = useMemo(() => {
    if (!zoneNum) return [];
    return allMembers.filter(m => String(m.busId || "").startsWith(`${zoneNum}.`));
  }, [allMembers, zoneNum]);

  const busSummaries = useMemo(() => {
    const groups = zoneMembers.reduce((acc, member) => {
      const bId = String(member.busId);
      if (!acc[bId]) acc[bId] = { id: bId, total: 0, present: 0 };
      acc[bId].total++;
      if (member.attendence?.[activeAtPoint]) acc[bId].present++;
      return acc;
    }, {});
    return Object.values(groups).sort((a, b) => a.id.localeCompare(b.id, undefined, { numeric: true }));
  }, [zoneMembers, activeAtPoint]);

  const zoneTotals = useMemo(() => {
    const total = zoneMembers.length;
    const present = zoneMembers.filter((m) => m.attendence?.[activeAtPoint]).length;
    return { total, present, absent: total - present };
  }, [zoneMembers, activeAtPoint]);

  const busStats = useMemo(() => {
    const list = zoneMembers.filter((m) => String(m.busId) === String(selectedBus));
    const total = list.length;
    const present = list.filter((m) => m.attendence?.[activeAtPoint]).length;
    return { total, present, absent: total - present, percent: total > 0 ? Math.round((present / total) * 100) : 0 };
  }, [selectedBus, zoneMembers, activeAtPoint]);

  const filteredList = useMemo(() => {
    const busList = zoneMembers.filter((m) => String(m.busId) === String(selectedBus));
    return busList.filter((m) => filterTab === "present" ? m.attendence?.[activeAtPoint] : !m.attendence?.[activeAtPoint]);
  }, [zoneMembers, selectedBus, filterTab, activeAtPoint]);

  const toggleExpand = (id) => setExpandedId(expandedId === id ? null : id);

  if (loading) return <div className="h-screen flex items-center justify-center bg-white"><Loader2 className="animate-spin text-emerald-600" size={32} /></div>;

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-48">
      <nav className="p-6 bg-white/90 backdrop-blur-md border-b sticky top-0 z-30">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-4">
            {selectedBus !== "overview" ? (
                <button onClick={() => { setSelectedBus("overview"); setExpandedId(null); }} className="p-2 bg-slate-50 rounded-xl active:scale-90 transition-all"><ArrowLeft size={20} /></button>
            ) : <div className="p-2 bg-emerald-600 rounded-xl shadow-lg shadow-emerald-100"><ShieldCheck size={20} className="text-white" /></div>}
            <div><h1 className="font-black text-xl text-slate-900 tracking-tight leading-none">{session?.user?.zone} Portal</h1><span className={`text-[8px] font-black uppercase tracking-[0.2em] ${currentSlot.color}`}>{currentSlot.label}</span></div>
          </div>
          
          <button onClick={handleLogout} disabled={isLoggingOut} className="h-10 px-3 flex items-center gap-2 bg-white border border-slate-100 text-slate-400 rounded-xl active:bg-rose-50 active:text-rose-500 transition-all shadow-sm">
            {isLoggingOut ? <Loader2 size={16} className="animate-spin" /> : <LogOut size={16} />}
            <span className="text-[10px] font-black uppercase tracking-widest">Logout</span>
          </button>
        </div>

        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {Object.entries(SLOT_CONFIG).map(([key, config]) => (
            <button key={key} onClick={() => { setActiveAtPoint(key); setExpandedId(null); }} className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border-2 whitespace-nowrap ${activeAtPoint === key ? `${config.bg} ${config.color} ${config.border} shadow-sm` : "bg-white border-transparent text-slate-300"}`}><config.icon size={12} /> A{key.split("_")[1]}</button>
          ))}
        </div>
      </nav>

      <div className="p-6 max-w-xl mx-auto space-y-6">
        {selectedBus === "overview" ? (
          <div className="space-y-4">
            {busSummaries.length > 0 ? busSummaries.map((bus) => (
              <div key={bus.id} onClick={() => setSelectedBus(bus.id)} className="bg-white p-5 rounded-[30px] border border-slate-100 shadow-sm flex items-center justify-between active:scale-95 transition-all cursor-pointer">
                <div className="flex items-center gap-4"><div className={`h-12 w-12 rounded-2xl flex items-center justify-center font-black ${currentSlot.bg} ${currentSlot.color}`}>{bus.id}</div><div><h4 className="font-black text-slate-900 text-lg uppercase leading-none">Bus {bus.id}</h4><p className="text-[11px] font-black text-slate-400 uppercase mt-1">{bus.present} / {bus.total} Present</p></div></div>
                <div className={`text-lg font-black ${currentSlot.color}`}>{bus.total > 0 ? Math.round((bus.present / bus.total) * 100) : 0}%</div>
              </div>
            )) : <p className="text-center text-slate-400 font-bold uppercase text-xs mt-20">No active buses</p>}
          </div>
        ) : (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="bg-slate-900 rounded-[35px] p-6 text-white shadow-xl">
               <h2 className="text-2xl font-black uppercase mb-4">Bus {selectedBus} Detail</h2>
               <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white/5 p-4 rounded-2xl text-center"><p className="text-[8px] font-black uppercase">Present</p><p className="text-xl font-black text-emerald-400">{busStats.present}</p></div>
                  <div className="bg-white/5 p-4 rounded-2xl text-center"><p className="text-[8px] font-black uppercase">Absent</p><p className="text-xl font-black text-rose-400">{busStats.absent}</p></div>
               </div>
            </div>
            <div className="flex p-1 bg-slate-100 rounded-2xl">
              <button onClick={() => setFilterTab("present")} className={`flex-1 py-3 text-[10px] font-black uppercase rounded-xl transition-all ${filterTab === "present" ? "bg-white text-emerald-600 shadow-sm" : "text-slate-400"}`}>Present</button>
              <button onClick={() => setFilterTab("absent")} className={`flex-1 py-3 text-[10px] font-black uppercase rounded-xl transition-all ${filterTab === "absent" ? "bg-white text-rose-600 shadow-sm" : "text-slate-400"}`}>Absent</button>
            </div>
            <div className="space-y-2">
              {filteredList.map(person => {
                const personId = person._id || person.id || person.phone;
                const hasPhone = person.phone || person.number;
                const isExpanded = expandedId === personId;
                return (
                  <div key={personId} className="flex flex-col bg-white rounded-2xl border border-slate-100 overflow-hidden transition-all">
                    <div onClick={() => hasPhone && toggleExpand(personId)} className={`p-4 flex items-center justify-between ${hasPhone ? 'cursor-pointer active:bg-slate-50' : ''}`}>
                      <div className="flex flex-col">
                        <p className="font-black text-slate-900 text-sm">{person.name}</p>
                        <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest leading-none mt-0.5">{person.role}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        {/* Dropdown Indicator for members with phone numbers */}
                        {hasPhone && (isExpanded ? <ChevronUp size={14} className="text-slate-300" /> : <ChevronDown size={14} className="text-slate-300" />)}
                        {person.attendence?.[activeAtPoint] ? <CheckCircle2 className="text-emerald-500" size={18}/> : <UserX className="text-rose-400" size={18}/>}
                      </div>
                    </div>
                    {hasPhone && isExpanded && (
                      <div className="px-4 pb-4 pt-0 animate-in slide-in-from-top-2 duration-200">
                        <a href={`tel:${person.phone || person.number}`} className="flex items-center justify-center gap-2 w-full py-2 bg-emerald-50 text-emerald-600 rounded-xl font-black text-[10px] uppercase tracking-widest border border-emerald-100 transition-all active:scale-95"><Phone size={12} /> Call</a>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 md:p-6 z-40 pointer-events-none">
        <div className="max-w-md mx-auto bg-slate-900/95 backdrop-blur-2xl rounded-[30px] md:rounded-[35px] p-4 md:p-6 flex items-center justify-between pointer-events-auto shadow-2xl text-white border border-white/10">
          <div className="flex flex-col pl-1 md:pl-2">
            <p className="text-[8px] md:text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1 leading-tight">Total {session?.user?.zone}</p>
            <h2 className="text-white font-black text-xs md:text-sm uppercase tracking-tight truncate max-w-[100px] md:max-w-none">{currentSlot.label}</h2>
          </div>
          <div className="flex items-center gap-4 md:gap-8 pr-1 md:pr-2">
            <div className="flex flex-col items-center"><p className="text-[8px] md:text-[9px] text-emerald-500 font-black uppercase tracking-widest mb-1">Present</p><p className="text-xl md:text-2xl font-black text-white leading-none">{zoneTotals.present}</p></div>
            <div className="h-8 w-px bg-white/10 mx-1 md:mx-0" />
            <div className="flex flex-col items-center"><p className="text-[8px] md:text-[9px] text-rose-500 font-black uppercase tracking-widest mb-1">Absent</p><p className="text-xl md:text-2xl font-black text-white leading-none">{zoneTotals.absent}</p></div>
          </div>
        </div>
      </div>
    </div>
  );
}