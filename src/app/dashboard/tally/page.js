// "use client";
// import { useSession } from "next-auth/react";
// import { useEffect, useState, useRef } from "react";
// import { ArrowLeft, CheckCircle2, Download, FileText, UserCircle, Loader2 } from "lucide-react";
// import Link from "next/link";
// import { toast } from "sonner";

// export default function TallyPage() {
//   const { data: session } = useSession();
//   const [members, setMembers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [isDownloading, setIsDownloading] = useState(false);
//   const [filterTab, setFilterTab] = useState("present"); // "present" or "absent"
//   const reportRef = useRef(null);

//   useEffect(() => {
//     const fetchStats = async () => {
//       if (!session?.user?.busId) return;
//       try {
//         const cleanBusId = String(session.user.busId).replace(/[^0-9.]/g, "");
//         const res = await fetch(`/api/attendance?busId=${cleanBusId}`);
//         const data = await res.json();
        
//         const uniqueData = Array.isArray(data) 
//           ? Array.from(new Map(data.map(item => [item.id, item])).values())
//           : [];
//         setMembers(uniqueData);
//       } catch (err) {
//         toast.error("Failed to load report data");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchStats();
//   }, [session]);

//   const handleDownload = async () => {
//     if (isDownloading || !reportRef.current) return;
//     setIsDownloading(true);
//     const toastId = toast.loading("Generating PDF...", { position: "top-center" });

//     try {
//       const html2pdf = (await import("html2pdf.js")).default;
//       const element = reportRef.current;
//       const dateStr = new Date().toLocaleDateString('en-GB').replace(/\//g, '-');
      
//       const opt = {
//         margin: [10, 5, 10, 5],
//         filename: `Bus_${session?.user?.busId}_${filterTab}_List_${dateStr}.pdf`,
//         image: { type: 'jpeg', quality: 0.98 },
//         html2canvas: { 
//           scale: 2, 
//           useCORS: true, 
//           letterRendering: true,
//           logging: false,
//           backgroundColor: "#ffffff" 
//         },
//         jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
//       };

//       await html2pdf().set(opt).from(element).save();
//       toast.success("Downloaded successfully", { id: toastId });
//     } catch (error) {
//       console.error("PDF Error:", error);
//       toast.error("Download Error", { id: toastId });
//     } finally {
//       setIsDownloading(false);
//     }
//   };

//   if (loading) return (
//     <div className="flex h-screen items-center justify-center bg-white">
//       <Loader2 className="animate-spin text-emerald-500" size={32} />
//     </div>
//   );

//   const presentList = members.filter(m => m.isPresent);
//   const absentList = members.filter(m => !m.isPresent);
//   const filteredList = filterTab === "present" ? presentList : absentList;
  
//   const getKaryakarName = (id) => members.find(m => m.id === id)?.name || "Unassigned";

//   return (
//     <div className="min-h-screen bg-[#F8FAFC] pb-32">
//       <div className="bg-white/80 backdrop-blur-md border-b border-slate-100 p-4 flex items-center justify-between sticky top-0 z-20">
//         <div className="flex items-center gap-3">
//           <Link href="/dashboard" className="p-2 hover:bg-slate-100 rounded-xl transition-all">
//             <ArrowLeft size={22} className="text-slate-900" />
//           </Link>
//           <h1 className="font-black text-xl text-slate-900 tracking-tight leading-none">Trip Report</h1>
//         </div>
//       </div>

//       <div className="p-6 max-w-2xl mx-auto space-y-8">
        
//         <div 
//           ref={reportRef} 
//           className="bg-white rounded-[32px] border border-slate-100 shadow-2xl overflow-hidden"
//           style={{ backgroundColor: '#ffffff', color: '#0f172a' }}
//         >
//           {/* Header Block */}
//           <div style={{ backgroundColor: '#0f172a', padding: '32px', color: '#ffffff' }}>
//             <div className="flex justify-between items-start mb-6">
//               <div>
//                 <p style={{ color: '#10b981', fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.2em' }}>Attendance Tally</p>
//                 <h2 className="text-2xl font-black uppercase">Bus {session?.user?.busId}</h2>
//               </div>
//               <div style={{ backgroundColor: 'rgba(255,255,255,0.1)', padding: '12px', borderRadius: '16px', fontWeight: 'bold', fontSize: '12px' }}>
//                 {new Date().toLocaleDateString('en-GB')}
//               </div>
//             </div>

//             <div className="grid grid-cols-3 gap-4">
//               <div style={{ backgroundColor: 'rgba(255,255,255,0.05)', padding: '16px', borderRadius: '16px', textAlign: 'center' }}>
//                 <p style={{ fontSize: '9px', fontWeight: '900', color: '#94a3b8', textTransform: 'uppercase' }}>Total</p>
//                 <p className="text-xl font-black">{members.length}</p>
//               </div>
//               <div style={{ backgroundColor: 'rgba(16,185,129,0.15)', padding: '16px', borderRadius: '16px', textAlign: 'center', border: '1px solid rgba(16,185,129,0.2)' }}>
//                 <p style={{ fontSize: '9px', fontWeight: '900', color: '#10b981', textTransform: 'uppercase' }}>Present</p>
//                 <p className="text-xl font-black" style={{ color: '#10b981' }}>{presentList.length}</p>
//               </div>
//               <div style={{ backgroundColor: 'rgba(244,63,94,0.15)', padding: '16px', borderRadius: '16px', textAlign: 'center', border: '1px solid rgba(244,63,94,0.2)' }}>
//                 <p style={{ fontSize: '9px', fontWeight: '900', color: '#f43f5e', textTransform: 'uppercase' }}>Absent</p>
//                 <p className="text-xl font-black" style={{ color: '#f43f5e' }}>{absentList.length}</p>
//               </div>
//             </div>
//           </div>

//           <div className="p-8 space-y-6" style={{ backgroundColor: '#ffffff' }}>
            
//             {/* SMOOTH NAVIGATION TAB FILTER */}
//             <div data-html2canvas-ignore="true" className="relative flex p-1 bg-slate-100 rounded-2xl overflow-hidden">
//               {/* Sliding Background */}
//               <div 
//                 className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-white rounded-xl shadow-sm transition-all duration-300 ease-in-out transform ${filterTab === "absent" ? "translate-x-full" : "translate-x-0"}`}
//               />
//               <button 
//                 onClick={() => setFilterTab("present")}
//                 className={`relative z-10 flex-1 py-3 text-[11px] font-black uppercase tracking-widest transition-colors duration-300 ${filterTab === "present" ? "text-indigo-600" : "text-slate-400"}`}
//               >
//                 Present
//               </button>
//               <button 
//                 onClick={() => setFilterTab("absent")}
//                 className={`relative z-10 flex-1 py-3 text-[11px] font-black uppercase tracking-widest transition-colors duration-300 ${filterTab === "absent" ? "text-rose-600" : "text-slate-400"}`}
//               >
//                 Absent
//               </button>
//             </div>

//             <div className="flex items-center justify-between border-b border-slate-50 pb-2">
//               <h3 style={{ fontSize: '12px', fontWeight: '900', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
//                 {filterTab === "present" ? "Present Details" : "Absent Details"}
//               </h3>
//               {/* COUNT BADGE ON RIGHT SIDE */}
//               <div style={{ fontSize: '10px', fontWeight: '900', color: filterTab === "present" ? '#10b981' : '#f43f5e', backgroundColor: filterTab === "present" ? '#d1fae5' : '#fee2e2', padding: '2px 10px', borderRadius: '10px' }}>
//                 {filteredList.length}
//               </div>
//             </div>

//             {filteredList.length > 0 ? (
//               <div className="space-y-4">
//                 {filteredList.map((person) => (
//                   <div key={person.id} style={{ padding: '16px', borderRadius: '16px', border: '1px solid #f1f5f9', backgroundColor: '#f8fafc' }}>
//                     <div className="flex items-center justify-between mb-2">
//                       <p style={{ fontWeight: '700', color: '#0f172a', fontSize: '18px' }}>{person.name}</p>
//                       <div style={{ 
//                         fontSize: '9px', 
//                         fontWeight: '900', 
//                         color: person.isPresent ? '#10b981' : '#f43f5e', 
//                         padding: '4px 8px', 
//                         backgroundColor: person.isPresent ? '#d1fae5' : '#fee2e2', 
//                         borderRadius: '8px', 
//                         textTransform: 'uppercase' 
//                       }}>
//                         {person.isPresent ? "Present" : "Absent"}
//                       </div>
//                     </div>
//                     <div className="flex flex-wrap items-center gap-2">
//                       <span style={{ fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', color: person.gender === 'female' ? '#ec4899' : '#3b82f6' }}>
//                         {person.role}
//                       </span>
//                       {(person.role === "Balak" || person.role === "Balika") && (
//                         <div style={{ fontSize: '10px', fontWeight: '700', color: '#64748b', padding: '2px 8px', border: '1px solid #e2e8f0', borderRadius: '6px', backgroundColor: '#ffffff', display: 'flex', alignItems: 'center', gap: '4px' }}>
//                           <UserCircle size={12} style={{ color: '#6366f1' }} />
//                           Under: {getKaryakarName(person.assignedKaryakar)}
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             ) : (
//               <div style={{ textAlign: 'center', padding: '48px 0', backgroundColor: '#f8fafc', borderRadius: '24px', border: '1px solid #f1f5f9' }}>
//                 <CheckCircle2 size={32} style={{ color: '#cbd5e1', margin: '0 auto 12px' }} />
//                 <p style={{ fontWeight: '900', color: '#94a3b8', fontSize: '14px', textTransform: 'uppercase' }}>
//                   No members found in this list
//                 </p>
//               </div>
//             )}
            
//             <div style={{ paddingTop: '24px', borderTop: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: '12px', color: '#94a3b8' }}>
//               <FileText size={16} />
//               <p style={{ fontSize: '10px', fontWeight: '700', textTransform: 'uppercase' }}>Generated by {session?.user?.name || "Admin"}</p>
//             </div>
//           </div>
//         </div>

       
//       </div>
//     </div>
//   );
// }







//ai
// "use client";
// import { useSession } from "next-auth/react";
// import { useEffect, useState, useRef, useMemo } from "react";
// import { ArrowLeft, CheckCircle2, Download, FileText, UserCircle, Loader2, MapPin, Navigation, Bus, Home } from "lucide-react";
// import Link from "next/link";
// import { toast } from "sonner";

// const SLOT_CONFIG = {
//   At_1: { label: "Source Pickup", icon: MapPin, color: "#6366f1" },
//   At_2: { label: "Destination Drop", icon: Navigation, color: "#10b981" },
//   At_3: { label: "Return Boarding", icon: Bus, color: "#f59e0b" },
//   At_4: { label: "Final Drop-off", icon: Home, color: "#f43f5e" }
// };

// export default function TallyPage() {
//   const { data: session } = useSession();
//   const [members, setMembers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [isDownloading, setIsDownloading] = useState(false);
//   const [filterTab, setFilterTab] = useState("present"); 
//   const [activeAtPoint, setActiveAtPoint] = useState("At_1"); // Default to Slot 1
//   const reportRef = useRef(null);

//   useEffect(() => {
//     const fetchStats = async () => {
//       if (!session?.user?.busId) return;
//       try {
//         const cleanBusId = String(session.user.busId);
//         const res = await fetch(`/api/attendance?busId=${cleanBusId}`, { cache: 'no-store' });
//         const data = await res.json();
//         setMembers(Array.isArray(data) ? data : []);
//       } catch (err) {
//         toast.error("Failed to load report data");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchStats();
//   }, [session]);

//   // Updated filtering logic for the new schema
//   const stats = useMemo(() => {
//     const presentList = members.filter(m => m.attendence?.[activeAtPoint] === true);
//     const absentList = members.filter(m => m.attendence?.[activeAtPoint] !== true);
//     const filteredList = filterTab === "present" ? presentList : absentList;
    
//     return { presentList, absentList, filteredList };
//   }, [members, activeAtPoint, filterTab]);

//   const handleDownload = async () => {
//     if (isDownloading || !reportRef.current) return;
//     setIsDownloading(true);
//     const toastId = toast.loading("Generating PDF...", { position: "top-center" });

//     try {
//       const html2pdf = (await import("html2pdf.js")).default;
//       const element = reportRef.current;
//       const dateStr = new Date().toLocaleDateString('en-GB').replace(/\//g, '-');
//       const slotName = SLOT_CONFIG[activeAtPoint].label.replace(/\s+/g, '_');
      
//       const opt = {
//         margin: [10, 5, 10, 5],
//         filename: `Bus_${session?.user?.busId}_${slotName}_${filterTab}_${dateStr}.pdf`,
//         image: { type: 'jpeg', quality: 0.98 },
//         html2canvas: { scale: 2, useCORS: true, letterRendering: true, backgroundColor: "#ffffff" },
//         jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
//       };

//       await html2pdf().set(opt).from(element).save();
//       toast.success("Downloaded successfully", { id: toastId });
//     } catch (error) {
//       toast.error("Download Error", { id: toastId });
//     } finally {
//       setIsDownloading(false);
//     }
//   };

//   if (loading) return (
//     <div className="flex h-screen items-center justify-center bg-white">
//       <Loader2 className="animate-spin text-indigo-600" size={32} />
//     </div>
//   );

//   const currentSlot = SLOT_CONFIG[activeAtPoint];

//   return (
//     <div className="min-h-screen bg-[#F8FAFC] pb-32">
//       <div className="bg-white/80 backdrop-blur-md border-b border-slate-100 p-4 flex items-center justify-between sticky top-0 z-30">
//         <div className="flex items-center gap-3">
//           <Link href="/dashboard/attendance" className="p-2 hover:bg-slate-100 rounded-xl transition-all">
//             <ArrowLeft size={22} className="text-slate-900" />
//           </Link>
//           <h1 className="font-black text-xl text-slate-900 tracking-tight">Report Master</h1>
//         </div>
        
//       </div>

//       <div className="p-6 max-w-2xl mx-auto space-y-6">
        
//         {/* SLOT SELECTOR - PERSISTENT ON UI */}
//         <div className="grid grid-cols-4 gap-2">
//           {Object.entries(SLOT_CONFIG).map(([key, config]) => (
//             <button
//               key={key}
//               onClick={() => setActiveAtPoint(key)}
//               className={`p-2 rounded-xl border-2 transition-all flex flex-col items-center gap-1 ${activeAtPoint === key ? 'bg-white border-indigo-600 shadow-md' : 'bg-slate-50 border-transparent text-slate-400'}`}
//             >
//               <config.icon size={16} className={activeAtPoint === key ? 'text-indigo-600' : 'text-slate-300'} />
//               <span className="text-[8px] font-black uppercase">A{key.split('_')[1]}</span>
//             </button>
//           ))}
//         </div>

//         <div 
//           ref={reportRef} 
//           className="bg-white rounded-[32px] border border-slate-100 shadow-2xl overflow-hidden"
//         >
//           {/* Header Block */}
//           <div style={{ backgroundColor: '#0f172a', padding: '32px', color: '#ffffff' }}>
//             <div className="flex justify-between items-start mb-6">
//               <div>
//                 <p style={{ color: currentSlot.color, fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.2em' }}>{currentSlot.label}</p>
//                 <h2 className="text-2xl font-black uppercase">Bus {session?.user?.busId}</h2>
//               </div>
//               <div style={{ backgroundColor: 'rgba(255,255,255,0.1)', padding: '10px 15px', borderRadius: '12px', fontWeight: 'bold', fontSize: '12px' }}>
//                 {new Date().toLocaleDateString('en-GB')}
//               </div>
//             </div>

//             <div className="grid grid-cols-3 gap-3">
//               <div style={{ backgroundColor: 'rgba(255,255,255,0.05)', padding: '15px', borderRadius: '18px', textAlign: 'center' }}>
//                 <p style={{ fontSize: '8px', fontWeight: '900', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '4px' }}>Total</p>
//                 <p className="text-xl font-black">{members.length}</p>
//               </div>
//               <div style={{ backgroundColor: 'rgba(16,185,129,0.1)', padding: '15px', borderRadius: '18px', textAlign: 'center', border: '1px solid rgba(16,185,129,0.2)' }}>
//                 <p style={{ fontSize: '8px', fontWeight: '900', color: '#10b981', textTransform: 'uppercase', marginBottom: '4px' }}>In</p>
//                 <p className="text-xl font-black" style={{ color: '#10b981' }}>{stats.presentList.length}</p>
//               </div>
//               <div style={{ backgroundColor: 'rgba(244,63,94,0.1)', padding: '15px', borderRadius: '18px', textAlign: 'center', border: '1px solid rgba(244,63,94,0.2)' }}>
//                 <p style={{ fontSize: '8px', fontWeight: '900', color: '#f43f5e', textTransform: 'uppercase', marginBottom: '4px' }}>Out</p>
//                 <p className="text-xl font-black" style={{ color: '#f43f5e' }}>{stats.absentList.length}</p>
//               </div>
//             </div>
//           </div>

//           <div className="p-6 space-y-6" style={{ backgroundColor: '#ffffff' }}>
            
//             {/* Navigation Tabs (Hidden in PDF) */}
//             <div data-html2canvas-ignore="true" className="relative flex p-1 bg-slate-100 rounded-2xl overflow-hidden">
//               <div 
//                 className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-white rounded-xl shadow-sm transition-all duration-300 transform ${filterTab === "absent" ? "translate-x-full" : "translate-x-0"}`}
//               />
//               <button onClick={() => setFilterTab("present")} className={`relative z-10 flex-1 py-3 text-[10px] font-black uppercase tracking-widest transition-colors ${filterTab === "present" ? "text-indigo-600" : "text-slate-400"}`}>Present</button>
//               <button onClick={() => setFilterTab("absent")} className={`relative z-10 flex-1 py-3 text-[10px] font-black uppercase tracking-widest transition-colors ${filterTab === "absent" ? "text-rose-600" : "text-slate-400"}`}>Absent</button>
//             </div>

//             <div className="flex items-center justify-between border-b border-slate-50 pb-2 px-1">
//               <h3 style={{ fontSize: '11px', fontWeight: '900', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
//                 {filterTab === "present" ? "On-Board List" : "Missing List"}
//               </h3>
//               <div style={{ fontSize: '10px', fontWeight: '900', color: filterTab === "present" ? '#10b981' : '#f43f5e', backgroundColor: filterTab === "present" ? '#d1fae5' : '#fee2e2', padding: '3px 12px', borderRadius: '20px' }}>
//                 {stats.filteredList.length} Entries
//               </div>
//             </div>

//             {stats.filteredList.length > 0 ? (
//               <div className="space-y-3">
//                 {stats.filteredList.map((person) => (
//                   <div key={person.id || person.phone} style={{ padding: '16px', borderRadius: '20px', border: '1px solid #f1f5f9', backgroundColor: '#f8fafc' }}>
//                     <div className="flex items-center justify-between mb-1">
//                       <p style={{ fontWeight: '800', color: '#0f172a', fontSize: '16px', letterSpacing: '-0.02em' }}>{person.name}</p>
//                       <div style={{ fontSize: '8px', fontWeight: '900', color: person.attendence?.[activeAtPoint] ? '#10b981' : '#f43f5e', textTransform: 'uppercase' }}>
//                         {person.attendence?.[activeAtPoint] ? "✓ Verified" : "× Unmarked"}
//                       </div>
//                     </div>
//                     <p style={{ fontSize: '9px', fontWeight: '800', textTransform: 'uppercase', color: '#94a3b8', letterSpacing: '0.05em' }}>
//                       {person.role} {person.mandal ? `• ${person.mandal}` : ''}
//                     </p>
//                   </div>
//                 ))}
//               </div>
//             ) : (
//               <div className="py-16 text-center">
//                 <CheckCircle2 size={40} className="mx-auto text-slate-200 mb-3" />
//                 <p className="text-slate-400 font-black text-xs uppercase">No Records Found</p>
//               </div>
//             )}
            
//             <div style={{ paddingTop: '20px', borderTop: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: '10px', color: '#cbd5e1' }}>
//               <FileText size={14} />
//               <p style={{ fontSize: '9px', fontWeight: '700', textTransform: 'uppercase' }}>System Generated Trip Report • Bus {session?.user?.busId}</p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
"use client";
import { useSession } from "next-auth/react";
import { useEffect, useState, useRef, useMemo } from "react";
import { ArrowLeft, CheckCircle2, FileText, Loader2, MapPin, Navigation, Bus, Home } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

const SLOT_CONFIG = {
  At_1: { label: "Source Pickup", icon: MapPin, color: "#6366f1" },
  At_2: { label: "Destination Drop", icon: Navigation, color: "#10b981" },
  At_3: { label: "Return Boarding", icon: Bus, color: "#f59e0b" },
  At_4: { label: "Final Drop-off", icon: Home, color: "#f43f5e" }
};

export default function TallyPage() {
  const { data: session } = useSession();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterTab, setFilterTab] = useState("present"); 
  const [activeAtPoint, setActiveAtPoint] = useState("At_1");
  const reportRef = useRef(null);

  useEffect(() => {
    const fetchStats = async () => {
      if (!session?.user?.busId) return;
      try {
        const cleanBusId = String(session.user.busId);
        const res = await fetch(`/api/attendance?busId=${cleanBusId}`, { cache: 'no-store' });
        const data = await res.json();
        setMembers(Array.isArray(data) ? data : []);
      } catch (err) { toast.error("Failed to load report data"); } finally { setLoading(false); }
    };
    fetchStats();
  }, [session]);

  const stats = useMemo(() => {
    const presentList = members.filter(m => m.attendence?.[activeAtPoint] === true);
    const absentList = members.filter(m => m.attendence?.[activeAtPoint] !== true);
    const filteredList = filterTab === "present" ? presentList : absentList;
    return { presentList, absentList, filteredList };
  }, [members, activeAtPoint, filterTab]);

  if (loading) return <div className="flex h-screen items-center justify-center bg-white"><Loader2 className="animate-spin text-indigo-600" size={32} /></div>;

  const currentSlot = SLOT_CONFIG[activeAtPoint];

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-32">
      <div className="bg-white/80 backdrop-blur-md border-b border-slate-100 p-4 sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="p-2 hover:bg-slate-100 rounded-xl transition-all">
            <ArrowLeft size={22} className="text-slate-900" />
          </Link>
          <h1 className="font-black text-xl tracking-tight">Report Master</h1>
        </div>
      </div>

      <div className="p-6 max-w-2xl mx-auto space-y-6">
        <div className="grid grid-cols-4 gap-2">
          {Object.entries(SLOT_CONFIG).map(([key, config]) => (
            <button key={key} onClick={() => setActiveAtPoint(key)} className={`p-2 rounded-xl border-2 transition-all flex flex-col items-center gap-1 ${activeAtPoint === key ? 'bg-white border-indigo-600 shadow-md' : 'bg-slate-50 border-transparent text-slate-400'}`}>
              <config.icon size={16} className={activeAtPoint === key ? 'text-indigo-600' : 'text-slate-300'} />
              <span className="text-[8px] font-black uppercase">A{key.split('_')[1]}</span>
            </button>
          ))}
        </div>

        <div ref={reportRef} className="bg-white rounded-[32px] border border-slate-100 shadow-2xl overflow-hidden">
          <div style={{ backgroundColor: '#0f172a', padding: '32px', color: '#ffffff' }}>
            <p style={{ color: currentSlot.color, fontSize: '10px', fontWeight: '900', textTransform: 'uppercase' }}>{currentSlot.label}</p>
            <h2 className="text-2xl font-black uppercase">Bus {session?.user?.busId}</h2>
            <div className="grid grid-cols-3 gap-3 mt-6">
              <div className="bg-white/5 p-4 rounded-2xl text-center"><p className="text-[8px] font-black text-slate-400 uppercase">Total</p><p className="text-xl font-black">{members.length}</p></div>
              <div className="bg-emerald-500/10 p-4 rounded-2xl text-center border border-emerald-500/20"><p className="text-[8px] font-black text-emerald-500 uppercase">In</p><p className="text-xl font-black text-emerald-500">{stats.presentList.length}</p></div>
              <div className="bg-rose-500/10 p-4 rounded-2xl text-center border border-rose-500/20"><p className="text-[8px] font-black text-rose-500 uppercase">Out</p><p className="text-xl font-black text-rose-500">{stats.absentList.length}</p></div>
            </div>
          </div>

          <div className="p-6 space-y-4 bg-white">
            <div className="relative flex p-1 bg-slate-100 rounded-2xl overflow-hidden">
              <div className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-white rounded-xl shadow-sm transition-all duration-300 transform ${filterTab === "absent" ? "translate-x-full" : "translate-x-0"}`} />
              <button onClick={() => setFilterTab("present")} className={`relative z-10 flex-1 py-3 text-[10px] font-black uppercase tracking-widest transition-colors ${filterTab === "present" ? "text-indigo-600" : "text-slate-400"}`}>Present</button>
              <button onClick={() => setFilterTab("absent")} className={`relative z-10 flex-1 py-3 text-[10px] font-black uppercase tracking-widest transition-colors ${filterTab === "absent" ? "text-rose-600" : "text-slate-400"}`}>Absent</button>
            </div>
            
            {stats.filteredList.length > 0 ? (
              stats.filteredList.map((person) => (
                <div key={person.id || person.phone} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex justify-between items-center">
                  <div><p className="font-bold text-slate-900">{person.name}</p><p className="text-[9px] font-black text-slate-400 uppercase">{person.role}</p></div>
                  <div className={`text-[8px] font-black uppercase ${person.attendence?.[activeAtPoint] ? 'text-emerald-500' : 'text-rose-500'}`}>{person.attendence?.[activeAtPoint] ? "Verified" : "Missing"}</div>
                </div>
              ))
            ) : (
              <p className="text-center text-slate-400 py-10 font-bold uppercase text-[10px]">No records found</p>
            )}
          </div>
        </div>
      </div>

      {/* MOBILE OPTIMIZED FIXED BOTTOM BAR */}
      <div className="fixed bottom-0 left-0 right-0 p-4 md:p-6 z-40 pointer-events-none">
        <div className="max-w-md mx-auto bg-slate-900/95 backdrop-blur-2xl rounded-[28px] md:rounded-[35px] p-4 md:p-6 flex items-center justify-between pointer-events-auto shadow-2xl text-white border border-white/10">
          
          {/* Left Side: Summary Label */}
          <div className="flex flex-col pl-1">
            <p className="text-[7px] md:text-[9px] font-black text-slate-500 uppercase tracking-widest mb-0.5 leading-none">
              A{activeAtPoint.split('_')[1]} Summary
            </p>
            <h2 className="text-white font-black text-[11px] md:text-sm uppercase tracking-tight truncate max-w-[80px] md:max-w-none">
              {currentSlot.label}
            </h2>
          </div>

          {/* Right Side: Counts */}
          <div className="flex items-center gap-3 md:gap-8 pr-1">
            <div className="flex flex-col items-center min-w-[45px]">
              <p className="text-[7px] md:text-[9px] text-emerald-500 font-black uppercase tracking-widest mb-0.5">Present</p>
              <p className="text-lg md:text-2xl font-black text-white leading-none">
                {stats.presentList.length}
              </p>
            </div>

            <div className="h-7 w-px bg-white/10" />

            <div className="flex flex-col items-center min-w-[45px]">
              <p className="text-[7px] md:text-[9px] text-rose-500 font-black uppercase tracking-widest mb-0.5">Absent</p>
              <p className="text-lg md:text-2xl font-black text-white leading-none">
                {stats.absentList.length}
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}