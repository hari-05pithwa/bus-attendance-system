// "use client";
// import { useState, useEffect } from "react";
// import { signIn } from "next-auth/react";
// import { useRouter } from "next/navigation";
// import {
//   Eye,
//   EyeOff,
//   Lock,
//   Bus,
//   Loader2,
//   ArrowRight,
//   ChevronDown,
// } from "lucide-react";
// import { toast } from "sonner";

// // Updated list with Master Admin
// const BUS_LIST = [
//   { label: "Master Admin", value: "0" },
//   { label: "1.1", value: "1.1" },
//   { label: "2.1", value: "2.1" },
//   { label: "2.2", value: "2.2" },
//   { label: "3.1", value: "3.1" },
// ];

// export default function LoginPage() {
//   const [busId, setBusId] = useState("");
//   const [password, setPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const router = useRouter();

//   useEffect(() => {
//     const savedBusId = localStorage.getItem("remembered_bus_id");
//     if (savedBusId) setBusId(savedBusId);
//   }, []);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!busId || !password.trim()) {
//       toast.error("Required", {
//         description: "Please select Bus ID and enter Vehicle Number!",
//       });
//       return;
//     }
//     setIsSubmitting(true);
//     const res = await signIn("credentials", {
//       email: busId,
//       password: password,
//       redirect: false,
//     });

//     if (res.ok) {
//       localStorage.setItem("remembered_bus_id", busId);
//       toast.success("Login Successful!");
//       router.push("/dashboard");
//     } else {
//       toast.error("Access Denied", { description: "Incorrect credentials." });
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     /* h-[100dvh] ensures it fits perfectly on mobile screens without scrolling */
//     <div className="relative flex h-[100dvh] w-full flex-col items-center justify-center bg-[#F8FAFC] px-6 overflow-hidden">
//       <div className="w-full max-w-sm space-y-8">
//         <div className="text-center space-y-2">
//           <div className="mx-auto w-16 h-16 bg-indigo-600 rounded-[24px] flex items-center justify-center shadow-2xl shadow-indigo-200">
//             <Lock className="text-white" size={28} strokeWidth={2.5} />
//           </div>
//           <h1 className="text-3xl font-black text-slate-900 tracking-tight">
//             Bus Portal
//           </h1>
//           <p className="text-slate-400 text-[11px] font-black uppercase tracking-[0.3em]">
//             Mission 92
//           </p>
//         </div>

//         <form className="space-y-5" onSubmit={handleSubmit} noValidate>
//           <div className="space-y-4">
//             {/* Bus ID Dropdown */}
//             <div className="group space-y-1">
//               <label className="text-[10px] font-black text-indigo-600 uppercase tracking-widest ml-1">
//                 Bus ID
//               </label>
//               <div className="relative flex items-center">
//                 <Bus
//                   size={20}
//                   className="absolute left-4 text-slate-400 z-10"
//                 />
//                 <select
//                   value={busId}
//                   onChange={(e) => setBusId(e.target.value)}
//                   className="w-full h-14 pl-12 pr-10 bg-white border-2 border-slate-100 rounded-2xl outline-none text-base font-bold text-slate-900 appearance-none cursor-pointer"
//                 >
//                   <option value="" disabled>
//                     Select Bus
//                   </option>
//                   {BUS_LIST.map((bus) => (
//                     <option key={bus.value} value={bus.value}>
//                       {bus.label}
//                     </option>
//                   ))}
//                 </select>
//                 <ChevronDown
//                   size={18}
//                   className="absolute right-4 text-slate-400 pointer-events-none"
//                 />
//               </div>
//             </div>

//             {/* Vehicle Number (Password) */}
//             <div className="group space-y-1">
//               <label className="text-[10px] font-black text-indigo-600 uppercase tracking-widest ml-1">
//                 Vehicle Number
//                 Password
//               </label>
//               <div className="relative flex items-center">
//                 <Lock
//                   size={20}
//                   className="absolute left-4 text-slate-400 group-focus-within:text-indigo-600"
//                 />
//                 <input
//                   type={showPassword ? "text" : "password"}
//                   placeholder="Enter password"
//                   value={password}
//                   className="w-full h-14 pl-12 pr-12 bg-white border-2 border-slate-100 rounded-2xl outline-none text-base font-bold text-slate-900 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-50 transition-all"
//                   onChange={(e) => setPassword(e.target.value)}
//                 />
//                 {/* Grey eye icon without hover colors */}
//                 <button
//                   type="button"
//                   onClick={() => setShowPassword(!showPassword)}
//                   className="absolute right-4 text-slate-300 transition-colors"
//                 >
//                   {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
//                 </button>
//               </div>
//             </div>
//           </div>

//           <button
//             type="submit"
//             disabled={isSubmitting}
//             className="w-full h-14 flex items-center justify-center bg-indigo-600 text-white rounded-[24px] font-black text-lg shadow-xl active:scale-[0.97] transition-all disabled:opacity-50"
//           >
//             {isSubmitting ? (
//               <Loader2 className="animate-spin" size={24} />
//             ) : (
//               <div className="flex items-center gap-2">
//                 <span>LOGIN</span>
//                 <ArrowRight size={22} strokeWidth={3} />
//               </div>
//             )}
//           </button>
//         </form>
//       </div>

//     </div>
//   );
// }

//ai
// "use client";
// import { useState, useEffect } from "react";
// import { signIn } from "next-auth/react";
// import { useRouter } from "next/navigation";
// import {
//   Eye, EyeOff, Lock, Bus, Loader2, ArrowRight,
//   ChevronDown, ShieldCheck, MapPin
// } from "lucide-react";
// import { toast } from "sonner";

// export default function LoginPage() {
//   const [role, setRole] = useState(null); // null, 'admin', 'zone', 'super'
//   const [busList, setBusList] = useState([]);
//   const [busId, setBusId] = useState("");
//   const [password, setPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const router = useRouter();

//   // Fetch only standard Bus IDs for the 'admin' role dropdown
//   useEffect(() => {
//     async function getBusList() {
//       try {
//         const res = await fetch("/api/auth/bus-list");
//         const data = await res.json();
//         // Filter out 'master' and 'Zone-' IDs for the basic Bus Admin dropdown
//         setBusList(data.filter(id => id !== "master" && !id.startsWith("Zone-")));
//       } catch (e) {
//         console.error("Failed to load bus list");
//       }
//     }
//     getBusList();
//   }, []);

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // Logic to determine the identifier for Atlas authentication
//     let identifier = busId;
//     if (role === 'super') identifier = "master"; // Forces 'master' as the username

//     if (!identifier || !password.trim()) {
//       toast.error("Required", { description: "Please complete all fields!" });
//       return;
//     }

//     setIsSubmitting(true);

//     // verify credentials against your Atlas 'admins' collection
//     const res = await signIn("credentials", {
//       email: identifier,
//       password: password,
//       redirect: false,
//     });

//     if (res?.ok) {
//       toast.success("Login Successful!");
//       // Verified redirection based on the authenticated role
//       if (role === 'super') router.push("/dashboard/master");
//       else if (role === 'zone') router.push("/dashboard/zone");
//       else router.push("/dashboard");
//     } else {
//       toast.error("Access Denied", { description: "Incorrect credentials." });
//       setIsSubmitting(false);
//     }
//   };

//   // STEP 1: ROLE SELECTION SCREEN
//   if (!role) {
//     return (
//       <div className="h-[100dvh] flex flex-col items-center justify-center bg-[#F8FAFC] px-6">
//         <div className="w-full max-w-sm space-y-8 text-center">
//           <div className="space-y-2">
//             <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Access Portal</h1>
//             <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em]">Select your role to continue</p>
//           </div>

//           <div className="grid grid-cols-1 gap-4">
//             <RoleButton
//               icon={<Bus />}
//               label="Bus Admin"
//               desc="Manage specific bus attendance"
//               onClick={() => setRole('admin')}
//               color="bg-indigo-600"
//             />
//             <RoleButton
//               icon={<MapPin />}
//               label="Zone Admin"
//               desc="View entire zone statistics"
//               onClick={() => setRole('zone')}
//               color="bg-emerald-600"
//             />
//             <RoleButton
//               icon={<ShieldCheck />}
//               label="Super Admin"
//               desc="Master system control"
//               onClick={() => setRole('super')}
//               color="bg-slate-900"
//             />
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // STEP 2: DYNAMIC LOGIN FORM (Verified Login for all 3 tiers)
//   return (
//     <div className="h-[100dvh] flex flex-col items-center justify-center bg-[#F8FAFC] px-6">
//       <div className="w-full max-w-sm space-y-6">
//         <button
//           onClick={() => { setRole(null); setBusId(""); setPassword(""); }}
//           className="flex items-center gap-2 text-slate-400 font-bold text-xs uppercase tracking-widest hover:text-indigo-600 transition-colors"
//         >
//           <ArrowRight className="rotate-180" size={16} /> Back to roles
//         </button>

//         <div className="bg-white p-8 rounded-[40px] shadow-2xl shadow-slate-200 border border-slate-100 space-y-6">
//           <div className="text-center space-y-1">
//             <div className="mx-auto w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center mb-2">
//                {role === 'admin' ? <Bus className="text-indigo-600"/> : role === 'zone' ? <MapPin className="text-emerald-600"/> : <ShieldCheck className="text-slate-900"/>}
//             </div>
//             <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">
//               {role === 'admin' ? 'Bus Login' : role === 'zone' ? 'Zone Login' : 'Master Login'}
//             </h2>
//             <p className="text-slate-400 text-[9px] font-black uppercase tracking-widest">Verification Required</p>
//           </div>

//           <form onSubmit={handleSubmit} className="space-y-5">
//             <div className="space-y-4">
//               <div className="space-y-1">
//                 <label className="text-[10px] font-black text-indigo-600 uppercase tracking-widest ml-1">Identity</label>
//                 <div className="relative flex items-center">
//                   {role === 'admin' ? (
//                     <>
//                       <Bus size={18} className="absolute left-4 text-slate-400" />
//                       <select
//                         value={busId}
//                         onChange={(e) => setBusId(e.target.value)}
//                         className="w-full h-12 pl-12 pr-10 bg-slate-50 border-2 border-transparent focus:border-indigo-600 rounded-2xl outline-none font-bold text-slate-900 appearance-none cursor-pointer"
//                       >
//                         <option value="">Select Bus ID</option>
//                         {busList.map(id => <option key={id} value={id}>{id}</option>)}
//                       </select>
//                       <ChevronDown size={16} className="absolute right-4 text-slate-400 pointer-events-none" />
//                     </>
//                   ) : role === 'zone' ? (
//                     <>
//                       <MapPin size={18} className="absolute left-4 text-slate-400" />
//                       <select
//                         value={busId}
//                         onChange={(e) => setBusId(e.target.value)}
//                         className="w-full h-12 pl-12 pr-10 bg-slate-50 border-2 border-transparent focus:border-indigo-600 rounded-2xl outline-none font-bold text-slate-900 appearance-none cursor-pointer"
//                       >
//                         <option value="">Select Zone</option>
//                         {[1, 2, 3, 4, 5, 6].map(num => <option key={num} value={`Zone-${num}`}>Zone {num}</option>)}
//                       </select>
//                       <ChevronDown size={16} className="absolute right-4 text-slate-400 pointer-events-none" />
//                     </>
//                   ) : (
//                     <>
//                       <ShieldCheck size={18} className="absolute left-4 text-slate-400" />
//                       <div className="w-full h-12 pl-12 flex items-center bg-slate-100 rounded-2xl font-bold text-slate-600 border-2 border-transparent">
//                         Master Administrator
//                       </div>
//                     </>
//                   )}
//                 </div>
//               </div>

//               <div className="space-y-1">
//                 <label className="text-[10px] font-black text-indigo-600 uppercase tracking-widest ml-1">Password</label>
//                 <div className="relative flex items-center">
//                   <Lock size={18} className="absolute left-4 text-slate-400" />
//                   <input
//                     type={showPassword ? "text" : "password"}
//                     placeholder="••••••••"
//                     value={password}
//                     className="w-full h-12 pl-12 pr-12 bg-slate-50 border-2 border-transparent focus:border-indigo-600 rounded-2xl outline-none font-bold text-slate-900 transition-all"
//                     onChange={(e) => setPassword(e.target.value)}
//                   />
//                   <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 text-slate-300">
//                     {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
//                   </button>
//                 </div>
//               </div>
//             </div>

//             <button
//               disabled={isSubmitting}
//               className="w-full h-14 bg-indigo-600 text-white rounded-3xl font-black text-sm tracking-widest shadow-xl shadow-indigo-100 active:scale-95 transition-all flex items-center justify-center gap-2"
//             >
//               {isSubmitting ? <Loader2 className="animate-spin" /> : <>LOGIN <ArrowRight size={18} /></>}
//             </button>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }

// function RoleButton({ icon, label, desc, onClick, color }) {
//   return (
//     <button
//       onClick={onClick}
//       className="group w-full bg-white p-4 rounded-[32px] border-2 border-slate-100 hover:border-indigo-600 hover:shadow-xl transition-all flex items-center gap-5 text-left active:scale-95"
//     >
//       <div className={`${color} h-14 w-14 rounded-2xl flex items-center justify-center text-white shadow-lg`}>
//         {icon}
//       </div>
//       <div>
//         <h3 className="font-black text-slate-900 uppercase text-sm tracking-tight">{label}</h3>
//         <p className="text-slate-400 text-[10px] font-bold">{desc}</p>
//       </div>
//       <ArrowRight className="ml-auto text-slate-200 group-hover:text-indigo-600 transition-colors" size={20} />
//     </button>
//   );
// }

//api
// "use client";
// import { useState, useEffect, useMemo } from "react";
// import { signIn } from "next-auth/react";
// import { useRouter } from "next/navigation";
// import { Eye, EyeOff, Lock, Bus, Loader2, ArrowRight, ChevronDown, ShieldCheck, MapPin } from "lucide-react";
// import { toast } from "sonner";

// export default function LoginPage() {
//   const [role, setRole] = useState(null); // null, 'admin', 'zone', 'super'
//   const [apiData, setApiData] = useState([]);
//   const [selectedZone, setSelectedZone] = useState("");
//   const [selectedBusId, setSelectedBusId] = useState("");
//   const [password, setPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [isLoading, setIsLoading] = useState(true);
//   const router = useRouter();

//   useEffect(() => {
//     async function getData() {
//       try {
//         const res = await fetch("/api/auth/bus-list");
//         const json = await res.json();
//         if (json.success) setApiData(json.data);
//       } catch (e) {
//         toast.error("API Error", { description: "Failed to load bus details." });
//       } finally {
//         setIsLoading(false);
//       }
//     }
//     getData();
//   }, []);

//   const zones = useMemo(() => [...new Set(apiData.map(item => item.zone))].sort(), [apiData]);

//   const filteredBusIds = useMemo(() => {
//     if (!selectedZone) return [];
//     return apiData
//       .filter(item => item.zone === selectedZone)
//       .map(item => String(item.busId))
//       .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
//   }, [apiData, selectedZone]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     let identifier = selectedBusId;
//     if (role === 'zone') identifier = selectedZone;
//     if (role === 'super') identifier = "master";

//     if (!identifier || !password.trim()) {
//       toast.error("Required", { description: "Please complete all fields!" });
//       return;
//     }

//     setIsSubmitting(true);
//     const res = await signIn("credentials", {
//       email: identifier,
//       password: password,
//       redirect: false,
//     });

//     if (res?.ok) {
//       toast.success("Login Successful!");
//       if (role === 'super') router.push("/dashboard/master");
//       else if (role === 'zone') router.push("/dashboard/zone");
//       else router.push("/dashboard");
//     } else {
//       toast.error("Access Denied", { description: "Incorrect credentials." });
//       setIsSubmitting(false);
//     }
//   };

//   if (isLoading) return <div className="h-[100dvh] flex items-center justify-center bg-[#F8FAFC]"><Loader2 className="animate-spin text-indigo-600" size={40} /></div>;

//   if (!role) return (
//     <div className="h-[100dvh] flex flex-col items-center justify-center bg-[#F8FAFC] px-6">
//       <div className="w-full max-w-sm space-y-8 text-center">
//         <h1 className="text-3xl font-black text-slate-900 uppercase">Access Portal</h1>
//         <div className="grid grid-cols-1 gap-4">
//           <RoleButton icon={<Bus />} label="Bus Admin" desc="Bus specific" onClick={() => setRole('admin')} color="bg-indigo-600" />
//           <RoleButton icon={<MapPin />} label="Zone Admin" desc="Full zone view" onClick={() => setRole('zone')} color="bg-emerald-600" />
//           <RoleButton icon={<ShieldCheck />} label="Super Admin" desc="Master control" onClick={() => setRole('super')} color="bg-slate-900" />
//         </div>
//       </div>
//     </div>
//   );

//   return (
//     <div className="h-[100dvh] flex flex-col items-center justify-center bg-[#F8FAFC] px-6">
//       <div className="w-full max-w-sm space-y-6">
//         <button onClick={() => { setRole(null); setSelectedZone(""); setSelectedBusId(""); setPassword(""); }} className="flex items-center gap-2 text-slate-400 font-bold text-xs uppercase tracking-widest hover:text-indigo-600 transition-colors"><ArrowRight className="rotate-180" size={16} /> Back</button>
//         <div className="bg-white p-8 rounded-[40px] shadow-2xl border border-slate-100 space-y-6">
//           <div className="text-center space-y-1">
//             <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">{role} Portal</h2>
//             <p className="text-slate-400 text-[9px] font-black uppercase tracking-widest">Sign in to continue</p>
//           </div>
//           <form onSubmit={handleSubmit} className="space-y-5">
//             {(role === 'admin' || role === 'zone') && (
//               <div className="space-y-1">
//                 <label className="text-[10px] font-black text-indigo-600 uppercase tracking-widest ml-1">Zone</label>
//                 <div className="relative flex items-center">
//                   <MapPin size={18} className="absolute left-4 text-slate-400" />
//                   <select value={selectedZone} onChange={(e) => { setSelectedZone(e.target.value); setSelectedBusId(""); }} className="w-full h-12 pl-12 pr-10 bg-slate-50 border-2 border-transparent focus:border-indigo-600 rounded-2xl outline-none font-bold text-slate-900 appearance-none">
//                     <option value="">Select Zone</option>
//                     {zones.map(z => <option key={z} value={z}>{z}</option>)}
//                   </select>
//                   <ChevronDown size={16} className="absolute right-4 text-slate-400 pointer-events-none" />
//                 </div>
//               </div>
//             )}
//             {role === 'admin' && (
//               <div className={`space-y-1 ${!selectedZone ? 'opacity-40' : ''}`}>
//                 <label className="text-[10px] font-black text-indigo-600 uppercase tracking-widest ml-1">Bus Number</label>
//                 <div className="relative flex items-center">
//                   <Bus size={18} className="absolute left-4 text-slate-400" />
//                   <select disabled={!selectedZone} value={selectedBusId} onChange={(e) => setSelectedBusId(e.target.value)} className="w-full h-12 pl-12 pr-10 bg-slate-50 border-2 border-transparent focus:border-indigo-600 rounded-2xl outline-none font-bold text-slate-900 appearance-none">
//                     <option value="">{selectedZone ? "Select Bus" : "Select Zone First"}</option>
//                     {filteredBusIds.map(id => <option key={id} value={id}>Bus {id}</option>)}
//                   </select>
//                   <ChevronDown size={16} className="absolute right-4 text-slate-400 pointer-events-none" />
//                 </div>
//               </div>
//             )}
//             <div className="space-y-1">
//               <label className="text-[10px] font-black text-indigo-600 uppercase tracking-widest ml-1">Password</label>
//               <div className="relative flex items-center">
//                 <Lock size={18} className="absolute left-4 text-slate-400" />
//                 <input type={showPassword ? "text" : "password"} placeholder="••••••••" value={password} className="w-full h-12 pl-12 pr-12 bg-slate-50 border-2 border-transparent focus:border-indigo-600 rounded-2xl outline-none font-bold text-slate-900" onChange={(e) => setPassword(e.target.value)} />
//                 <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 text-slate-300">{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button>
//               </div>
//             </div>
//             <button disabled={isSubmitting} className="w-full h-14 bg-indigo-600 text-white rounded-3xl font-black text-sm tracking-widest shadow-xl active:scale-95 flex items-center justify-center gap-2 transition-all">
//               {isSubmitting ? <Loader2 className="animate-spin" /> : <>PROCEED <ArrowRight size={18} /></>}
//             </button>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }

// function RoleButton({ icon, label, desc, onClick, color }) {
//   return (
//     <button onClick={onClick} className="group w-full bg-white p-4 rounded-[32px] border-2 border-slate-100 hover:border-indigo-600 transition-all flex items-center gap-5 active:scale-95 text-left">
//       <div className={`${color} h-14 w-14 rounded-2xl flex items-center justify-center text-white shadow-lg`}>{icon}</div>
//       <div className="flex-1"><h3 className="font-black text-slate-900 uppercase text-sm tracking-tight">{label}</h3><p className="text-slate-400 text-[10px] font-bold">{desc}</p></div>
//       <ArrowRight className="text-slate-200 group-hover:text-indigo-600" size={20} />
//     </button>
//   );
// }

//api 2
// "use client";
// import { useRouter } from "next/navigation";
// import { Bus, MapPin, ShieldCheck, ArrowRight } from "lucide-react";

// export default function RoleSelectionPage() {
//   const router = useRouter();

//   return (
//     <div className="h-[100dvh] flex flex-col items-center justify-center bg-[#F8FAFC] px-6">
//       <div className="w-full max-w-sm space-y-8 text-center">
//         <div className="space-y-2">
//           <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tight">Access Portal</h1>
//           <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em]">Select your role to continue</p>
//         </div>

//         <div className="grid grid-cols-1 gap-4">
//           <RoleButton icon={<Bus />} label="Bus Admin" desc="Manage specific bus" onClick={() => router.push("/login/bus")} color="bg-indigo-600" />
//           <RoleButton icon={<MapPin />} label="Zone Admin" desc="View zone statistics" onClick={() => router.push("/login/zone")} color="bg-emerald-600" />
//           <RoleButton icon={<ShieldCheck />} label="Super Admin" desc="Master system control" onClick={() => router.push("/login/master")} color="bg-slate-900" />
//         </div>
//       </div>
//     </div>
//   );
// }

// function RoleButton({ icon, label, desc, onClick, color }) {
//   return (
//     <button onClick={onClick} className="group w-full bg-white p-4 rounded-[32px] border-2 border-slate-100 hover:border-indigo-600 transition-all flex items-center gap-5 text-left active:scale-95">
//       <div className={`${color} h-14 w-14 rounded-2xl flex items-center justify-center text-white shadow-lg`}>{icon}</div>
//       <div className="flex-1"><h3 className="font-black text-slate-900 uppercase text-sm tracking-tight">{label}</h3><p className="text-slate-400 text-[10px] font-bold">{desc}</p></div>
//       <ArrowRight className="ml-auto text-slate-200 group-hover:text-indigo-600 transition-colors" size={20} />
//     </button>
//   );
// }

// apk
"use client";
import Link from "next/link";
import Image from "next/image"; // Import the Image component
import {
  Bus,
  MapPin,
  ShieldCheck,
  ArrowRight,
  Download,
} from "lucide-react";

export default function RoleSelectionPage() {
  const EXPO_LINK = "https://expo.dev/artifacts/eas/c9eBwbao97QFdLFtQEHpkG.apk";

  return (
    <div className="h-[100dvh] flex flex-col items-center justify-center bg-[#F8FAFC] px-6 overflow-hidden relative font-sans">
      <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-indigo-50 rounded-full blur-3xl opacity-50" />
      <div className="absolute bottom-[-10%] left-[-10%] w-64 h-64 bg-emerald-50 rounded-full blur-3xl opacity-50" />

      <div className="w-full max-w-sm space-y-10 text-center relative z-10">
        <div className="space-y-2">
          {/* LOGO REPLACEMENT HERE */}
          <div className="inline-flex items-center justify-center p-2 bg-white  mb-4overflow-hidden">
             <Image 
               src="/logo.png" 
               alt="App Logo" 
               width={100} 
               height={100} 
               className="object-contain"
               priority 
             />
          </div>
          <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tight">
            Access Portal
          </h1>
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em]">
            Select your role to continue
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <RoleButton
            icon={<Bus />}
            label="Bus Admin"
            desc="Manage specific bus"
            href="/login/bus"
            color="bg-indigo-600"
          />
          <RoleButton
            icon={<MapPin />}
            label="Zone Admin"
            desc="View zone statistics"
            href="/login/zone"
            color="bg-emerald-600"
          />
          <RoleButton
            icon={<ShieldCheck />}
            label="Super Admin"
            desc="Master system control"
            href="/login/master"
            color="bg-slate-900"
          />
        </div>

        <div className="pt-6">
          <a
            href={EXPO_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative inline-flex items-center gap-3 px-8 py-4 bg-slate-900 rounded-[24px] text-white transition-all active:scale-95 shadow-xl shadow-slate-200 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] transition-transform" />

            <div className="p-2 bg-white/10 rounded-xl">
              <Download
                size={18}
                className="group-hover:translate-y-0.5 transition-transform"
              />
            </div>

            <div className="flex flex-col items-start justify-center leading-none">
              <span className="text-[14px] font-black tracking-tight uppercase">
                Download APK
              </span>
            </div>
          </a>
        </div>
      </div>

      <style jsx global>{`
        @keyframes shimmer {
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </div>
  );
}

function RoleButton({ icon, label, desc, href, color }) {
  return (
    <Link
      href={href}
      className="group w-full bg-white p-4 rounded-[32px] border-2 border-slate-100 hover:border-indigo-600 transition-all flex items-center gap-5 text-left active:scale-95 shadow-sm hover:shadow-md"
    >
      <div
        className={`${color} h-14 w-14 rounded-2xl flex items-center justify-center text-white shadow-lg`}
      >
        {icon}
      </div>
      <div className="flex-1">
        <h3 className="font-black text-slate-900 uppercase text-sm tracking-tight">
          {label}
        </h3>
        <p className="text-slate-400 text-[10px] font-bold tracking-tight">
          {desc}
        </p>
      </div>
      <ArrowRight
        className="ml-auto text-slate-200 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all"
        size={20}
      />
    </Link>
  );
}