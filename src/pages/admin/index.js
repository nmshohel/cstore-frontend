// import Header from "@/components/Layout/Header";
// import { getSession } from "next-auth/react";
// import AdminSidebar from "@/components/Layout/AdminSidebar";
// import Admin from "@/components/Pages/Admin";
// import { useEffect, useState } from "react";
// import ComplainReport from "@/components/Reports/Complain";
// import ElectricityReport from "@/components/Reports/Electricity";
// import AddUser from "@/components/Pages/AddUser";
// import ManageUsers from "@/components/Pages/ManageUsers";

// export async function getServerSideProps(context) {
//   const session = await getSession(context);

//   try {
//     const pbsCode = session?.pbs_code?.pbs_code || ''; // Handle null or undefined session
//     const zonalCode = session?.zonal_code?.zonal_code || ''; // Handle null or undefined session
//     const res = await fetch(`https://pbsactivities.onrender.com/electricity/${zonalCode}`);
//     const data = await res.json();
//     const res1 = await fetch(`https://pbsactivities.onrender.com/electricityAll/${zonalCode}`);
//     const data1 = await res1.json();
//     const resComplain = await fetch(`http://localhost:5000/complain/${zonalCode}`);
//     const dataComplain = await resComplain.json();
//     const res1Complain = await fetch(`http://localhost:5000/complainAll/${zonalCode}`);
//     const data1Complain = await res1Complain.json();
//     const resZonal = await fetch(`http://localhost:5000/zonals/${pbsCode}`);
//     const dataZonal = await resZonal.json();
//     const resUsers = await fetch(`http://localhost:5000/users/${pbsCode}`);
//     const dataUsers = await resUsers.json();

//     return {
//       props: {
//         electricity: data.data,
//         electricity1: data1.data,
//         complain: dataComplain.data,
//         complain1: data1Complain.data,
//         zonal: dataZonal,
//         users: dataUsers,
//       },
//       // revalidate: 10,
//     };
//   } catch (error) {
//     console.error('Error fetching electricity data:', error);
//     return {
//       props: {
//         electricity: [],
//         electricity1: [],
//         complain: [],
//         complain1: [],
//         zonal:[],
//         users:[]
//       },
//       // revalidate: 10,
//     };
//   }
// }
// const AdminPage = ({ zonals,context ,electricity1,complain1,zonal,users}) => {
//   const session = getSession(context);
//   const [zonalCode, setZonalCode] = useState(session?.zonal_code?.zonal_code||null);
//   const [formId, setFormId] = useState("0");
// // console.log(category);
//     return (
//        <div>
//       <Header>
//         <AdminSidebar setZonalCode={setZonalCode} setFormId={setFormId}>
//           {/* <Admin zonals={zonals} ccs={ccs}></Admin> */}
//           {(formId == 1||formId == 0) && <ElectricityReport electricity={electricity1}></ElectricityReport>}
//           {(formId == 2||formId == 0) && <ComplainReport complain={complain1}></ComplainReport>}
//           {(formId == 3) && <AddUser zonal={zonal}></AddUser>}
//           {(formId == 4||formId == 0) && <ManageUsers users={users}></ManageUsers>}
//         </AdminSidebar>
//       </Header>
//     </div>
//     );
// };
// export default AdminPage;



import Header from "@/components/Layout/Header";

import AdminSidebar from "@/components/Layout/AdminSidebar";
// import Admin from "@/components/Pages/Admin";
import { useEffect, useState } from "react";
import PBS from "@/components/Pages/Office/PBS";
import Zonal from "@/components/Pages/Office/Zonal";
import CC from "@/components/Pages/Office/CC";
import ManageCategory from "@/components/Pages/Category/ManageCategory";
import ManageSubCategory from "@/components/Pages/Category/ManageSubCategory";
import ManageUsers from "@/components/Pages/Users/ManageUsers";
import ManageDepartment from "@/components/Pages/Department/ManageDepartment";
import ManageDesignation from "@/components/Pages/Department/ManageDesignation";
import AddZonal from "@/components/Pages/Office/AddZonal";
import AddCC from "@/components/Pages/Office/AddCC";
import AddCategory from "@/components/Pages/Category/AddCategory";
import AddSubCategory from "@/components/Pages/Category/AddSubCategory";
import AddDepartment from "@/components/Pages/Department/AddDepartment";
import AddDesignation from "@/components/Pages/Department/AddDesignation";
import AddUser from "@/components/Pages/Users/AddUser";
import { headers } from "next/dist/client/components/headers";
import { getSession } from "next-auth/react";
export async function getServerSideProps(context) {
  const session = await getSession(context);
  // const session = {
  //   mobileNo: { mobileNo: '01866115239' },
  //   pbs_code: { pbs_code: '29' },
  //   zonal_code: { zonal_code: '2902' },
  //   role: { role: 'admin' },
  //   accessToken: { accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtb2JpbGVObyI6IjAxODY2MTE1MjM5Iiwicm9sZSI6ImFkbWluIiwiem9uYWxDb2RlIjoiMjkwMiIsImNvbXBsYWluQ29kZSI6bnVsbCwic3Vic3RhdGlvbkNvZGUiOm51bGwsInBic0NvZGUiOiIyOSIsImlhdCI6MTY5NTU2Mjk2NSwiZXhwIjoxNjk1NjQ5MzY1fQ.Ekk2bkaTPm33H0D0seGOJR4OBMbDQAvM9_9qrtgFBPM" },
  // }
  console.log("Session", session);
  // if (!session || session.role.role !== "admin") {
  //   return {
  //     redirect: {
  //       destination: "/",
  //       permanent: false,
  //     },
  //   };
  // }


  const accessToken = session?.accessToken?.accessToken;
  const getMethod = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: accessToken,
    },
  }
  const resItemType = await fetch(`${process.env.BACKEND_URL}/api/v1/item-type`, getMethod);
  const dataItemType = await resItemType.json();
  const resCategory = await fetch(`${process.env.BACKEND_URL}/api/v1/category`, getMethod);
  const dataCategory = await resCategory.json();
  const resSubCategory = await fetch(`${process.env.BACKEND_URL}/api/v1/sub-category`, getMethod);
  const dataSubCategory = await resSubCategory.json();
  const resZonal = await fetch(`${process.env.BACKEND_URL}/api/v1/zonal/${session?.pbs_code?.pbs_code}`, getMethod);
  const dataZonal = await resZonal.json();
  const resCC = await fetch(`${process.env.BACKEND_URL}/api/v1/complain/${session?.pbs_code?.pbs_code}`, getMethod);
  const dataCC = await resCC.json();
  const resDepartment = await fetch(`${process.env.BACKEND_URL}/api/v1/department`, getMethod);
  const dataDepartment = await resDepartment.json();
  const resDesignation = await fetch(`${process.env.BACKEND_URL}/api/v1/designation`, getMethod);
  const dataDesignation = await resDesignation.json();
  const resUsers = await fetch(`${process.env.BACKEND_URL}/api/v1/user/${session?.pbs_code?.pbs_code}`, getMethod);
  const dataUsers = await resUsers.json();

  // //console.log(data);
  return {
    props: {
      itemType: dataItemType.data || [],
      categroys: dataCategory.data || [],
      subcategroys: dataSubCategory.data || [],
      designations: dataDesignation.data || [],
      departments: dataDepartment.data || [],
      users: dataUsers.data || [],
      zonals: dataZonal.data || [],
      ccs: dataCC.data || []
    },
  };
}
const AdminPage = ({ itemType, categroys, subcategroys, designations, departments, users, zonals, ccs, context }) => {
  const session = getSession(context);
  const [zonalCode, setZonalCode] = useState(session?.zonal_code?.zonal_code || null);
  const [formId, setformId] = useState(1);

  return (
    <div>
      <Header>
        <AdminSidebar setZonalCode={setZonalCode} setformId={setformId}>
          {/* <PBS zonals={zonals} ccs={ccs}></PBS> */}
          {formId == 1 && <AddSubCategory categroys={categroys}></AddSubCategory>}
          {formId == 2 && <ManageSubCategory categroys={categroys} subcategroys={subcategroys}></ManageSubCategory>}
          {formId == 3 && <AddCategory itemType={itemType}></AddCategory>}
          {formId == 4 && <ManageCategory categroys={categroys} itemType={itemType}></ManageCategory>}
          {formId == 5 && <AddDesignation departments={departments}></AddDesignation>}
          {formId == 6 && <ManageDesignation designations={designations}></ManageDesignation>}
          {formId == 7 && <AddDepartment></AddDepartment>}
          {formId == 8 && <ManageDepartment departments={departments}></ManageDepartment>}
          {formId == 9 && <AddUser></AddUser>}
          {formId == 10 && <ManageUsers users={users}></ManageUsers>}
          {formId == 11 && <AddZonal ></AddZonal>}
          {formId == 12 && <AddCC zonals={zonals} ></AddCC>}
          {formId == 13 && <Zonal zonals={zonals} ></Zonal>}
          {formId == 14 && <CC ccs={ccs}></CC>}
        </AdminSidebar>
      </Header>
    </div>
  );
};
export default AdminPage;

