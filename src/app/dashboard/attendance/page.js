// "use client";

// import { useSession } from "next-auth/react";
// import { useEffect, useState, useCallback, useMemo } from "react";
// import { ArrowLeft, Search, X, Loader2 } from "lucide-react";
// import Link from "next/link";
// import AttendanceRow from "@/components/AttendanceRow";

// const HighlightedText = ({ text, query }) => {
//   if (!query.trim()) return <span>{text}</span>;
//   const regex = new RegExp(`(${query})`, "gi");
//   const parts = text.split(regex);
//   return (
//     <span>
//       {parts.map((part, i) => 
//         regex.test(part) ? (
//           <span key={i} className="text-indigo-600 bg-indigo-50 px-0.5 rounded-sm font-bold">{part}</span>
//         ) : <span key={i}>{part}</span>
//       )}
//     </span>
//   );
// };

// export default function AttendancePage() {
//   const { data: session } = useSession();
//   const [members, setMembers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [isSearchOpen, setIsSearchOpen] = useState(false);

//   const fetchMembers = useCallback(async () => {
//     if (!session?.user?.busId) return;
//     setLoading(true);
//     try {
//       const rawBusId = String(session.user.busId);
//       const match = rawBusId.match(/(\d+(\.\d+)?)/);
//       const cleanBusId = match ? match[0] : rawBusId;
      
//       const res = await fetch(`/api/attendance?busId=${cleanBusId}`);
//       const data = await res.json();
      
//       // Ensure we only store unique members by their ID to prevent double counting
//       const uniqueData = Array.isArray(data) 
//         ? Array.from(new Map(data.map(item => [item.id, item])).values())
//         : [];
        
//       setMembers(uniqueData);
//     } catch (error) {
//       console.error("Fetch error:", error);
//       setMembers([]);
//     } finally {
//       setLoading(false);
//     }
//   }, [session]);

//   useEffect(() => {
//     if (session?.user?.busId) {
//       fetchMembers();
//     }
//   }, [session, fetchMembers]);

//   const handleToggle = async (ids, currentStatus) => {
//     const newStatus = !currentStatus;
    
//     // Optimistic UI Update: update state immediately
//     setMembers(prev => prev.map(m => 
//       ids.includes(m.id) ? { ...m, isPresent: newStatus } : m
//     ));

//     try {
//       const res = await fetch("/api/attendance", {
//         method: "PATCH",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ ids, isPresent: newStatus }),
//       });
      
//       if (!res.ok) throw new Error("Failed to update");
//     } catch (error) {
//       // Revert if API fails
//       fetchMembers();
//     }
//   };

//   const categorizedData = useMemo(() => {
//     const q = searchQuery.toLowerCase().trim();
//     const safeMembers = Array.isArray(members) ? members : [];

//     const filterAndSortBy = (gender, role) => {
//       const filtered = safeMembers.filter(m => 
//         m.gender === gender && 
//         m.role === role && 
//         (q === "" || m.name.toLowerCase().includes(q))
//       );

//       if (q !== "") {
//         return filtered.sort((a, b) => {
//           const aStarts = a.name.toLowerCase().startsWith(q);
//           const bStarts = b.name.toLowerCase().startsWith(q);
//           if (aStarts && !bStarts) return -1;
//           if (!aStarts && bStarts) return 1;
//           return a.name.localeCompare(b.name);
//         });
//       }
//       return filtered;
//     };

//     return {
//       male: {
//         karyakars: filterAndSortBy("male", "Bal Karyakar"),
//         sanchalaks: filterAndSortBy("male", "Vrund Sanchalak"),
//         balaks: filterAndSortBy("male", "Balak"),
//       },
//       female: {
//         karyakars: filterAndSortBy("female", "Balika Karyakar"),
//         sanchalaks: filterAndSortBy("female", "Vrund Sanchalak"),
//         balaks: filterAndSortBy("female", "Balika"),
//       }
//     };
//   }, [members, searchQuery]);

//   const stats = useMemo(() => {
//     const total = members.length;
//     const present = members.filter(m => m.isPresent).length;
//     return { 
//       total, 
//       present, 
//       percent: total > 0 ? Math.round((present / total) * 100) : 0 
//     };
//   }, [members]);

//   const hasSearchResults = useMemo(() => {
//     const d = categorizedData;
//     return (
//       d.male.karyakars.length > 0 || d.male.sanchalaks.length > 0 || d.male.balaks.length > 0 ||
//       d.female.karyakars.length > 0 || d.female.sanchalaks.length > 0 || d.female.balaks.length > 0
//     );
//   }, [categorizedData]);

//   if (loading) return (
//     <div className="flex h-screen flex-col items-center justify-center bg-white">
//       <div className="h-10 w-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
//     </div>
//   );

//   return (
//     <div className="min-h-screen bg-[#FDFDFF] pb-40">
//       <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-3xl border-b border-slate-100 px-6 py-6">
//         <div className="flex items-center justify-between">
//           {!isSearchOpen ? (
//             <>
//               <div className="flex items-center gap-4">
//                 <div className="h-10 w-10 rounded-full border-2 border-indigo-600 flex items-center justify-center font-black text-[10px]">
//                   {stats.percent}%
//                 </div>
//                 <h1 className="font-black text-xl tracking-tight leading-none uppercase">Bus {session?.user?.busId}</h1>
//               </div>
//               <div className="flex gap-2">
//                 <button onClick={() => setIsSearchOpen(true)} className="p-3 bg-slate-50 rounded-xl active:scale-90 transition-all"><Search size={20}/></button>
//                 <Link href="/dashboard" className="p-3 bg-slate-50 rounded-xl active:scale-90 transition-all"><ArrowLeft size={20}/></Link>
//               </div>
//             </>
//           ) : (
//             <div className="flex items-center w-full gap-2 animate-in fade-in slide-in-from-top-2">
//               <input 
//                 autoFocus 
//                 className="flex-1 h-12 bg-slate-100 rounded-xl px-4 font-bold outline-none text-slate-900" 
//                 placeholder="Find name..." 
//                 value={searchQuery} 
//                 onChange={(e) => setSearchQuery(e.target.value.replace(/[^a-zA-Z\s]/g, ""))} 
//               />
//               <button onClick={() => {setIsSearchOpen(false); setSearchQuery("");}} className="p-3 bg-indigo-600 text-white rounded-xl"><X size={20}/></button>
//             </div>
//           )}
//         </div>
//       </div>

//       <div className="px-6 max-w-2xl mx-auto">
//         {!hasSearchResults && searchQuery !== "" ? (
//           <div className="mt-20 text-center animate-in fade-in zoom-in duration-300">
//              <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
//                 <Search className="text-slate-300" size={30} />
//              </div>
//              <p className="text-slate-900 font-black text-lg">No matches found</p>
//              <p className="text-slate-400 text-sm font-medium">We couldn't find anyone named "{searchQuery}"</p>
//           </div>
//         ) : (
//           <>
//             {/* MALE SECTION */}
//             {(categorizedData.male.karyakars.length > 0 || categorizedData.male.sanchalaks.length > 0 || categorizedData.male.balaks.length > 0) && (
//               <>
//                 <div className="mt-8 mb-4 p-3 bg-blue-50 text-blue-700 rounded-xl font-black text-center text-[10px] tracking-[0.3em]">MALE SECTION</div>
//                 {/* Lists mapped same as before */}
//                 {categorizedData.male.karyakars.length > 0 && (
//                   <div className="mb-6">
//                     <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Bal Karyakar</h3>
//                     {categorizedData.male.karyakars.map(p => <AttendanceRow key={p.id} person={p} onToggle={handleToggle} searchQuery={searchQuery} highlightComponent={HighlightedText} />)}
//                   </div>
//                 )}
//                 {categorizedData.male.sanchalaks.length > 0 && (
//                   <div className="mb-6">
//                     <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Vrund Sanchalak</h3>
//                     {categorizedData.male.sanchalaks.map(p => <AttendanceRow key={p.id} person={p} onToggle={handleToggle} searchQuery={searchQuery} highlightComponent={HighlightedText} />)}
//                   </div>
//                 )}
//                 {categorizedData.male.balaks.length > 0 && (
//                   <div className="mb-10">
//                     <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Balak</h3>
//                     {categorizedData.male.balaks.map(p => <AttendanceRow key={p.id} person={p} onToggle={handleToggle} searchQuery={searchQuery} highlightComponent={HighlightedText} />)}
//                   </div>
//                 )}
//               </>
//             )}

//             {/* FEMALE SECTION */}
//             {(categorizedData.female.karyakars.length > 0 || categorizedData.female.sanchalaks.length > 0 || categorizedData.female.balaks.length > 0) && (
//               <>
//                 <div className="mt-8 mb-4 p-3 bg-pink-50 text-pink-700 rounded-xl font-black text-center text-[10px] tracking-[0.3em]">FEMALE SECTION</div>
//                 {categorizedData.female.karyakars.length > 0 && (
//                   <div className="mb-6">
//                     <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Balika Karyakar</h3>
//                     {categorizedData.female.karyakars.map(p => <AttendanceRow key={p.id} person={p} onToggle={handleToggle} searchQuery={searchQuery} highlightComponent={HighlightedText} />)}
//                   </div>
//                 )}
//                 {categorizedData.female.sanchalaks.length > 0 && (
//                   <div className="mb-6">
//                     <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Vrund Sanchalak</h3>
//                     {categorizedData.female.sanchalaks.map(p => <AttendanceRow key={p.id} person={p} onToggle={handleToggle} searchQuery={searchQuery} highlightComponent={HighlightedText} />)}
//                   </div>
//                 )}
//                 {categorizedData.female.balaks.length > 0 && (
//                   <div>
//                     <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Balika</h3>
//                     {categorizedData.female.balaks.map(p => <AttendanceRow key={p.id} person={p} onToggle={handleToggle} searchQuery={searchQuery} highlightComponent={HighlightedText} />)}
//                   </div>
//                 )}
//               </>
//             )}
//           </>
//         )}
//       </div>

//       <div className="fixed bottom-0 left-0 right-0 p-6 z-40 pointer-events-none">
//         <div className="max-w-md mx-auto bg-slate-900/95 backdrop-blur-2xl rounded-[32px] p-3 flex items-center justify-between pointer-events-auto shadow-2xl">
//           <div className="flex items-center gap-6 pl-5 text-white">
//             <div><p className="text-[9px] text-slate-500 uppercase tracking-widest">Present</p><p className="text-xl font-black">{stats.present}</p></div>
//             <div className="h-10 w-px bg-white/10" />
//             <div><p className="text-[9px] text-slate-500 uppercase tracking-widest">Absent</p><p className="text-xl font-black text-rose-500">{stats.total - stats.present}</p></div>
//           </div>
//           <Link href="/dashboard/tally" className="bg-indigo-600 px-8 py-4 rounded-2xl text-white font-black uppercase text-[10px] tracking-widest active:scale-95 transition-all">Tally</Link>
//         </div>
//       </div>
//     </div>
//   );
// }











//ai
// "use client";

// import { useSession } from "next-auth/react";
// import { useEffect, useState, useCallback, useMemo } from "react";
// import { ArrowLeft, Search, X, Loader2, MapPin, Navigation, Home, Bus } from "lucide-react";
// import Link from "next/link";
// import AttendanceRow from "@/components/AttendanceRow";

// const HighlightedText = ({ text, query }) => {
//   if (!query.trim()) return <span>{text}</span>;
//   const regex = new RegExp(`(${query})`, "gi");
//   const parts = text.split(regex);
//   return (
//     <span>
//       {parts.map((part, i) => 
//         regex.test(part) ? (
//           <span key={i} className="text-indigo-600 bg-indigo-50 px-0.5 rounded-sm font-bold">{part}</span>
//         ) : <span key={i}>{part}</span>
//       )}
//     </span>
//   );
// };

// const SLOT_CONFIG = {
//   At_1: { label: "Source Pickup", icon: MapPin, color: "text-indigo-600", bg: "bg-indigo-50", desc: "Marking for Source → Bus" },
//   At_2: { label: "Destination Drop", icon: Navigation, color: "text-emerald-600", bg: "bg-emerald-50", desc: "Marking for Bus → Destination" },
//   At_3: { label: "Return Boarding", icon: Bus, color: "text-amber-600", bg: "bg-amber-50", desc: "Marking for Destination → Bus" },
//   At_4: { label: "Final Drop-off", icon: Home, color: "text-rose-600", bg: "bg-rose-50", desc: "Marking for Bus → Source" }
// };

// export default function AttendancePage() {
//   const { data: session } = useSession();
//   const [members, setMembers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [isSearchOpen, setIsSearchOpen] = useState(false);
//   const [activeAtPoint, setActiveAtPoint] = useState("At_1");

//   const currentSlot = SLOT_CONFIG[activeAtPoint];

//   const fetchMembers = useCallback(async () => {
//     if (!session?.user?.busId) return;
//     setLoading(true);
//     try {
//       const cleanBusId = String(session.user.busId);
//       const res = await fetch(`/api/attendance?busId=${cleanBusId}`, { cache: 'no-store' });
//       const data = await res.json();
//       setMembers(Array.isArray(data) ? data : []);
//     } catch (error) {
//       console.error("Fetch error:", error);
//     } finally {
//       setLoading(false);
//     }
//   }, [session]);

//   useEffect(() => {
//     if (session?.user?.busId) fetchMembers();
//   }, [session, fetchMembers]);

//   const handleToggle = async (uniqueKey, slotKey, currentStatus) => {
//     const newStatus = !currentStatus;
//     setMembers(prevMembers => prevMembers.map(member => {
//       const mKey = member.id || member.phone;
//       if (mKey === uniqueKey) {
//         return { ...member, attendence: { ...member.attendence, [slotKey]: newStatus } };
//       }
//       return member;
//     }));

//     try {
//       await fetch("/api/attendance", {
//         method: "PATCH",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ ids: [uniqueKey], attendanceKey: slotKey, status: newStatus }),
//       });
//     } catch (error) {
//       fetchMembers(); 
//     }
//   };

//   const categorizedData = useMemo(() => {
//     const q = searchQuery.toLowerCase().trim();
//     const filterBy = (gender, roles) => {
//       return members.filter(m => 
//         m.gender?.toLowerCase() === gender.toLowerCase() && 
//         roles.includes(m.role?.toLowerCase()) && 
//         (q === "" || m.name.toLowerCase().includes(q))
//       );
//     };

//     return {
//       male: {
//         staff: filterBy("male", ["balak care taker", "bal karyakar", "vrund sanchalak", "balika care taker", "balika karyakar"]),
//         balaks: filterBy("male", ["balak"]),
//       },
//       female: {
//         staff: filterBy("female", ["balika care taker", "balika karyakar", "vrund sanchalak", "balak care taker", "bal karyakar"]),
//         balaks: filterBy("female", ["balika"]),
//       }
//     };
//   }, [members, searchQuery]);

//   const stats = useMemo(() => {
//     const total = members.length;
//     const present = members.filter(m => m.attendence?.[activeAtPoint] === true).length;
//     return { total, present, percent: total > 0 ? Math.round((present / total) * 100) : 0 };
//   }, [members, activeAtPoint]);

//   if (loading) return <div className="flex h-screen items-center justify-center bg-white"><Loader2 className="animate-spin text-indigo-600" size={32} /></div>;

//   return (
//     <div className="min-h-screen bg-[#FDFDFF] pb-40">
//       <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-3xl border-b border-slate-100">
//         <div className="px-6 py-6 flex items-center justify-between">
//           {!isSearchOpen ? (
//             <>
//               <div className="flex items-center gap-4">
//                 <div className={`h-10 w-10 rounded-full border-2 ${currentSlot.color.replace('text', 'border')} flex items-center justify-center font-black text-[10px]`}>{stats.percent}%</div>
//                 <div className="flex flex-col">
//                     <h1 className="font-black text-lg tracking-tight uppercase leading-none text-slate-900">Bus {session?.user?.busId}</h1>
//                     <span className={`text-[8px] font-black uppercase tracking-widest mt-1 ${currentSlot.color}`}>{currentSlot.label}</span>
//                 </div>
//               </div>
//               <div className="flex gap-2">
//                 <button onClick={() => setIsSearchOpen(true)} className="p-3 bg-slate-50 rounded-xl"><Search size={20}/></button>
//                 <Link href="/dashboard" className="p-3 bg-slate-50 rounded-xl"><ArrowLeft size={20}/></Link>
//               </div>
//             </>
//           ) : (
//             <div className="flex items-center w-full gap-2 px-2">
//               <input autoFocus className="flex-1 h-12 bg-slate-100 rounded-xl px-4 font-bold outline-none" placeholder="Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
//               <button onClick={() => {setIsSearchOpen(false); setSearchQuery("");}} className="p-3 bg-indigo-600 text-white rounded-xl"><X size={20}/></button>
//             </div>
//           )}
//         </div>

//         <div className="flex px-6 pb-4 gap-2 overflow-x-auto no-scrollbar">
//           {Object.entries(SLOT_CONFIG).map(([key, config]) => {
//             const isActive = activeAtPoint === key;
//             return (
//                 <button 
//                     key={key} 
//                     onClick={() => setActiveAtPoint(key)} 
//                     className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border-2 whitespace-nowrap ${isActive ? `${config.bg} ${config.color} ${config.color.replace('text', 'border')} shadow-sm scale-105` : 'bg-white border-slate-100 text-slate-300'}`}
//                 >
//                     <config.icon size={12} />
//                     A{key.split('_')[1]}
//                 </button>
//             )
//           })}
//         </div>
//       </div>

//       <div className={`mx-6 mt-6 p-4 rounded-3xl border-2 border-dashed flex items-center gap-3 ${currentSlot.bg} ${currentSlot.color.replace('text', 'border')} opacity-90 animate-in fade-in slide-in-from-top-4`}>
//           <currentSlot.icon size={20} className={currentSlot.color} />
//           <div>
//               <p className={`text-[10px] font-black uppercase tracking-[0.1em] leading-none mb-1 ${currentSlot.color}`}>{currentSlot.label}</p>
//               <p className="text-[10px] font-bold text-slate-500">{currentSlot.desc}</p>
//           </div>
//       </div>

//       <div className="px-6 max-w-2xl mx-auto">
//         {/* MALE STAFF */}
//         {categorizedData.male.staff.length > 0 && (
//           <div className="mt-10">
//             <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 ml-1">Male Staff & Karyakars</h3>
//             {categorizedData.male.staff.map(p => <AttendanceRow key={p.id || p.phone} person={p} onToggle={handleToggle} searchQuery={searchQuery} highlightComponent={HighlightedText} activeSlot={activeAtPoint} />)}
//           </div>
//         )}
        
//         {/* MALE BALAKS */}
//         {categorizedData.male.balaks.length > 0 && (
//           <div className="mt-10">
//             <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 ml-1">Male Balaks</h3>
//             {categorizedData.male.balaks.map(p => <AttendanceRow key={p.id} person={p} onToggle={handleToggle} searchQuery={searchQuery} highlightComponent={HighlightedText} activeSlot={activeAtPoint} />)}
//           </div>
//         )}

//         {/* FEMALE STAFF */}
//         {categorizedData.female.staff.length > 0 && (
//           <div className="mt-10">
//             <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 ml-1">Female Staff & Karyakars</h3>
//             {categorizedData.female.staff.map(p => <AttendanceRow key={p.id || p.phone} person={p} onToggle={handleToggle} searchQuery={searchQuery} highlightComponent={HighlightedText} activeSlot={activeAtPoint} />)}
//           </div>
//         )}

//         {/* FEMALE BALIKAS */}
//         {categorizedData.female.balaks.length > 0 && (
//           <div className="mt-10">
//             <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 ml-1">Female Balikas</h3>
//             {categorizedData.female.balaks.map(p => <AttendanceRow key={p.id} person={p} onToggle={handleToggle} searchQuery={searchQuery} highlightComponent={HighlightedText} activeSlot={activeAtPoint} />)}
//           </div>
//         )}
//       </div>

//       {/* Floating Footer - Dynamic Slot Name */}
//       <div className="fixed bottom-0 left-0 right-0 p-6 z-40 pointer-events-none">
//         <div className="max-w-md mx-auto bg-slate-900/95 backdrop-blur-2xl rounded-[35px] p-4 flex items-center justify-between pointer-events-auto shadow-2xl text-white">
//           <div className="flex items-center gap-6 pl-4">
//             <div>
//               <p className={`text-[9px] uppercase font-black tracking-widest mb-1 ${currentSlot.color}`}>{currentSlot.label}</p>
//               <p className="text-2xl font-black">{stats.present}</p>
//             </div>
//             <div className="h-10 w-px bg-white/10" />
//             <div>
//               <p className="text-[9px] text-slate-500 uppercase font-black tracking-widest mb-1">Total</p>
//               <p className="text-2xl font-black">{stats.total}</p>
//             </div>
//           </div>
//           <Link href="/dashboard/tally" className="bg-indigo-600 px-8 py-4 rounded-[22px] font-black uppercase text-[11px] tracking-widest active:scale-95 transition-all shadow-lg shadow-indigo-500/20">Tally</Link>
//         </div>
//       </div>
//     </div>
//   );
// }









//ai2
// "use client";

// import { useSession } from "next-auth/react";
// import { useEffect, useState, useCallback, useMemo } from "react";
// import { ArrowLeft, Search, X, Loader2, MapPin, Navigation, Home, Bus, Users, ShieldCheck, Heart, UserCheck, ChevronRight, Baby } from "lucide-react";
// import Link from "next/link";
// import AttendanceRow from "../../../components/AttendanceRow";

// const HighlightedText = ({ text, query }) => {
//   if (!query.trim()) return <span>{text}</span>;
//   const regex = new RegExp(`(${query})`, "gi");
//   const parts = text.split(regex);
//   return (
//     <span>
//       {parts.map((part, i) => 
//         regex.test(part) ? (
//           <span key={i} className="text-indigo-600 bg-indigo-50 px-0.5 rounded-sm font-bold">{part}</span>
//         ) : <span key={i}>{part}</span>
//       )}
//     </span>
//   );
// };

// const SLOT_CONFIG = {
//   At_1: { label: "Source Pickup", icon: MapPin, color: "text-indigo-600", bg: "bg-indigo-50", desc: "Source → Bus" },
//   At_2: { label: "Destination Drop", icon: Navigation, color: "text-emerald-600", bg: "bg-emerald-50", desc: "Bus → Destination" },
//   At_3: { label: "Return Boarding", icon: Bus, color: "text-amber-600", bg: "bg-amber-50", desc: "Destination → Bus" },
//   At_4: { label: "Final Drop-off", icon: Home, color: "text-rose-600", bg: "bg-rose-50", desc: "Bus → Source" }
// };

// export default function AttendancePage() {
//   const { data: session } = useSession();
//   const [members, setMembers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [isSearchOpen, setIsSearchOpen] = useState(false);
//   const [activeAtPoint, setActiveAtPoint] = useState("At_1");

//   const currentSlot = SLOT_CONFIG[activeAtPoint];

//   const fetchMembers = useCallback(async () => {
//     if (!session?.user?.busId) return;
//     setLoading(true);
//     try {
//       const cleanBusId = String(session.user.busId);
//       const res = await fetch(`/api/attendance?busId=${cleanBusId}`, { cache: 'no-store' });
//       const data = await res.json();
//       setMembers(Array.isArray(data) ? data : []);
//     } catch (error) {
//       console.error("Fetch error:", error);
//     } finally {
//       setLoading(false);
//     }
//   }, [session]);

//   useEffect(() => {
//     if (session?.user?.busId) fetchMembers();
//   }, [session, fetchMembers]);

//   const handleToggle = async (uniqueKey, slotKey, currentStatus) => {
//     const newStatus = !currentStatus;
//     setMembers(p => p.map(m => (m.id || m.phone) === uniqueKey ? { ...m, attendence: { ...m.attendence, [slotKey]: newStatus } } : m));
//     try {
//       await fetch("/api/attendance", {
//         method: "PATCH",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ ids: [uniqueKey], attendanceKey: slotKey, status: newStatus }),
//       });
//     } catch (e) { fetchMembers(); }
//   };

//   const categorizedData = useMemo(() => {
//     const q = searchQuery.toLowerCase().trim();
//     const filterBy = (gender, role) => members.filter(m => 
//         m.gender?.toLowerCase() === gender.toLowerCase() && 
//         m.role?.toLowerCase() === role.toLowerCase() && 
//         (q === "" || m.name.toLowerCase().includes(q))
//     );

//     return {
//       male: {
//         caretaker: filterBy("male", "balak care taker"),
//         balak: filterBy("male", "balak"),
//         karyakar: filterBy("male", "bal karyakar"),
//       },
//       female: {
//         caretaker: filterBy("female", "balika care taker"),
//         balika: filterBy("female", "balika"),
//         karyakar: filterBy("female", "balika karyakar"),
//       }
//     };
//   }, [members, searchQuery]);

//   const stats = useMemo(() => {
//     const total = members.length;
//     const present = members.filter(m => m.attendence?.[activeAtPoint] === true).length;
//     return { total, present, percent: total > 0 ? Math.round((present / total) * 100) : 0 };
//   }, [members, activeAtPoint]);

//   // UI UPDATE: Role sections are now encapsulated in stylized divs
//   const renderSection = (title, data, SectionIcon, colorClass) => {
//     if (data.length === 0) return null;
//     return (
//       <div className="bg-slate-50/50 rounded-[32px] p-2 border border-slate-100">
//         <div className="flex items-center gap-3 px-4 py-4">
//           <div className={`h-8 w-8 rounded-lg bg-white shadow-sm flex items-center justify-center ${colorClass}`}>
//             <SectionIcon size={18} />
//           </div>
//           <h3 className="text-sm font-black text-slate-800 uppercase tracking-tight">{title}</h3>
//           <div className="ml-auto bg-slate-200/50 px-2.5 py-1 rounded-full text-[10px] font-black text-slate-500">
//             {data.length}
//           </div>
//         </div>
//         <div className="space-y-1">
//           {data.map(p => (
//             <AttendanceRow 
//               key={p.id || p.phone} 
//               person={p} 
//               onToggle={handleToggle} 
//               searchQuery={searchQuery} 
//               highlightComponent={HighlightedText} 
//               activeSlot={activeAtPoint} 
//             />
//           ))}
//         </div>
//       </div>
//     );
//   };

//   if (loading) return <div className="flex h-screen items-center justify-center bg-white"><Loader2 className="animate-spin text-indigo-600" /></div>;

//   return (
//     <div className="min-h-screen bg-[#FDFDFF] pb-40">
//       {/* Top Navigation */}
//       <div className="sticky top-0 z-30 bg-white/90 backdrop-blur-xl border-b border-slate-100">
//         <div className="px-6 py-6 flex items-center justify-between">
//           {!isSearchOpen ? (
//             <>
//               <div className="flex items-center gap-4">
//                 <div className={`h-11 w-11 rounded-2xl border-2 ${currentSlot.color.replace('text', 'border')} flex items-center justify-center font-black text-xs shadow-sm bg-white`}>{stats.percent}%</div>
//                 <div className="flex flex-col">
//                     <h1 className="font-black text-lg tracking-tight uppercase leading-none text-slate-900">Bus {session?.user?.busId}</h1>
//                     <span className={`text-[9px] font-black uppercase tracking-widest mt-1 ${currentSlot.color}`}>{currentSlot.label}</span>
//                 </div>
//               </div>
//               <div className="flex gap-2">
//                 <button onClick={() => setIsSearchOpen(true)} className="p-3 bg-slate-50 text-slate-400 rounded-2xl active:scale-90 transition-all"><Search size={20}/></button>
//                 <Link href="/dashboard" className="p-3 bg-slate-50 text-slate-400 rounded-2xl active:scale-90 transition-all"><ArrowLeft size={20}/></Link>
//               </div>
//             </>
//           ) : (
//             <div className="flex items-center w-full gap-2 animate-in slide-in-from-top-2">
//               <input autoFocus className="flex-1 h-12 bg-slate-100 rounded-2xl px-5 font-bold outline-none text-slate-900" placeholder="Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
//               <button onClick={() => {setIsSearchOpen(false); setSearchQuery("");}} className="p-3 bg-slate-900 text-white rounded-2xl"><X size={20}/></button>
//             </div>
//           )}
//         </div>

//         <div className="flex px-6 pb-5 gap-3 overflow-x-auto no-scrollbar">
//           {Object.entries(SLOT_CONFIG).map(([key, config]) => (
//             <button key={key} onClick={() => setActiveAtPoint(key)} className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border-2 whitespace-nowrap ${activeAtPoint === key ? `${config.bg} ${config.color} ${config.color.replace('text', 'border')} shadow-md` : 'bg-white border-transparent text-slate-300'}`}>
//                 <config.icon size={14} /> A{key.split('_')[1]}
//             </button>
//           ))}
//         </div>
//       </div>

//       <div className="px-6 max-w-2xl mx-auto space-y-12 pt-8">
        
//         {/* MALE GROUP */}
//         {(categorizedData.male.caretaker.length > 0 || categorizedData.male.balak.length > 0 || categorizedData.male.karyakar.length > 0) && (
//           <div className="space-y-6">
//             <div className="flex items-center gap-3 px-2">
//               <div className="h-6 w-1.5 bg-blue-500 rounded-full" />
//               <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Bal Mandal</h2>
//             </div>
//             <div className="space-y-6">
//               {renderSection("Balak care taker", categorizedData.male.caretaker, ShieldCheck, "text-blue-500")}
//               {renderSection("Balak", categorizedData.male.balak, Baby, "text-rose-500")}
//               {renderSection("Bal karyakar", categorizedData.male.karyakar, UserCheck, "text-indigo-500")}
//             </div>
//           </div>
//         )}

//         {/* FEMALE GROUP */}
//         {(categorizedData.female.caretaker.length > 0 || categorizedData.female.balika.length > 0 || categorizedData.female.karyakar.length > 0) && (
//           <div className="space-y-6">
//             <div className="flex items-center gap-3 px-2">
//               <div className="h-6 w-1.5 bg-pink-500 rounded-full" />
//               <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Balika Mandal</h2>
//             </div>
//             <div className="space-y-6">
//               {renderSection("Balika care taker", categorizedData.female.caretaker, ShieldCheck, "text-pink-500")}
//               {renderSection("Balika", categorizedData.female.balika, Baby, "text-rose-500")}
//               {renderSection("Balika karyakar", categorizedData.female.karyakar, UserCheck, "text-purple-500")}
//             </div>
//           </div>
//         )}

//       </div>

//       {/* Floating Footer */}
//       <div className="fixed bottom-0 left-0 right-0 p-6 z-40 pointer-events-none">
//         <div className="max-w-md mx-auto bg-slate-900/95 backdrop-blur-2xl rounded-[35px] p-4 flex items-center justify-between pointer-events-auto shadow-2xl text-white">
//           <div className="flex items-center gap-6 pl-4">
//             <div>
//               <p className={`text-[9px] uppercase font-black tracking-widest mb-1 ${currentSlot.color}`}>{currentSlot.label}</p>
//               <p className="text-2xl font-black">{stats.present} <span className="text-slate-500 text-sm font-bold">/ {stats.total}</span></p>
//             </div>
//           </div>
//           <Link href="/dashboard/tally" className="bg-indigo-600 px-8 py-4 rounded-[22px] font-black uppercase text-[11px] tracking-widest shadow-lg shadow-indigo-500/20 active:scale-95 transition-all">Final Tally</Link>
//         </div>
//       </div>
//     </div>
//   );
// }

// // deployment-fix-v3







//final
"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState, useCallback, useMemo } from "react";
import { ArrowLeft, Search, X, Loader2, MapPin, Navigation, Home, Bus, ShieldCheck, UserCheck, Baby } from "lucide-react";
import Link from "next/link";
import AttendanceRow from "../../../components/AttendanceRow";

const HighlightedText = ({ text, query }) => {
  if (!query.trim()) return <span>{text}</span>;
  const regex = new RegExp(`(${query})`, "gi");
  const parts = text.split(regex);
  return (
    <span>
      {parts.map((part, i) => 
        regex.test(part) ? (
          <span key={i} className="text-indigo-600 bg-indigo-50 px-0.5 rounded-sm font-bold">{part}</span>
        ) : <span key={i}>{part}</span>
      )}
    </span>
  );
};

const SLOT_CONFIG = {
  At_1: { label: "Source Pickup", icon: MapPin, color: "text-indigo-600", bg: "bg-indigo-50", desc: "Source → Bus" },
  At_2: { label: "Destination Drop", icon: Navigation, color: "text-emerald-600", bg: "bg-emerald-50", desc: "Bus → Destination" },
  At_3: { label: "Return Boarding", icon: Bus, color: "text-amber-600", bg: "bg-amber-50", desc: "Destination → Bus" },
  At_4: { label: "Final Drop-off", icon: Home, color: "text-rose-600", bg: "bg-rose-50", desc: "Bus → Source" }
};

export default function AttendancePage() {
  const { data: session } = useSession();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [activeAtPoint, setActiveAtPoint] = useState("At_1");

  const currentSlot = SLOT_CONFIG[activeAtPoint];

  const fetchMembers = useCallback(async () => {
    if (!session?.user?.busId) return;
    setLoading(true);
    try {
      const cleanBusId = String(session.user.busId);
      const res = await fetch(`/api/attendance?busId=${cleanBusId}`, { cache: 'no-store' });
      const data = await res.json();
      setMembers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  }, [session]);

  useEffect(() => {
    if (session?.user?.busId) fetchMembers();
  }, [session, fetchMembers]);

  const handleToggle = async (uniqueKey, slotKey, currentStatus) => {
    const newStatus = !currentStatus;
    
    // CASCADING LOGIC: If A3 is set to False, A4 MUST become False
    const updates = { [slotKey]: newStatus };
    if (slotKey === "At_3" && newStatus === false) {
      updates["At_4"] = false;
    }

    // Update Local State
    setMembers(p => p.map(m => (m.id || m.phone) === uniqueKey 
      ? { ...m, attendence: { ...m.attendence, ...updates } } 
      : m
    ));

    try {
      // 1. Primary Update
      await fetch("/api/attendance", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: [uniqueKey], attendanceKey: slotKey, status: newStatus }),
      });

      // 2. Cascade Update (A3 False -> A4 False)
      if (slotKey === "At_3" && newStatus === false) {
        await fetch("/api/attendance", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ids: [uniqueKey], attendanceKey: "At_4", status: false }),
        });
      }
    } catch (e) { 
      fetchMembers(); 
    }
  };

  const categorizedData = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    const filterBy = (gender, role) => members.filter(m => 
        m.gender?.toLowerCase() === gender.toLowerCase() && 
        m.role?.toLowerCase() === role.toLowerCase() && 
        (q === "" || m.name.toLowerCase().includes(q))
    );

    return {
      male: {
        caretaker: filterBy("male", "balak care taker"),
        balak: filterBy("male", "balak"),
        karyakar: filterBy("male", "bal karyakar"),
      },
      female: {
        caretaker: filterBy("female", "balika care taker"),
        balika: filterBy("female", "balika"),
        karyakar: filterBy("female", "balika karyakar"),
      }
    };
  }, [members, searchQuery]);

  const stats = useMemo(() => {
    const total = members.length;
    const present = members.filter(m => m.attendence?.[activeAtPoint] === true).length;
    return { total, present, percent: total > 0 ? Math.round((present / total) * 100) : 0 };
  }, [members, activeAtPoint]);

  const renderSection = (title, data, SectionIcon, colorClass) => {
    if (data.length === 0) return null;
    return (
      <div className="bg-slate-50/50 rounded-[32px] p-2 border border-slate-100">
        <div className="flex items-center gap-3 px-4 py-4">
          <div className={`h-8 w-8 rounded-lg bg-white shadow-sm flex items-center justify-center ${colorClass}`}>
            <SectionIcon size={18} />
          </div>
          <h3 className="text-sm font-black text-slate-800 uppercase tracking-tight">{title}</h3>
          <div className="ml-auto bg-slate-200/50 px-2.5 py-1 rounded-full text-[10px] font-black text-slate-500">
            {data.length}
          </div>
        </div>
        <div className="space-y-1">
          {data.map(p => (
            <AttendanceRow 
              key={p.id || p.phone} 
              person={p} 
              onToggle={handleToggle} 
              searchQuery={searchQuery} 
              highlightComponent={HighlightedText} 
              activeSlot={activeAtPoint} 
            />
          ))}
        </div>
      </div>
    );
  };

  if (loading) return <div className="flex h-screen items-center justify-center bg-white"><Loader2 className="animate-spin text-indigo-600" /></div>;

  return (
    <div className="min-h-screen bg-[#FDFDFF] pb-40">
      <div className="sticky top-0 z-30 bg-white/90 backdrop-blur-xl border-b border-slate-100">
        <div className="px-6 py-6 flex items-center justify-between">
          {!isSearchOpen ? (
            <>
              <div className="flex items-center gap-4">
                <div className={`h-11 w-11 rounded-2xl border-2 ${currentSlot.color.replace('text', 'border')} flex items-center justify-center font-black text-xs shadow-sm bg-white`}>{stats.percent}%</div>
                <div className="flex flex-col">
                    <h1 className="font-black text-lg tracking-tight uppercase leading-none text-slate-900">Bus {session?.user?.busId}</h1>
                    <span className={`text-[9px] font-black uppercase tracking-widest mt-1 ${currentSlot.color}`}>{currentSlot.label}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setIsSearchOpen(true)} className="p-3 bg-slate-50 text-slate-400 rounded-2xl active:scale-90 transition-all"><Search size={20}/></button>
                <Link href="/dashboard" className="p-3 bg-slate-50 text-slate-400 rounded-2xl active:scale-90 transition-all"><ArrowLeft size={20}/></Link>
              </div>
            </>
          ) : (
            <div className="flex items-center w-full gap-2 animate-in slide-in-from-top-2">
              <input autoFocus className="flex-1 h-12 bg-slate-100 rounded-2xl px-5 font-bold outline-none text-slate-900" placeholder="Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
              <button onClick={() => {setIsSearchOpen(false); setSearchQuery("");}} className="p-3 bg-slate-900 text-white rounded-2xl"><X size={20}/></button>
            </div>
          )}
        </div>

        <div className="flex px-6 pb-5 gap-3 overflow-x-auto no-scrollbar">
          {Object.entries(SLOT_CONFIG).map(([key, config]) => (
            <button key={key} onClick={() => setActiveAtPoint(key)} className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border-2 whitespace-nowrap ${activeAtPoint === key ? `${config.bg} ${config.color} ${config.color.replace('text', 'border')} shadow-md` : 'bg-white border-transparent text-slate-300'}`}>
                <config.icon size={14} /> A{key.split('_')[1]}
            </button>
          ))}
        </div>
      </div>

      <div className="px-6 max-w-2xl mx-auto space-y-12 pt-8">
        {(categorizedData.male.caretaker.length > 0 || categorizedData.male.balak.length > 0 || categorizedData.male.karyakar.length > 0) && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 px-2">
              <div className="h-6 w-1.5 bg-blue-500 rounded-full" />
              <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Bal Mandal</h2>
            </div>
            <div className="space-y-6">
              {renderSection("Balak care taker", categorizedData.male.caretaker, ShieldCheck, "text-blue-500")}
              {renderSection("Balak", categorizedData.male.balak, Baby, "text-rose-500")}
              {renderSection("Bal karyakar", categorizedData.male.karyakar, UserCheck, "text-indigo-500")}
            </div>
          </div>
        )}

        {(categorizedData.female.caretaker.length > 0 || categorizedData.female.balika.length > 0 || categorizedData.female.karyakar.length > 0) && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 px-2">
              <div className="h-6 w-1.5 bg-pink-500 rounded-full" />
              <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Balika Mandal</h2>
            </div>
            <div className="space-y-6">
              {renderSection("Balika care taker", categorizedData.female.caretaker, ShieldCheck, "text-pink-500")}
              {renderSection("Balika", categorizedData.female.balika, Baby, "text-rose-500")}
              {renderSection("Balika karyakar", categorizedData.female.karyakar, UserCheck, "text-purple-500")}
            </div>
          </div>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-6 z-40 pointer-events-none">
        <div className="max-w-md mx-auto bg-slate-900/95 backdrop-blur-2xl rounded-[35px] p-4 flex items-center justify-between pointer-events-auto shadow-2xl text-white">
          <div className="flex items-center gap-6 pl-4">
            <div>
              <p className={`text-[9px] uppercase font-black tracking-widest mb-1 ${currentSlot.color}`}>{currentSlot.label}</p>
              <p className="text-2xl font-black">{stats.present} <span className="text-slate-500 text-sm font-bold">/ {stats.total}</span></p>
            </div>
          </div>
          <Link href="/dashboard/tally" className="bg-indigo-600 px-8 py-4 rounded-[22px] font-black uppercase text-[11px] tracking-widest shadow-lg shadow-indigo-500/20 active:scale-95 transition-all">Final Tally</Link>
        </div>
      </div>
    </div>
  );
}
