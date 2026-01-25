"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState, useCallback, useMemo } from "react";
import { ArrowLeft, Search, X, Loader2 } from "lucide-react";
import Link from "next/link";
import AttendanceRow from "@/components/AttendanceRow";

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

export default function AttendancePage() {
  const { data: session } = useSession();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const fetchMembers = useCallback(async () => {
    if (!session?.user?.busId) return;
    setLoading(true);
    try {
      const rawBusId = String(session.user.busId);
      const match = rawBusId.match(/(\d+(\.\d+)?)/);
      const cleanBusId = match ? match[0] : rawBusId;
      
      const res = await fetch(`/api/attendance?busId=${cleanBusId}`);
      const data = await res.json();
      
      // Ensure we only store unique members by their ID to prevent double counting
      const uniqueData = Array.isArray(data) 
        ? Array.from(new Map(data.map(item => [item.id, item])).values())
        : [];
        
      setMembers(uniqueData);
    } catch (error) {
      console.error("Fetch error:", error);
      setMembers([]);
    } finally {
      setLoading(false);
    }
  }, [session]);

  useEffect(() => {
    if (session?.user?.busId) {
      fetchMembers();
    }
  }, [session, fetchMembers]);

  const handleToggle = async (ids, currentStatus) => {
    const newStatus = !currentStatus;
    
    // Optimistic UI Update: update state immediately
    setMembers(prev => prev.map(m => 
      ids.includes(m.id) ? { ...m, isPresent: newStatus } : m
    ));

    try {
      const res = await fetch("/api/attendance", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids, isPresent: newStatus }),
      });
      
      if (!res.ok) throw new Error("Failed to update");
    } catch (error) {
      // Revert if API fails
      fetchMembers();
    }
  };

  const categorizedData = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    const safeMembers = Array.isArray(members) ? members : [];

    const filterAndSortBy = (gender, role) => {
      const filtered = safeMembers.filter(m => 
        m.gender === gender && 
        m.role === role && 
        (q === "" || m.name.toLowerCase().includes(q))
      );

      if (q !== "") {
        return filtered.sort((a, b) => {
          const aStarts = a.name.toLowerCase().startsWith(q);
          const bStarts = b.name.toLowerCase().startsWith(q);
          if (aStarts && !bStarts) return -1;
          if (!aStarts && bStarts) return 1;
          return a.name.localeCompare(b.name);
        });
      }
      return filtered;
    };

    return {
      male: {
        karyakars: filterAndSortBy("male", "Bal Karyakar"),
        sanchalaks: filterAndSortBy("male", "Vrund Sanchalak"),
        balaks: filterAndSortBy("male", "Balak"),
      },
      female: {
        karyakars: filterAndSortBy("female", "Balika Karyakar"),
        sanchalaks: filterAndSortBy("female", "Vrund Sanchalak"),
        balaks: filterAndSortBy("female", "Balika"),
      }
    };
  }, [members, searchQuery]);

  const stats = useMemo(() => {
    const total = members.length;
    const present = members.filter(m => m.isPresent).length;
    return { 
      total, 
      present, 
      percent: total > 0 ? Math.round((present / total) * 100) : 0 
    };
  }, [members]);

  const hasSearchResults = useMemo(() => {
    const d = categorizedData;
    return (
      d.male.karyakars.length > 0 || d.male.sanchalaks.length > 0 || d.male.balaks.length > 0 ||
      d.female.karyakars.length > 0 || d.female.sanchalaks.length > 0 || d.female.balaks.length > 0
    );
  }, [categorizedData]);

  if (loading) return (
    <div className="flex h-screen flex-col items-center justify-center bg-white">
      <div className="h-10 w-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FDFDFF] pb-40">
      <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-3xl border-b border-slate-100 px-6 py-6">
        <div className="flex items-center justify-between">
          {!isSearchOpen ? (
            <>
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-full border-2 border-indigo-600 flex items-center justify-center font-black text-[10px]">
                  {stats.percent}%
                </div>
                <h1 className="font-black text-xl tracking-tight leading-none uppercase">Bus {session?.user?.busId}</h1>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setIsSearchOpen(true)} className="p-3 bg-slate-50 rounded-xl active:scale-90 transition-all"><Search size={20}/></button>
                <Link href="/dashboard" className="p-3 bg-slate-50 rounded-xl active:scale-90 transition-all"><ArrowLeft size={20}/></Link>
              </div>
            </>
          ) : (
            <div className="flex items-center w-full gap-2 animate-in fade-in slide-in-from-top-2">
              <input 
                autoFocus 
                className="flex-1 h-12 bg-slate-100 rounded-xl px-4 font-bold outline-none text-slate-900" 
                placeholder="Find name..." 
                value={searchQuery} 
                onChange={(e) => setSearchQuery(e.target.value.replace(/[^a-zA-Z\s]/g, ""))} 
              />
              <button onClick={() => {setIsSearchOpen(false); setSearchQuery("");}} className="p-3 bg-indigo-600 text-white rounded-xl"><X size={20}/></button>
            </div>
          )}
        </div>
      </div>

      <div className="px-6 max-w-2xl mx-auto">
        {!hasSearchResults && searchQuery !== "" ? (
          <div className="mt-20 text-center animate-in fade-in zoom-in duration-300">
             <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="text-slate-300" size={30} />
             </div>
             <p className="text-slate-900 font-black text-lg">No matches found</p>
             <p className="text-slate-400 text-sm font-medium">We couldn't find anyone named "{searchQuery}"</p>
          </div>
        ) : (
          <>
            {/* MALE SECTION */}
            {(categorizedData.male.karyakars.length > 0 || categorizedData.male.sanchalaks.length > 0 || categorizedData.male.balaks.length > 0) && (
              <>
                <div className="mt-8 mb-4 p-3 bg-blue-50 text-blue-700 rounded-xl font-black text-center text-[10px] tracking-[0.3em]">MALE SECTION</div>
                {/* Lists mapped same as before */}
                {categorizedData.male.karyakars.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Bal Karyakar</h3>
                    {categorizedData.male.karyakars.map(p => <AttendanceRow key={p.id} person={p} onToggle={handleToggle} searchQuery={searchQuery} highlightComponent={HighlightedText} />)}
                  </div>
                )}
                {categorizedData.male.sanchalaks.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Vrund Sanchalak</h3>
                    {categorizedData.male.sanchalaks.map(p => <AttendanceRow key={p.id} person={p} onToggle={handleToggle} searchQuery={searchQuery} highlightComponent={HighlightedText} />)}
                  </div>
                )}
                {categorizedData.male.balaks.length > 0 && (
                  <div className="mb-10">
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Balak</h3>
                    {categorizedData.male.balaks.map(p => <AttendanceRow key={p.id} person={p} onToggle={handleToggle} searchQuery={searchQuery} highlightComponent={HighlightedText} />)}
                  </div>
                )}
              </>
            )}

            {/* FEMALE SECTION */}
            {(categorizedData.female.karyakars.length > 0 || categorizedData.female.sanchalaks.length > 0 || categorizedData.female.balaks.length > 0) && (
              <>
                <div className="mt-8 mb-4 p-3 bg-pink-50 text-pink-700 rounded-xl font-black text-center text-[10px] tracking-[0.3em]">FEMALE SECTION</div>
                {categorizedData.female.karyakars.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Balika Karyakar</h3>
                    {categorizedData.female.karyakars.map(p => <AttendanceRow key={p.id} person={p} onToggle={handleToggle} searchQuery={searchQuery} highlightComponent={HighlightedText} />)}
                  </div>
                )}
                {categorizedData.female.sanchalaks.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Vrund Sanchalak</h3>
                    {categorizedData.female.sanchalaks.map(p => <AttendanceRow key={p.id} person={p} onToggle={handleToggle} searchQuery={searchQuery} highlightComponent={HighlightedText} />)}
                  </div>
                )}
                {categorizedData.female.balaks.length > 0 && (
                  <div>
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Balika</h3>
                    {categorizedData.female.balaks.map(p => <AttendanceRow key={p.id} person={p} onToggle={handleToggle} searchQuery={searchQuery} highlightComponent={HighlightedText} />)}
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-6 z-40 pointer-events-none">
        <div className="max-w-md mx-auto bg-slate-900/95 backdrop-blur-2xl rounded-[32px] p-3 flex items-center justify-between pointer-events-auto shadow-2xl">
          <div className="flex items-center gap-6 pl-5 text-white">
            <div><p className="text-[9px] text-slate-500 uppercase tracking-widest">Present</p><p className="text-xl font-black">{stats.present}</p></div>
            <div className="h-10 w-px bg-white/10" />
            <div><p className="text-[9px] text-slate-500 uppercase tracking-widest">Absent</p><p className="text-xl font-black text-rose-500">{stats.total - stats.present}</p></div>
          </div>
          <Link href="/dashboard/tally" className="bg-indigo-600 px-8 py-4 rounded-2xl text-white font-black uppercase text-[10px] tracking-widest active:scale-95 transition-all">Tally</Link>
        </div>
      </div>
    </div>
  );
}