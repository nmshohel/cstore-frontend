import Header from "@/components/Layout/Header";
import { getSession } from "next-auth/react";
import AdminSidebar from "@/components/Layout/AdminSidebar";
import Admin from "@/components/Pages/Admin";
import { useEffect, useState } from "react";
import ComplainReport from "@/components/Reports/Complain";
import ElectricityReport from "@/components/Reports/Electricity";

export async function getServerSideProps(context) {
  const session = await getSession(context);

  try {
    const zonalCode = session?.zonal_code?.zonal_code || ''; // Handle null or undefined session
    const res = await fetch(`https://pbsactivities.onrender.com/electricity/${zonalCode}`);
    const data = await res.json();
    const res1 = await fetch(`https://pbsactivities.onrender.com/electricityAll/${zonalCode}`);
    const data1 = await res1.json();
    const resComplain = await fetch(`http://localhost:5000/complain/${zonalCode}`);
    const dataComplain = await resComplain.json();
    const res1Complain = await fetch(`http://localhost:5000/complainAll/${zonalCode}`);
    const data1Complain = await res1Complain.json();

    return {
      props: {
        electricity: data.data,
        electricity1: data1.data,
        complain: dataComplain.data,
        complain1: data1Complain.data,
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
      },
      // revalidate: 10,
    };
  }
}
const AdminPage = ({ zonals,context ,electricity1,complain1}) => {
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
        </AdminSidebar>
      </Header>
    </div>
    );
};
export default AdminPage;

// AdminPage.getLayout = function getLayout(page) {
//   return (
//     <Header>
//     <AdminSidebar setZonalCode={setZonalCode}>
//       {page}
//     </AdminSidebar>
//   </Header >
//   )
// }