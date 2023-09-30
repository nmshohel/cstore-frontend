import Header from "@/components/Layout/Header";
import { getSession } from "next-auth/react";
import AdminSidebar from "@/components/Layout/AdminSidebar";
import Admin from "@/components/Pages/Admin";
import { useEffect, useState } from "react";
import ComplainReport from "@/components/Reports/Complain";
import ElectricityReport from "@/components/Reports/Electricity";
import AddUser from "@/components/Pages/AddUser";
import ManageUsers from "@/components/Pages/ManageUsers";

export async function getServerSideProps(context) {
  const session = await getSession(context);

  try {
    const pbsCode = session?.pbs_code?.pbs_code || ''; // Handle null or undefined session
    const zonalCode = session?.zonal_code?.zonal_code || ''; // Handle null or undefined session
    const res = await fetch(`https://pbsactivities.onrender.com/electricity/${zonalCode}`);
    const data = await res.json();
    const res1 = await fetch(`https://pbsactivities.onrender.com/electricityAll/${zonalCode}`);
    const data1 = await res1.json();
    const resComplain = await fetch(`http://localhost:5000/complain/${zonalCode}`);
    const dataComplain = await resComplain.json();
    const res1Complain = await fetch(`http://localhost:5000/complainAll/${zonalCode}`);
    const data1Complain = await res1Complain.json();
    const resZonal = await fetch(`http://localhost:5000/zonals/${pbsCode}`);
    const dataZonal = await resZonal.json();
    const resUsers = await fetch(`http://localhost:5000/users/${pbsCode}`);
    const dataUsers = await resUsers.json();

    return {
      props: {
        electricity: data.data,
        electricity1: data1.data,
        complain: dataComplain.data,
        complain1: data1Complain.data,
        zonal: dataZonal,
        users: dataUsers,
      },
      // revalidate: 10,
    };
  } catch (error) {
    console.error('Error fetching electricity data:', error);
    return {
      props: {
        electricity: [],
        electricity1: [],
        complain: [],
        complain1: [],
        zonal:[],
        users:[]
      },
      // revalidate: 10,
    };
  }
}
const AdminPage = ({ zonals,context ,electricity1,complain1,zonal,users}) => {
  const session = getSession(context);
  const [zonalCode, setZonalCode] = useState(session?.zonal_code?.zonal_code||null);
  const [formId, setFormId] = useState("0");
// console.log(category);
    return (
       <div>
      <Header>
        <AdminSidebar setZonalCode={setZonalCode} setFormId={setFormId}>
          {/* <Admin zonals={zonals} ccs={ccs}></Admin> */}
          {(formId == 1||formId == 0) && <ElectricityReport electricity={electricity1}></ElectricityReport>}
          {(formId == 2||formId == 0) && <ComplainReport complain={complain1}></ComplainReport>}
          {(formId == 3) && <AddUser zonal={zonal}></AddUser>}
          {(formId == 4||formId == 0) && <ManageUsers users={users}></ManageUsers>}
        </AdminSidebar>
      </Header>
    </div>
    );
};
export default AdminPage;
