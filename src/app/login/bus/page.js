// import RoleLoginForm from "../../../components/RoleLoginForm";

// export default function BusLoginPage() {
//   return (
//     <RoleLoginForm 
//       role="admin" 
//       title="Bus Admin Login" 
//       colorClass="bg-indigo-600" 
//     />
//   );
// }



import RoleLoginForm from "../../../components/RoleLoginForm";

// This makes the fetch happen on the server during the request
async function getBusData(type) {
  const url = type === "zone" 
    ? "https://bus-traker-backend-82zs.vercel.app/api/admin/login"
    : "https://bus-traker-backend-82zs.vercel.app/api/buses/login-details";
  
  const res = await fetch(url, { next: { revalidate: 60 } });
  return res.json();
}

export default async function BusLoginPage() {
  const initialData = await getBusData("bus"); // Fetch on server

  return (
    <RoleLoginForm 
      role="admin" 
      title="Bus Admin Login" 
      colorClass="bg-indigo-600" 
      initialData={initialData.success ? initialData.data : []}
    />
  );
}