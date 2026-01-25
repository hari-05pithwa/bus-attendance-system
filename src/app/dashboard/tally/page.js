"use client";
import { useSession } from "next-auth/react";
import { useEffect, useState, useRef } from "react";
import { ArrowLeft, CheckCircle2, Download, FileText, UserCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function TallyPage() {
  const { data: session } = useSession();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const reportRef = useRef(null);

  useEffect(() => {
    const fetchStats = async () => {
      if (!session?.user?.busId) return;
      try {
        const cleanBusId = String(session.user.busId).replace(/[^0-9.]/g, "");
        const res = await fetch(`/api/attendance?busId=${cleanBusId}`);
        const data = await res.json();
        const uniqueData = Array.isArray(data) 
          ? Array.from(new Map(data.map(item => [item.id, item])).values())
          : [];
        setMembers(uniqueData);
      } catch (err) {
        toast.error("Failed to load report data");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [session]);

  const handleDownload = async () => {
    if (isDownloading || !reportRef.current) return;
    setIsDownloading(true);
    const toastId = toast.loading("Generating PDF...", { position: "top-center" });

    try {
      const html2pdf = (await import("html2pdf.js")).default;
      const element = reportRef.current;
      const dateStr = new Date().toLocaleDateString('en-GB').replace(/\//g, '-');
      
      const opt = {
        margin: [10, 5, 10, 5],
        filename: `Bus_${session?.user?.busId}_Report_${dateStr}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
          scale: 2, 
          useCORS: true, 
          letterRendering: true,
          logging: false,
          // CRITICAL: This ignores the 'lab' color issues by using a solid background
          backgroundColor: "#ffffff" 
        },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };

      await html2pdf().set(opt).from(element).save();
      toast.success("Downloaded successfully", { id: toastId });
    } catch (error) {
      console.error("PDF Error:", error);
      toast.error("Download Error: Standardizing colors...", { id: toastId });
    } finally {
      setIsDownloading(false);
    }
  };

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-white">
      <Loader2 className="animate-spin text-emerald-500" size={32} />
    </div>
  );

  const absentList = members.filter((m) => !m.isPresent);
  const getKaryakarName = (id) => members.find(m => m.id === id)?.name || "Unassigned";

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-32">
      {/* Header - Not included in PDF */}
      <div className="bg-white/80 backdrop-blur-md border-b border-slate-100 p-4 flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="p-2 hover:bg-slate-100 rounded-xl transition-all">
            <ArrowLeft size={22} className="text-slate-900" />
          </Link>
          <h1 className="font-black text-xl text-slate-900 tracking-tight">Trip Report</h1>
        </div>
      </div>

      <div className="p-6 max-w-2xl mx-auto space-y-8">
        {/* PDF CONTENT BOX - FORCED HEX COLORS TO AVOID LAB ERROR */}
        <div 
          ref={reportRef} 
          className="bg-white rounded-[32px] border border-slate-100 shadow-2xl overflow-hidden"
          style={{ backgroundColor: '#ffffff', color: '#0f172a' }}
        >
          {/* Header Block */}
          <div style={{ backgroundColor: '#0f172a', padding: '32px', color: '#ffffff' }}>
            <div className="flex justify-between items-start mb-6">
              <div>
                <p style={{ color: '#10b981', fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.2em' }}>Attendance Tally</p>
                <h2 className="text-2xl font-black uppercase">Bus {session?.user?.busId}</h2>
              </div>
              <div style={{ backgroundColor: 'rgba(255,255,255,0.1)', padding: '12px', borderRadius: '16px', fontWeight: 'bold', fontSize: '12px' }}>
                {new Date().toLocaleDateString('en-GB')}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div style={{ backgroundColor: 'rgba(255,255,255,0.05)', padding: '16px', borderRadius: '16px', textAlign: 'center' }}>
                <p style={{ fontSize: '9px', fontWeight: '900', color: '#94a3b8', textTransform: 'uppercase' }}>Total</p>
                <p className="text-xl font-black">{members.length}</p>
              </div>
              <div style={{ backgroundColor: 'rgba(16,185,129,0.15)', padding: '16px', borderRadius: '16px', textAlign: 'center', border: '1px solid rgba(16,185,129,0.2)' }}>
                <p style={{ fontSize: '9px', fontWeight: '900', color: '#10b981', textTransform: 'uppercase' }}>Present</p>
                <p className="text-xl font-black" style={{ color: '#10b981' }}>{members.filter(m => m.isPresent).length}</p>
              </div>
              <div style={{ backgroundColor: 'rgba(244,63,94,0.15)', padding: '16px', borderRadius: '16px', textAlign: 'center', border: '1px solid rgba(244,63,94,0.2)' }}>
                <p style={{ fontSize: '9px', fontWeight: '900', color: '#f43f5e', textTransform: 'uppercase' }}>Absent</p>
                <p className="text-xl font-black" style={{ color: '#f43f5e' }}>{absentList.length}</p>
              </div>
            </div>
          </div>

          {/* Details Block */}
          <div className="p-8 space-y-6" style={{ backgroundColor: '#ffffff' }}>
            <h3 style={{ fontSize: '12px', fontWeight: '900', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Absent Details</h3>
            {absentList.length > 0 ? (
              <div className="space-y-4">
                {absentList.map((person) => (
                  <div key={person.id} style={{ padding: '16px', borderRadius: '16px', border: '1px solid #f1f5f9', backgroundColor: '#f8fafc' }}>
                    <div className="flex items-center justify-between mb-2">
                      <p style={{ fontWeight: '700', color: '#0f172a', fontSize: '18px' }}>{person.name}</p>
                      <div style={{ fontSize: '9px', fontWeight: '900', color: '#f43f5e', padding: '4px 8px', backgroundColor: '#fee2e2', borderRadius: '8px', textTransform: 'uppercase' }}>Absent</div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span style={{ fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', color: person.gender === 'female' ? '#ec4899' : '#3b82f6' }}>
                        {person.role}
                      </span>
                      {(person.role === "Balak" || person.role === "Balika") && (
                        <div style={{ fontSize: '10px', fontWeight: '700', color: '#64748b', padding: '2px 8px', border: '1px solid #e2e8f0', borderRadius: '6px', backgroundColor: '#ffffff', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <UserCircle size={12} style={{ color: '#6366f1' }} />
                          Under: {getKaryakarName(person.assignedKaryakar)}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '48px 0', backgroundColor: '#f0fdf4', borderRadius: '24px', border: '1px solid #dcfce7' }}>
                <CheckCircle2 size={32} style={{ color: '#22c55e', margin: '0 auto 12px' }} />
                <p style={{ fontWeight: '900', color: '#166534', fontSize: '14px', textTransform: 'uppercase' }}>Full Attendance Confirmed</p>
              </div>
            )}
            
            <div style={{ paddingTop: '24px', borderTop: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: '12px', color: '#94a3b8' }}>
              <FileText size={16} />
              <p style={{ fontSize: '10px', fontWeight: '700', textTransform: 'uppercase' }}>Generated by {session?.user?.name || "Admin"}</p>
            </div>
          </div>
        </div>

        
      </div>
    </div>
  );
}