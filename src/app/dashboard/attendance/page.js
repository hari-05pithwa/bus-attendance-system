"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState, useCallback, useMemo } from "react";
import { ArrowLeft, RefreshCw, Loader2, Search, CheckCircle2, X, Users2, User } from "lucide-react";
import Link from "next/link";
import KaryakarGroup from "@/components/KaryakarGroup";
import AttendanceRow from "@/components/AttendanceRow";

// --- Helper Component for Highlight Effect ---
const HighlightedText = ({ text, query }) => {
  if (!query.trim()) return <span>{text}</span>;
  const regex = new RegExp(`(${query})`, "gi");
  const parts = text.split(regex);
  return (
    <span>
      {parts.map((part, i) => 
        regex.test(part) ? (
          <span key={i} className="text-indigo-600 bg-indigo-50 px-0.5 rounded-sm font-bold">{part}</span>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </span>
  );
};

export default function AttendancePage() {
  const { data: session } = useSession();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [openGroupId, setOpenGroupId] = useState(null);

  const fetchMembers = useCallback(async (showLoader = true) => {
    if (!session?.user?.busId) return;
    if (showLoader) setLoading(true);
    try {
      const res = await fetch(`/api/attendance?busId=${session.user.busId}&gender=${session.user.section}`);
      const data = await res.json();
      setMembers(data);
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, [session]);

  useEffect(() => { fetchMembers(); }, [fetchMembers]);

  const handleToggle = async (ids, currentStatus) => {
    const newStatus = !currentStatus;
    setMembers(prev => prev.map(m => ids.includes(m.id) ? { ...m, isPresent: newStatus } : m));
    try {
      await fetch("/api/attendance", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids, isPresent: newStatus }),
      });
    } catch (error) { 
      fetchMembers(false); 
    }
  };

  // Character filter: Only allow A-Z and spaces
  const handleSearchChange = (e) => {
    const value = e.target.value;
    const filteredValue = value.replace(/[^a-zA-Z\s]/g, "");
    setSearchQuery(filteredValue);
  };

  const leaders = useMemo(() => {
    return members.filter((m) => {
      if (m.role !== "Karyakar" || !m.assignedBalak?.length) return false;
      const karyakarMatches = m.name.toLowerCase().includes(searchQuery.toLowerCase());
      const childMatches = members.some(
        (b) => b.assignedKaryakar === m.id && b.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      return karyakarMatches || childMatches;
    });
  }, [members, searchQuery]);

  const individuals = useMemo(() => {
    return members.filter((m) => {
      const isIndiv = (m.role.includes("Karyakar") || m.role.includes("Admin")) && (!m.assignedBalak || m.assignedBalak.length === 0);
      return isIndiv && m.name.toLowerCase().includes(searchQuery.toLowerCase());
    });
  }, [members, searchQuery]);

  const stats = useMemo(() => {
    const total = members.length;
    const present = members.filter(m => m.isPresent).length;
    const percent = total > 0 ? Math.round((present / total) * 100) : 0;
    return { total, present, percent };
  }, [members]);

  if (loading) return (
    <div className="flex h-screen flex-col items-center justify-center bg-white">
      <div className="relative h-20 w-20">
        <div className="absolute inset-0 rounded-full border-[3px] border-indigo-50" />
        <div className="absolute inset-0 rounded-full border-[3px] border-indigo-600 border-t-transparent animate-spin" />
      </div>
      <p className="mt-6 text-[11px] font-black text-slate-400 uppercase tracking-[0.3em]">Accessing Portal</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FDFDFF] pb-40">
      <div className="sticky top-0 z-30 bg-white/70 backdrop-blur-3xl border-b border-slate-100 px-6 py-6">
        <div className="flex items-center justify-between">
          {!isSearchOpen ? (
            <>
              <div className="flex items-center gap-5">
                <div className="relative h-14 w-14 flex items-center justify-center">
                  <svg className="h-full w-full rotate-[-90deg]">
                    <circle cx="28" cy="28" r="24" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-slate-100" />
                    <circle cx="28" cy="28" r="24" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-indigo-600 transition-all duration-1000 ease-out" 
                      strokeDasharray={150.8} strokeDashoffset={150.8 - (150.8 * stats.percent) / 100} strokeLinecap="round" />
                  </svg>
                  <span className="absolute text-[11px] font-black text-slate-900">{stats.percent}%</span>
                </div>
                <div>
                  <h1 className="font-black text-2xl text-slate-900 tracking-tight leading-none">Attendance</h1>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{session?.user?.section} Section</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setIsSearchOpen(true)} className="h-12 w-12 flex items-center justify-center bg-slate-50 text-slate-400 rounded-2xl active:scale-90 transition-all font-bold">
                  <Search size={20} />
                </button>
                <Link href="/dashboard" className="h-12 w-12 flex items-center justify-center bg-slate-50 text-slate-400 rounded-2xl active:scale-90 transition-all font-bold">
                  <ArrowLeft size={20} />
                </Link>
              </div>
            </>
          ) : (
            <div className="flex items-center w-full gap-3 animate-in fade-in slide-in-from-top-2">
              <input 
                autoFocus 
                placeholder="Find someone..." 
                className="flex-1 h-14 bg-slate-100 rounded-[20px] px-6 outline-none font-bold text-slate-900" 
                value={searchQuery} 
                onChange={handleSearchChange} 
              />
              <button onClick={() => {setIsSearchOpen(false); setSearchQuery("");}} className="h-14 w-14 flex items-center justify-center bg-indigo-600 text-white rounded-[20px] shadow-lg shadow-indigo-200">
                <X size={22} />
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="p-6 max-w-2xl mx-auto space-y-12">
        {/* No Results State */}
        {searchQuery && leaders.length === 0 && individuals.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 animate-in fade-in zoom-in duration-300">
            <div className="bg-slate-50 p-6 rounded-full">
              <Search size={40} className="text-slate-300" />
            </div>
            <div>
              <p className="text-slate-900 font-black text-lg">No matches found</p>
              <p className="text-slate-400 text-sm font-medium">We couldn't find anyone named "{searchQuery}"</p>
            </div>
            <button 
              onClick={() => setSearchQuery("")}
              className="text-indigo-600 font-bold text-sm bg-indigo-50 px-6 py-2 rounded-xl active:scale-95 transition-all"
            >
              Clear Search
            </button>
          </div>
        ) : (
          <>
            {/* GROUPED SECTION */}
            {leaders.length > 0 && (
              <div className="space-y-6">
                <div className="flex items-center justify-between px-1">
                  <div className="flex items-center gap-2">
                    <Users2 size={16} className="text-indigo-600" />
                    <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.25em]">Groups</h2>
                  </div>
                </div>
                {leaders.map((karyakar) => (
                  <KaryakarGroup 
                    key={karyakar.id} 
                    karyakar={karyakar} 
                    onToggle={handleToggle}
                    isOpen={openGroupId === karyakar.id}
                    setIsOpen={() => setOpenGroupId(openGroupId === karyakar.id ? null : karyakar.id)}
                    searchQuery={searchQuery}
                    highlightComponent={HighlightedText}
                    assignedBalaks={members.filter(b => b.role === "Balak" && b.assignedKaryakar === karyakar.id && b.name.toLowerCase().includes(searchQuery.toLowerCase()))} 
                  />
                ))}
              </div>
            )}

            {/* STAFF SECTION */}
            {individuals.length > 0 && (
              <div className="space-y-6">
                <div className="flex items-center gap-2 px-1">
                  <User size={16} className="text-slate-400" />
                  <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.25em]">Individuals</h2>
                </div>
                <div className="grid gap-3">
                  {individuals.map((person) => (
                    <AttendanceRow 
                      key={person.id} 
                      person={person} 
                      onToggle={handleToggle} 
                      searchQuery={searchQuery} 
                      highlightComponent={HighlightedText} 
                    />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* FOOTER ACTION HUB */}
      <div className="fixed bottom-0 left-0 right-0 p-6 z-40 pointer-events-none">
        <div className="max-w-md mx-auto bg-slate-900/95 backdrop-blur-2xl rounded-[36px] p-3 flex items-center justify-between border border-white/10 shadow-2xl pointer-events-auto">
          <div className="flex items-center gap-6 pl-5">
            <div>
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">On Board</p>
              <p className="text-2xl font-black text-white leading-none tracking-tighter">{stats.present}</p>
            </div>
            <div className="h-10 w-px bg-white/10" />
            <div>
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Missing</p>
              <p className="text-2xl font-black text-rose-500 leading-none tracking-tighter">{stats.total - stats.present}</p>
            </div>
          </div>
          <Link href="/dashboard/tally" className="bg-indigo-600 h-[64px] px-8 rounded-[28px] flex items-center justify-center text-white active:scale-95 transition-all shadow-xl shadow-indigo-500/20">
            <span className="text-sm font-black uppercase tracking-[0.15em]">Summary</span>
          </Link>
        </div>
      </div>
    </div>
  );
}