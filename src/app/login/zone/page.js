// import RoleLoginForm from "../../../components/RoleLoginForm";

// export default function ZoneLoginPage() {
//   return (
//     <RoleLoginForm 
//       role="zone" 
//       title="Zone Admin Login" 
//       colorClass="bg-emerald-600" 
//     />
//   );
// }

import RoleLoginForm from "../../../components/RoleLoginForm";

async function getZoneData() {
  const url = "https://bus-traker-backend-82zs.vercel.app/api/admin/login";
  // Next.js server-side fetch with 1-minute revalidation
  const res = await fetch(url, { next: { revalidate: 60 } }); 
  const json = await res.json();
  
  // Return the data array if successful, otherwise empty array
  return json.success ? json.data : [];
}

export default async function ZoneLoginPage() {
  const data = await getZoneData();

  return (
    <RoleLoginForm 
      role="zone" 
      title="Zone Admin Login" 
      colorClass="bg-emerald-600" 
      initialData={data} 
    />
  );
}