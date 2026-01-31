// import RoleLoginForm from "../../../components/RoleLoginForm";

// export default function Page() {
//   return <RoleLoginForm role="super" title="Super Admin Login" colorClass="bg-slate-900" identifierLabel="Admin ID" placeholder="master" />;
// }



import RoleLoginForm from "../../../components/RoleLoginForm";

export default function MasterLoginPage() {
  return (
    <RoleLoginForm 
      role="super" 
      title="Super Admin Login" 
      colorClass="bg-slate-900" 
      initialData={[]} 
    />
  );
}