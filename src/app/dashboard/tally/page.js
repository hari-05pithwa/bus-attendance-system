"use client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { ArrowLeft, CheckCircle2, Download, FileText, UserCircle } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function TallyPage() {
  const { data: session } = useSession();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      if (!session) return;
      try {
        const res = await fetch(`/api/attendance?busId=${session.user.busId}&gender=${session.user.section}`);
        const data = await res.json();
        setMembers(data);
      } catch (err) {
        toast.error("Failed to load report data");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [session]);

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-2">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent" />
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Compiling Report</p>
      </div>
    </div>
  );

  const total = members.length;
  const presentCount = members.filter((m) => m.isPresent).length;
  const absentCount = total - presentCount;
  const absentList = members.filter((m) => !m.isPresent);

  // Helper to find the Karyakar name for an absent Balak
  const getKaryakarName = (assignedKaryakarId) => {
    const karyakar = members.find(m => m.id === assignedKaryakarId);
    return karyakar ? karyakar.name : "Unassigned";
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20">
      
      {/* Header - Hidden during Print */}
      <div className="print:hidden bg-white/80 backdrop-blur-md border-b border-slate-100 p-4 flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="p-2 hover:bg-slate-100 rounded-xl transition-all active:scale-90">
            <ArrowLeft size={22} className="text-slate-900" />
          </Link>
          <h1 className="font-black text-xl text-slate-900 tracking-tight">Trip Report</h1>
        </div>
      </div>

      <div className="p-6 max-w-2xl mx-auto space-y-8">
        
        {/* REPORT CARD */}
        <div className="bg-white rounded-[32px] border border-slate-100 shadow-2xl shadow-slate-200/50 overflow-hidden print:shadow-none print:border-none print:rounded-none">
          
          {/* Report Header Block */}
          <div className="bg-slate-900 p-8 text-white">
            <div className="flex justify-between items-start mb-6">
              <div>
                <p className="text-emerald-400 text-[10px] font-black uppercase tracking-[0.2em] mb-1">Attendance Tally</p>
                <h2 className="text-2xl font-black tracking-tight">{session?.user?.busId}</h2>
              </div>
              <div className="bg-white/10 p-3 rounded-2xl backdrop-blur-md font-bold text-xs">
                {new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white/5 p-4 rounded-2xl text-center">
                <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Total</p>
                <p className="text-xl font-black">{total}</p>
              </div>
              <div className="bg-emerald-500/20 p-4 rounded-2xl border border-emerald-500/20 text-center">
                <p className="text-[9px] font-black text-emerald-400 uppercase mb-1">Present</p>
                <p className="text-xl font-black text-emerald-400">{presentCount}</p>
              </div>
              <div className="bg-rose-500/20 p-4 rounded-2xl border border-rose-500/20 text-center">
                <p className="text-[9px] font-black text-rose-400 uppercase mb-1">Absent</p>
                <p className="text-xl font-black text-rose-400">{absentCount}</p>
              </div>
            </div>
          </div>

          {/* Report Body */}
          <div className="p-8 space-y-6">
            <div>
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Absent Details</h3>
              {absentList.length > 0 ? (
                <div className="space-y-4">
                  {absentList.map((person) => (
                    <div key={person.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100/50">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-bold text-slate-900 text-lg leading-tight">{person.name}</p>
                        <div className="text-[9px] font-black text-rose-500 px-2 py-1 bg-rose-100 rounded-lg uppercase tracking-tighter">Absent</div>
                      </div>
                      
                      {/* Sub-label for Role & Assigned Lead */}
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-tight">{person.role}</span>
                        </div>
                        
                        {/* Only show "Under" if it's a Balak */}
                        {person.role === "Balak" && (
                          <div className="flex items-center gap-1.5 px-2 py-0.5 bg-white rounded-md border border-slate-200">
                            <UserCircle size={12} className="text-indigo-500" />
                            <p className="text-[10px] font-bold text-slate-600 tracking-tight italic">
                              Under: {getKaryakarName(person.assignedKaryakar)}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-emerald-50 rounded-[28px] border border-emerald-100">
                  <CheckCircle2 className="text-emerald-500 mx-auto mb-3" size={32} />
                  <p className="font-bold text-emerald-800 text-sm tracking-tight tracking-widest uppercase">Full Attendance Confirmed</p>
                </div>
              )}
            </div>

            <div className="pt-6 border-t border-slate-100">
              <div className="flex items-center gap-3 text-slate-400">
                <FileText size={16} />
                <p className="text-[10px] font-bold uppercase tracking-widest italic leading-none">
                  Generated by {session?.user?.name}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Big Mobile Action Button */}
        <button 
          onClick={() => window.print()}
          className="print:hidden w-full flex items-center justify-center gap-3 bg-slate-900 text-white p-5 rounded-[28px] font-black text-sm uppercase tracking-[0.2em] active:scale-[0.97] transition-all shadow-xl shadow-slate-200"
        >
          <Download size={20} />
          Download Report
        </button>

      </div>
    </div>
  );
}